from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field

# 用户上传绿色消费行为的请求体
class CarbonRecordSchema(BaseModel):
    activity_type: str = Field(..., description="行为类型, 如：地铁、公交、自行车")
    value: float = Field(..., description="活动数值，如：公里数")

# 响应模型
class ResponseModel(BaseModel):
    code: int
    message: str
    data: Optional[dict] = None