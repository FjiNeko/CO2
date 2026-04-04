from motor.motor_asyncio import AsyncIOMotorClient

# 定义数据库连接
# MongoDB 连接字符串（本地默认端口）
_MONGO_DETAILS = "mongodb://localhost:27017"
client = AsyncIOMotorClient(_MONGO_DETAILS)

# 创建 / 连接数据库 
_MONGO_DATABASE = client.carbon_db

# 定义主要集合
# 存储用户信息
# 存储记录
user_collection = _MONGO_DATABASE.get_collection("users")
record_collection = _MONGO_DATABASE.get_collection("carbon_records")
login_log_collection = _MONGO_DATABASE.get_collection("login_logs")

# 辅助函数：将 MongoDB 的 _id即ObjectId 转换为字符串
def record_helper(record) -> dict:
    return {
        "id": str(record["_id"]),
        "user_id": record["user_id"],
        "activity_type": record["activity_type"],
        "carboon_saved": record["carboon_saved"],
        "timestamp": record["timestamp"]
    }