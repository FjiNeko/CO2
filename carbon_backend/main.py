from fastapi import FastAPI, Body, Depends, HTTPException, APIRouter, Request
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta, datetime, timezone
import uvicorn

# 导入自定义模块
from database import record_collection, login_log_collection, record_helper
from models import CarbonRecordSchema, ResponseModel
from auth import (
    create_access_token,
    get_current_user,
    ACCESS_TOKEN_EXPIRE_MINUTES,
    get_password_hash,
    verify_password
)
from ml_engine import analyze_and_predict_trend
from utils import get_ip_location

app = FastAPI(
    title="绿色消费账户系统API",
    description="基于FastAPI + Vue 3的大数据分析后端",
    version="3.0.0"
)


# ==========================================
# 模拟数据库 (用于快速演示登录逻辑，实际项目中应存入 MongoDB 的 user_collection)
# ==========================================
fake_users_db = {
    "testuser": {
        "username": "testuser",
        "hashed_password": get_password_hash("123456"), # 存入数据库的必须是 bcrypt 哈希值
        "disabled": False,
    }
}

# 模拟积分转换规则字典
CARBON_RULES = {
    "subway": 1.5,
    "bus": 1.2,
    "bicycle": 2.0
}

# 路由版本 V1 设置
v1_router = APIRouter(prefix="/api/v1")

# ------------------------------------------
# 模块 1：认证授权 (Auth)
# ------------------------------------------
@v1_router.post("/auth/login", tags=["V1 认证"])
async def login_for_access_token(
    request: Request, # 注入 Request 以获取网络信息
    form_data: OAuth2PasswordRequestForm = Depends()
):
    """用户登录接口，记录登录日志、IP归属地及设备信息"""
    
    # 获取网络与设备信息
    client_ip = request.client.host
    user_agent = request.headers.get("user-agent", "Unknown Device")
    location = await get_ip_location(client_ip)
    
    login_status = "failed"
    fail_reason = ""

    # 1. 查询用户
    user_dict = fake_users_db.get(form_data.username)
    if not user_dict:
        fail_reason = "用户不存在"
    # 2. 校验密码哈希
    elif not verify_password(form_data.password, user_dict["hashed_password"]):
        fail_reason = "密码错误"
    else:
        login_status = "success"

    # 3. 【核心逻辑】构造并异步插入登录日志到 MongoDB
    log_entry = {
        "username": form_data.username,
        "ip_address": client_ip,
        "location": location,
        "user_agent": user_agent,
        "status": login_status, # success 或 failed
        "fail_reason": fail_reason if login_status == "failed" else None,
        "timestamp": datetime.now(timezone.utc)
    }
    await login_log_collection.insert_one(log_entry)

    # 4. 【扩展功能】更新用户的总登录次数 (实际需更新 MongoDB 的 user_collection)
    # 示例 MongoDB 更新代码 (如果在真实数据库中)：
    # await user_collection.update_one(
    #     {"username": form_data.username},
    #     {"$inc": {"total_login_attempts": 1}} # $inc 原子操作自增 1
    # )

    # 5. 处理登录结果
    if login_status == "failed":
        raise HTTPException(status_code=400, detail="用户名或密码错误")
    
    # 6. 签发 Token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user_dict["username"]}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

# ------------------------------------------
# 新增模块：获取个人登录历史
# ------------------------------------------
@v1_router.get("/user/login_history", tags=["V1 用户端"])
async def get_login_history(current_user: dict = Depends(get_current_user)):
    """获取当前登录用户的最近 10 次登录日志"""
    username = current_user.get("username")
    
    # 从 MongoDB 查询该用户的日志，按时间倒序，限制 10 条
    cursor = login_log_collection.find({"username": username}).sort("timestamp", -1).limit(10)
    
    history = []
    async for log in cursor:
        history.append({
            "ip_address": log.get("ip_address"),
            "location": log.get("location"),
            "user_agent": log.get("user_agent"),
            "status": log.get("status"),
            "timestamp": log.get("timestamp")
        })
        
    return {"code": 200, "message": "获取成功", "data": history}

# ------------------------------------------
# 模块 2：C端 用户接口 (User)
# ------------------------------------------
@v1_router.get("/user/me", tags=["V1 用户端"])
async def read_users_me(current_user: dict = Depends(get_current_user)):
    """【受保护接口】获取当前登录用户信息"""
    return {"user_info": current_user, "message": "身份验证成功，这是您的专属数据。"}

@v1_router.post("/user/record", response_model=ResponseModel,tags=["V1 用户端"])
async def add_carbon_record(
    record: CarbonRecordSchema = Body(...),
    current_user: dict = Depends(get_current_user)
):
    """【受保护接口】用户提交绿色出行记录，系统计算碳积分并异步入库"""
    if record.activity_type not in CARBON_RULES:
        raise HTTPException(status_code=400, detail="不支持的环保活动类型")
    
    # 1. 业务逻辑： 计算积分
    carbon_points = record.value * CARBON_RULES[record.activity_type]

    # 2. 构造入库数据
    record_dict = {
        "user_id": current_user.get("username"),
        "activity_type": record.activity_type,
        "value": record.value,
        "carbon_saved": carbon_points,
        "timestamp": datetime.now(timezone.utc) 
    }

    # 3. 异步写入数据库（MongoDB)
    new_record = await record_collection.insert_one(record_dict)

    return ResponseModel(
        code = 200,
        message="记录成功，积分已发放",
        data={"record_id": str(new_record.inserted_id), "points_earned": carbon_points}
    )

# ------------------------------------------
# 模块 3：B端 管理端与大数据接口 (Admin & Data)
# ------------------------------------------
@v1_router.get("/admin/predict_trend", response_model=ResponseModel, tags=["V1 管理端"])
async def get_carbon_trend_prediction(current_user: dict = Depends(get_current_user)):
    """
    【受保护接口】管理端大屏：获取全平台减碳量的大数据分析与趋势预测
    (注：完整项目中可在此处进一步校验 current_user['role'] == 'admin')
    """
    # 1. 从 MongoDB 异步提取数据
    records = []
    async for db_record in record_collection.find():
        records.append(record_helper(db_record))
        
    # 2. 传入 Pandas/NumPy 引擎进行分析
    analysis_result = analyze_and_predict_trend(records)
    
    return ResponseModel(
        code=200,
        message="大数据预测分析完成",
        data=analysis_result
    )

@v1_router.post("/admin/trigger_spider", tags=["V1 管理端"])
async def trigger_spider(current_user: dict = Depends(get_current_user)):
    """【受保护接口】手动触发爬虫获取公共交通最新数据"""
    return {"message": f"管理员 {current_user.get('username')}，爬虫任务已在后台启动..."}

# ==========================================
# 注册路由并启动服务
# ==========================================
app.include_router(v1_router)

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
