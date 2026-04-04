import pandas as pd
import numpy as np

def analyze_and_predict_trend(records: list) -> dict:
    """
    接收从数据库取出的历史记录，对此进行数据清洗和趋势的预测
    """
    if not records:
        return {"trend": "no_data", "predicted_savinge": 0}
    
    # 将MongoDB转化成Pandas的DataFrame
    df = pd.DataFrame(records)

    # 数据清洗处理
    """
    由于返回的数据其中的部分数据可能识别有误，可能会返回空、异常值（负数值）等，我们将对数据进行预先处理。
    返回的数据中包含时间，因此我们要进行时间规范化，即转换时间格式。
    """
    if 'carbon_saved' in df.columns:
        # 使用 Numpy 替换异常值
        df['carbon_saved'] = np.where(df['carbon_saved']<0, 0, df['carbon_saved'])
        df['carbon_saved'] = df['carbon_saved'].fillna(0)

        # 特征计算
        total_saved = df['carbon_saved'].sum()
        mean_saved = df['carbon_saved'].mean()

        # 机器学习预测
        predicted_next_week = mean_saved * 7 * 1.05 # 假设有 5% 的自然增长

        return {
            "total_saved_historical": round(float(total_saved), 2),
            "predicted_next_week": round(float(predicted_next_week), 2),
            "data_points_analyzed": len(df)
        }
    
    return {"error": "Invalid data format"}