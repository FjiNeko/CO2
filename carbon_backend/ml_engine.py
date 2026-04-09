import pandas as pd
import numpy as np
from datetime import datetime, timedelta, timezone
from database import _MONGO_DATABASE
from utils import logger

class CarbonAnalyticsEngine:
    def __init__(self):
        self.collection = _MONGO_DATABASE["user_activities"]

    async def fetch_raw_data(self, days=30):
        """从 MongoDB 抽取近 N 天的海量原始数据"""
        start_date = datetime.now(timezone.utc) - timedelta(days=days)
        cursor = self.collection.find({"created_at": {"$gte": start_date}})
        
        # 将异步游标转为列表
        records = await cursor.to_list(length=None)
        if not records:
            logger.warning("WARNING No data found in database for analytics.")
            return pd.DataFrame()
            
        logger.info(f"SUCCESS Fetched {len(records)} records from MongoDB.")
        return pd.DataFrame(records)

    def clean_and_prepare(self, df: pd.DataFrame) -> pd.DataFrame:
        """数据清洗与特征工程 (Pandas 核心操作)"""
        if df.empty:
            return df
            
        # 丢弃无用列，节省内存
        df = df.drop(columns=['_id'], errors='ignore')
        
        # 确保时间格式正确，并将其设置为 Pandas 的 DatetimeIndex
        df['created_at'] = pd.to_datetime(df['created_at'])
        
        # 提取日维度特征，用于时间序列分析
        df['date'] = df['created_at'].dt.date
        
        # 异常值处理：过滤掉单次积分大于 1000 的离谱数据 (可能是作弊或测试脏数据)
        df = df[df['carbon_points'] < 1000]
        
        return df

    async def generate_dashboard_metrics(self) -> dict:
        """生成供 Vue3/ECharts 直接使用的宏观大屏数据"""
        logger.info("START Generating big data dashboard metrics...")
        
        raw_df = await self.fetch_raw_data(days=30)
        df = self.clean_and_prepare(raw_df)
        
        if df.empty:
            return {"status": "empty_data"}

        metrics = {}

        # ---------------------------------------------------------
        # 1. 核心 KPI (Key Performance Indicators)
        # ---------------------------------------------------------
        metrics["kpi"] = {
            "total_users": int(df['user_id'].nunique()),
            "total_activities": len(df),
            "total_carbon_points": float(df['carbon_points'].sum()),
            "total_distance_km": float(df['distance'].sum())
        }

        # ---------------------------------------------------------
        # 2. 碳减排时间序列趋势 (Time Series Trend - 供折线图使用)
        # ---------------------------------------------------------
        # 使用 groupby 按日期聚合积分总和
        trend_df = df.groupby('date')['carbon_points'].sum().reset_index()
        # 按照日期排序
        trend_df = trend_df.sort_values('date')
        
        metrics["trend"] = {
            # 将日期转为字符串列表 ["2026-03-10", "2026-03-11"...]
            "dates": trend_df['date'].astype(str).tolist(),
            # 将对应的值转为列表 [120.5, 145.2...]
            "points": trend_df['carbon_points'].round(2).tolist()
        }

        # ---------------------------------------------------------
        # 3. 减碳场景分布画像 (Distribution - 供饼图使用)
        # ---------------------------------------------------------
        dist_df = df.groupby('activity_type')['carbon_points'].sum().reset_index()
        
        # 构造 ECharts 饼图所需格式: [{"name": "bus", "value": 1500}, ...]
        pie_data = []
        for _, row in dist_df.iterrows():
            pie_data.append({
                "name": row['activity_type'],
                "value": float(round(row['carbon_points'], 2))
            })
        metrics["distribution"] = pie_data

        # ---------------------------------------------------------
        # 4. 高阶统计：用户行为偏好 (使用 NumPy 算均值和方差)
        # ---------------------------------------------------------
        metrics["advanced_stats"] = {
            "avg_points_per_trip": float(np.mean(df['carbon_points'])),
            "std_dev_points": float(np.std(df['carbon_points'])), # 积分波动标准差
            "avg_distance_per_trip": float(np.mean(df['distance']))
        }

        logger.info("SUCCESS Dashboard metrics generated successfully.")
        return metrics

# 实例化引擎单例供 API 调用
analytics_engine = CarbonAnalyticsEngine()