import pandas as pd
import numpy as np
from datetime import datetime, timedelta, timezone
from motor.motor_asyncio import AsyncIOMotorClient
from sklearn.linear_model import LinearRegression
from database import _MONGO_DATABASE  # 确保能连接到你的 MongoDB

class CarbonAnalyticsEngine:
    def __init__(self):
        self.activities_col = _MONGO_DATABASE["user_activities"]

    async def _get_dataframe(self):
        """内部方法：从 MongoDB 抓取数据并转换为 Pandas DataFrame"""
        cursor = self.activities_col.find({})
        data = await cursor.to_list(length=100000)
        if not data:
            return None
        
        df = pd.DataFrame(data)
        # 确保时间列是 datetime 类型
        df['created_at'] = pd.to_datetime(df['created_at'])
        return df

    async def generate_dashboard_metrics(self):
        """为 B 端大屏生成实时统计指标 (NumPy + Pandas)"""
        df = await self._get_dataframe()
        if df is None or df.empty:
            return {"status": "empty_data"}

        # 1. 基础 KPI 计算 (使用 NumPy 聚合)
        kpi = {
            "total_users": int(df['user_id'].nunique()),
            "total_activities": int(len(df)),
            "total_carbon_points": float(df['carbon_points'].sum()),
            "total_distance_km": float(df['distance'].sum())
        }

        # 2. 出行方式分布 (用于饼图)
        dist = df.groupby('activity_type')['carbon_points'].sum().reset_index()
        distribution = [{"name": row['activity_type'], "value": float(row['carbon_points'])} 
                        for _, row in dist.iterrows()]

        # 3. 近30天趋势 (用于折线图)
        trend_df = df.set_index('created_at').resample('D')['carbon_points'].sum().tail(30).reset_index()
        trend = {
            "dates": trend_df['created_at'].dt.strftime('%m-%d').tolist(),
            "points": trend_df['carbon_points'].tolist()
        }

        # 4. 高阶统计 (NumPy 输出)
        advanced = {
            "avg_points_per_trip": float(np.mean(df['carbon_points'])),
            "avg_distance_per_trip": float(np.mean(df['distance'])),
            "std_dev_points": float(np.std(df['carbon_points']))
        }

        return {
            "kpi": kpi,
            "distribution": distribution,
            "trend": trend,
            "advanced_stats": advanced
        }

    async def get_future_prediction(self):
        """机器学习核心：预测未来 7 天的减碳趋势"""
        df = await self._get_dataframe()
        if df is None or len(df) < 10:
            return {"message": "数据量不足，无法训练模型"}

        # --- 特征工程 ---
        # 按天聚合历史数据
        daily_df = df.set_index('created_at').resample('D')['carbon_points'].sum().reset_index()
        
        # 将日期转换为序号（作为特征 X）
        daily_df['day_index'] = np.arange(len(daily_df))
        X = daily_df[['day_index']]
        y = daily_df['carbon_points']

        # --- 模型训练 (Linear Regression) ---
        model = LinearRegression()
        # 【修复点】：给 X 加上 .values，抹去 Pandas 的列名，变成纯 NumPy 数组
        model.fit(X.values, y)

        # --- 生成未来 7 天预测 ---
        last_index = daily_df['day_index'].max()
        future_indices = np.array([[i] for i in range(last_index + 1, last_index + 8)])
        # 此时 future_indices 也是纯 NumPy 数组，预测时就不会再报 Warning 了
        future_preds = model.predict(future_indices)
        
        # 确保预测值不为负数
        future_preds = np.maximum(future_preds, 0)

        # 构造日期轴
        last_date = daily_df['created_at'].max()
        future_dates = [(last_date + timedelta(days=i)).strftime('%m-%d') for i in range(1, 8)]

        return {
            "future_dates": future_dates,
            "future_points": [round(float(p), 2) for p in future_preds],
            "model_info": "Simple Linear Regression",
            "growth_trend": "Increasing" if model.coef_[0] > 0 else "Decreasing"
        }

# 实例化引擎
analytics_engine = CarbonAnalyticsEngine()