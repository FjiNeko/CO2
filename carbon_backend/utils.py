import json
import os
import logging
from logging.handlers import TimedRotatingFileHandler

# --- 路径管理 ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CONFIG_DIR = os.path.join(BASE_DIR, "config")
LOG_DIR = os.path.join(BASE_DIR, "logs")
TMP_DIR = os.path.join(BASE_DIR, "tmp")
DEBUG_DIR = os.path.join(BASE_DIR, "debugs")

for folder in [LOG_DIR, TMP_DIR, DEBUG_DIR]:
    os.makedirs(folder, exist_ok=True)

def setup_logger():
    log_file = os.path.join(LOG_DIR, "carbon_system.log")
    
    log_format = logging.Formatter(
        '%(asctime)s %(levelname)-5s [%(filename)s:%(lineno)d] - %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )
    
    # 核心修复：使用 TimedRotatingFileHandler 进行时间维度归档
    # when="midnight" 表示每天午夜进行一次切割，backupCount=30 表示保留30天的历史记录
    file_handler = TimedRotatingFileHandler(
        log_file, 
        when="midnight", 
        interval=1, 
        backupCount=30, 
        encoding='utf-8'
    )
    
    # 自定义归档文件的后缀，对标 Java 的 log4j.properties 命名习惯
    # 滚动后文件将变为: carbon_system.log.2026-04-08.log
    file_handler.suffix = "%Y-%m-%d.log"
    file_handler.setFormatter(log_format)
    
    console_handler = logging.StreamHandler()
    console_handler.setFormatter(log_format)

    logger = logging.getLogger("CarbonApp")
    logger.setLevel(logging.INFO)
    
    if not logger.handlers:
        logger.addHandler(file_handler)
        logger.addHandler(console_handler)
        
    return logger

logger = setup_logger()

async def get_ip_location(ip: str) -> str:
    """解析 IP 归属地"""
    # 1. 本地环境判断
    if ip in ["127.0.0.1", "::1", "localhost", "0.0.0.0"]:
        return "Localhost (本地环境)"
    
    # 2. 调用API获取真实归属地
    try: 
        async with httpx.AsyncClient() as client:
            response = await client.get(f"http://ip-api.com/json/{ip}?lang=zh-CN", timeout=3.0)
            if response.status_code == 200:
                data = response.json()
                if data.get("status") == "success":
                    # 使用 strip() 去除可能多余的空格
                    return f"{data.get('country', '')} {data.get('regionName', '')} {data.get('city', '')}".strip()
    except Exception as e:
        print(f"获取IP归属地失败： {e}")
    
    return "未知归属地"


def load_json_config(filename):
    full_path = os.path.join(CONFIG_DIR, filename)
    try:
        if not os.path.exists(full_path):
            logger.error(f"ERROR Configuration file missing: {filename}")
            return {}
        with open(full_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        logger.error(f"ERROR Failed to load {filename}: {e}")
        return {}

HEADERS = load_json_config("headers.json")
URLS = load_json_config("urls.json")