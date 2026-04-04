from datetime import datetime, timedelta, timezone
from typing import Optional
import jwt
import bcrypt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

# ==========================================
# 核心配置
# ==========================================
SECRET_KEY = "your_super_secret_key_for_graduation_project"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 # Token 有效期设为1天

# OAuth2规范:
# FastAPI Token 从登录接口获取
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

# ==========================================
# 核心配置
# ==========================================
def verify_password(plain_password: str, hashed_password: str) -> bool:
    """校验密码"""
    # bcrypt 要求必须是 bytes 类型
    password_bytes = plain_password.encode('utf-8')
    hashed_bytes = hashed_password.encode('utf-8')
    return bcrypt.checkpw(password_bytes, hashed_bytes)

def get_password_hash(password: str) -> str:
    """生成密码哈希"""
    password_bytes = password.encode('utf-8')
    # 生成随机盐值并进行哈希
    hashed_bytes = bcrypt.hashpw(password_bytes, bcrypt.gensalt())
    # 存入数据库时通常转为字符串
    return hashed_bytes.decode('utf-8')

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """生成JWT Token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# ==========================================
# 依赖注入：获取当前登录用户
# ==========================================
async def get_current_user(token: str = Depends(oauth2_scheme)):
    """
    这是一个依赖项。
    任何需要登录才能访问的接口，只需加上 Depends(get_current_user) 即可。
    它会自动解析 Header 中的 Bearer Token 并校验。
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="无效的凭证或 Token 已过期",
        headers = {"WWW-Authenticate": "Bearer"}
    )
    try:
        # 解码 Token
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except jwt.PyJWTError:
        raise credentials_exception
    
    user = {
        "username": username,
        "role": "user"
    }
    return user
