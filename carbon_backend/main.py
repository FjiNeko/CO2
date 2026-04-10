from fastapi import FastAPI, Body, Depends, HTTPException, APIRouter, Request, BackgroundTasks
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from datetime import timedelta, datetime, timezone
import uvicorn
import pandas as pd

# ------------------------------------------
# 导入自定义安全与业务模块
# ------------------------------------------
from database import login_log_collection, rule_collection, _MONGO_DATABASE
from advanced_scraper import integrate_and_update_db 
from models import CarbonRecordSchema, ResponseModel
from auth import (
    create_access_token,
    get_current_user,
    ACCESS_TOKEN_EXPIRE_MINUTES,
    get_password_hash,
    verify_password,
    role_required  # v4.0 新增：工厂化角色校验
)
from ml_engine import analytics_engine  
from utils import get_ip_location

app = FastAPI(
    title="绿色消费账户系统 API",
    description="v4.0: 集成 RBAC 权限控制与机器学习预测的大数据后端",
    version="4.0.0"
)

# ------------------------------------------
# 1. 跨域中间件 (解决前后端分离调用的核心)
# ------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------------------------------
# 2. RBAC 模拟数据库 (正式版建议迁移至 MongoDB user_collection)
# ------------------------------------------
fake_users_db = {
    # 将 Key 修改为 testuser
    "testuser": { 
        "username": "testuser",
        "hashed_password": get_password_hash("123456"),
        "role": "admin",
        "disabled": False,
    },
    "user": {
        "username": "user",
        "hashed_password": get_password_hash("123456"),
        "role": "user",
        "disabled": False,
    }
}

v1_router = APIRouter(prefix="/api/v1")

# ------------------------------------------
# 3. 认证授权模块 (核心：注入 Role 到 JWT)
# ------------------------------------------
@v1_router.post("/auth/login", tags=["V4 认证系统"])
async def login_for_access_token(
    request: Request,
    form_data: OAuth2PasswordRequestForm = Depends()
):
    """登录接口：验证身份并记录全维度审计日志"""
    client_ip = request.client.host
    user_agent = request.headers.get("user-agent", "Unknown")
    location = await get_ip_location(client_ip)
    
    user_dict = fake_users_db.get(form_data.username)
    
    # 安全校验
    if not user_dict or not verify_password(form_data.password, user_dict["hashed_password"]):
        # 记录失败审计日志
        await login_log_collection.insert_one({
            "username": form_data.username,
            "status": "failed",
            "ip": client_ip,
            "timestamp": datetime.now(timezone.utc)
        })
        raise HTTPException(status_code=400, detail="用户名或密码错误")

    # 签发带角色标识的 Token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={
            "sub": user_dict["username"],
            "role": user_dict["role"] # 关键：RBAC 身份下发
        }, 
        expires_delta=access_token_expires
    )
    
    # 记录成功审计日志
    await login_log_collection.insert_one({
        "username": user_dict["username"],
        "status": "success",
        "ip": client_ip,
        "location": location,
        "timestamp": datetime.now(timezone.utc)
    })
    
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "role": user_dict["role"]
    }

# ------------------------------------------
# 4. C端 用户接口 (普通用户/管理员均可访问)
# -----------------------------------------

@v1_router.get("/user/login_history", tags=["V4 C端用户服务"])
async def get_login_history(current_user: dict = Depends(get_current_user)):
    """获取当前用户的登录审计日志"""
    username = current_user.get("username")
    # 按时间倒序取最近 10 条
    cursor = _MONGO_DATABASE["login_logs"].find({"username": username}).sort("timestamp", -1).limit(10)
    logs = await cursor.to_list(length=10)
    
    for log in logs:
        log["_id"] = str(log["_id"])
        # 格式化时间
        if isinstance(log["timestamp"], datetime):
            log["timestamp"] = log["timestamp"].strftime("%Y-%m-%d %H:%M:%S")
            
    return {"code": 200, "data": logs}

@v1_router.get("/user/me", tags=["V4 C端用户服务"])
async def read_users_me(current_user: dict = Depends(role_required(["user", "admin"]))):
    return {"user_info": current_user, "auth_status": "Valid"}

@v1_router.post("/user/record", response_model=ResponseModel, tags=["V4 C端用户服务"])
async def add_carbon_record(
    record: CarbonRecordSchema = Body(...),
    current_user: dict = Depends(role_required(["user", "admin"]))
):
    """提交低碳行为：动态关联爬虫系数并入库"""
    rule_doc = await rule_collection.find_one({"activity_type": record.activity_type})
    if not rule_doc:
        raise HTTPException(status_code=400, detail="该出行方式暂未纳入核算规则")
    
    carbon_points = round(record.value * rule_doc.get("factor", 0), 2)
    
    record_dict = {
        "user_id": current_user.get("username"),
        "activity_type": record.activity_type,
        "distance": record.value,
        "carbon_points": carbon_points,
        "created_at": datetime.now(timezone.utc),
        "status": "verified"
    }
    
    await _MONGO_DATABASE["user_activities"].insert_one(record_dict)
    return ResponseModel(code=200, message="积分发放成功", data={"points": carbon_points})
# main.py 
@v1_router.get("/user/my_stats", tags=["V4 C端用户服务"])
async def get_my_carbon_stats(current_user: dict = Depends(role_required(["user", "admin"]))):
    """获取当前登录用户的个人碳账户汇总数据"""
    username = current_user.get("username")
    
    # 从 MongoDB 聚合该用户的所有记录
    cursor = _MONGO_DATABASE["user_activities"].find({"user_id": username})
    user_data = await cursor.to_list(length=1000)
    
    if not user_data:
        return {"code": 200, "data": {"total_points": 0, "total_km": 0, "rank": "低碳萌新", "history": []}}

    df = pd.DataFrame(user_data)
    
    # 计算个人指标
    total_points = float(df['carbon_points'].sum())
    total_km = float(df['distance'].sum())
    
    # 简单的等级逻辑
    rank = "碳中和达人" if total_points > 500 else "绿行骑士" if total_points > 100 else "低碳萌新"
    
    # 按天聚合最近 7 天的个人趋势
    df['created_at'] = pd.to_datetime(df['created_at'])
    history_df = df.set_index('created_at').resample('D')['carbon_points'].sum().tail(7).reset_index()
    
    history = {
        "dates": history_df['created_at'].dt.strftime('%m-%d').tolist(),
        "points": history_df['carbon_points'].tolist()
    }

    return {
        "code": 200,
        "data": {
            "total_points": round(total_points, 2),
            "total_km": round(total_km, 2),
            "rank": rank,
            "history": history
        }
    }

@v1_router.get("/rank/top", tags=["V4 C端用户服务"])
async def get_carbon_ranking():
    """大数据聚合：计算全站减碳排行榜 Top 10"""
    pipeline = [
        # 1. 按用户ID分组，累加积分
        {
            "$group": {
                "_id": "$user_id",
                "total_points": {"$sum": "$carbon_points"},
                "count": {"$sum": 1}
            }
        },
        # 2. 降序排列
        {"$sort": {"total_points": -1}},
        # 3. 取前10名
        {"$limit": 10},
        # 4. 格式化输出
        {
            "$project": {
                "username": "$_id",
                "total_points": {"$round": ["$total_points", 2]},
                "activity_count": "$count",
                "_id": 0
            }
        }
    ]
    
    cursor = _MONGO_DATABASE["user_activities"].aggregate(pipeline)
    ranking_list = await cursor.to_list(length=10)
    
    return {
        "code": 200,
        "data": ranking_list
    }

# main.py

@v1_router.get("/mall/products", tags=["V4 C端用户服务"])
async def get_products():
    """获取商品列表"""
    products = await _MONGO_DATABASE["mall_products"].find().to_list(length=100)
    for p in products: p["_id"] = str(p["_id"])
    return {"code": 200, "data": products}

@v1_router.post("/mall/exchange", tags=["V4 C端用户服务"])
async def exchange_product(data: dict = Body(...), current_user: dict = Depends(get_current_user)):
    """兑换商品逻辑"""
    username = current_user.get("username")
    product_id = data.get("product_id")
    
    # 1. 查商品
    product = await _MONGO_DATABASE["mall_products"].find_one({"id": product_id})
    if not product or product["stock"] <= 0:
        raise HTTPException(status_code=400, detail="商品库存不足或不存在")
        
    # 2. 查用户当前积分 (通过之前的聚合逻辑计算)
    pipeline = [
        {"$match": {"user_id": username}},
        {"$group": {"_id": "$user_id", "total": {"$sum": "$carbon_points"}}}
    ]
    user_stats = await _MONGO_DATABASE["user_activities"].aggregate(pipeline).to_list(1)
    current_points = user_stats[0]["total"] if user_stats else 0
    
    if current_points < product["points"]:
        raise HTTPException(status_code=400, detail="积分不足，快去骑行赚积分吧！")
        
    # 3. 记录扣分行为 (在 user_activities 插入负分记录)
    exchange_record = {
        "user_id": username,
        "activity_type": f"EXCHANGE_{product['name']}",
        "distance": 0,
        "carbon_points": -product["points"], # 负分代表消耗
        "created_at": datetime.now(timezone.utc)
    }
    await _MONGO_DATABASE["user_activities"].insert_one(exchange_record)
    
    # 4. 减库存
    await _MONGO_DATABASE["mall_products"].update_one({"id": product_id}, {"$inc": {"stock": -1}})
    
    return {"code": 200, "message": "兑换成功！券码已发放到个人中心"}

@v1_router.get("/user/activities", tags=["V4 C端用户服务"])
async def get_user_activities(current_user: dict = Depends(get_current_user)):
    """获取当前用户的历史申报记录明细"""
    username = current_user.get("username")
    
    # 按照时间倒序查找该用户的记录，最多查 50 条
    cursor = _MONGO_DATABASE["user_activities"].find(
        {"user_id": username}
    ).sort("created_at", -1).limit(50)
    
    records = await cursor.to_list(length=50)
    
    # 格式化数据返回前端
    for r in records:
        r["_id"] = str(r["_id"])
        if "created_at" in r and r["created_at"]:
            if hasattr(r["created_at"], "strftime"):
                r["created_at"] = r["created_at"].strftime("%Y-%m-%d %H:%M:%S")
            
    return {"code": 200, "data": records}

# ------------------------------------------
# 5. B端 管理端接口 (严格锁定 Admin 权限)
# ------------------------------------------
@v1_router.get("/admin/dashboard", response_model=ResponseModel, tags=["V4 B端管理分析"])
async def get_dashboard_metrics(current_user: dict = Depends(role_required(["admin"]))):
    """大数据看板：调用 Pandas 引擎聚合分析"""
    analysis_result = await analytics_engine.generate_dashboard_metrics()
    return ResponseModel(code=200, message="聚合分析完成", data=analysis_result)

@v1_router.get("/admin/predict_trend", tags=["V4 B端管理分析"])
async def get_ai_prediction(current_user: dict = Depends(role_required(["admin"]))):
    """机器学习预测：调用 Scikit-learn 模型预测未来趋势"""
    # 实际调用 ml_engine 的预测方法
    prediction_data = await analytics_engine.get_future_prediction()
    return {"code": 200, "data": prediction_data}

@v1_router.post("/admin/trigger_spider", tags=["V4 B端管理分析"])
async def trigger_spider(
    background_tasks: BackgroundTasks,
    current_user: dict = Depends(role_required(["admin"]))
):
    """政务数据爬虫：异步启动不阻塞前端"""
    background_tasks.add_task(integrate_and_update_db)
    return {"code": 200, "message": "后台爬虫任务已分发"}

# ------------------------------------------
# 启动服务
# ------------------------------------------
app.include_router(v1_router)

if __name__ == "__main__":
    # reload=True 仅用于开发环境
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)