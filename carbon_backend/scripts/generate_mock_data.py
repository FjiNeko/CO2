import asyncio
import random
from datetime import datetime, timedelta, timezone
import os
import sys

# 确保能导入根目录的模块
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database import _MONGO_DATABASE, rule_collection
from utils import logger

async def generate_mock_data(num_records=50000):
    logger.info(f"START Generating {num_records} mock records for Big Data testing")
    
    # 1. 获取最新的动态排放规则（从我们刚刚爬取的库里拿）
    rules_cursor = rule_collection.find({})
    rules = await rules_cursor.to_list(length=None)
    
    if not rules:
        logger.error("ERROR No emission rules found. Please run advanced_scraper.py first.")
        return

    # 将规则转为字典方便查询，例如: {"bus": 3.48, "subway": 6.26, "bicycle": 8.73}
    rule_map = {r["activity_type"]: r["factor"] for r in rules}
    activity_types = list(rule_map.keys())
    
    # 2. 准备模拟用户 ID 池 (模拟 1000 个活跃用户)
    user_ids = [f"user_mock_{i:04d}" for i in range(1, 1001)]
    
    # 3. 生成数据
    records = []
    now = datetime.now(timezone.utc)
    
    for i in range(num_records):
        # 随机生成过去 30 天内的某个时间点
        days_ago = random.uniform(0, 30)
        record_time = now - timedelta(days=days_ago)
        
        # 随机分配出行方式和距离
        act_type = random.choice(activity_types)
        
        # 不同交通工具的典型距离 (公里)
        if act_type == "bicycle":
            distance = round(random.uniform(1.0, 5.0), 2)
        elif act_type == "bus":
            distance = round(random.uniform(2.0, 15.0), 2)
        else: # subway
            distance = round(random.uniform(5.0, 30.0), 2)
            
        # 根据动态规则计算产生的碳积分
        factor = rule_map.get(act_type, 0)
        carbon_points = round(distance * factor, 2)
        
        records.append({
            "user_id": random.choice(user_ids),
            "activity_type": act_type,
            "distance": distance,
            "carbon_points": carbon_points,
            "created_at": record_time,
            "status": "verified"
        })
        
        if len(records) % 10000 == 0:
            logger.info(f"PROGRESS Generated {len(records)} records...")

    # 4. 批量写入 MongoDB (清空旧测试数据)
    collection = _MONGO_DATABASE["user_activities"]
    logger.info("START Dropping old mock data...")
    await collection.delete_many({"user_id": {"$regex": "^user_mock_"}})
    
    logger.info("START Bulk inserting new records...")
    await collection.insert_many(records)
    
    logger.info(f"SUCCESS Successfully injected {len(records)} records into MongoDB.")

if __name__ == "__main__":
    if os.name == 'nt':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(generate_mock_data(50000))