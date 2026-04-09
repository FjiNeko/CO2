import json
import os
import logging
from logging.handlers import RotatingFileHandler
from datetime import datetime

# --- 1. 路径与目录管理 ---
# 获取 carbon_backend 文件夹的绝对路径
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CONFIG_DIR = os.path.join(BASE_DIR, "config")
LOG_DIR = os.path.join(BASE_DIR, "logs")
TMP_DIR = os.path.join(BASE_DIR, "tmp")
DEBUG_DIR = os.path.join(BASE_DIR, "debugs")

# 确保所有必要目录存在
for folder in [LOG_DIR, TMP_DIR, DEBUG_DIR]:
    os.makedirs(folder, exist_ok=True)

# --- 2. 生产级日志系统 (模拟 Log4j 风格) ---
def setup_logger():
    log_file = os.path.join(LOG_DIR, "carbon_system.log")
    
    # 定义标准 Java/Hadoop 风格日志格式
    log_format = logging.Formatter(
        '%(asctime)s %(levelname)-5s [%(filename)s:%(lineno)d] - %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )

    # 使用自动滚动的文件处理器 (按大小切分，模拟归档)
    # maxBytes=1MB, backupCount=10 (保留10个历史归档)
    file_handler = RotatingFileHandler(
        log_file, 
        maxBytes=1*1024*1024, 
        backupCount=10, 
        encoding='utf-8'
    )
    file_handler.setFormatter(log_format)

    # 控制台实时输出
    console_handler = logging.StreamHandler()
    console_handler.setFormatter(log_format)

    logger = logging.getLogger("CarbonApp")
    logger.setLevel(logging.INFO)
    
    if not logger.handlers:
        logger.addHandler(file_handler)
        logger.addHandler(console_handler)
    
    return logger

# 初始化全局组件
logger = setup_logger()

# --- 3. 统一配置加载引擎 ---
def load_json_config(filename):
    """通用的 JSON 配置文件读取器"""
    full_path = os.path.join(CONFIG_DIR, filename)
    try:
        if not os.path.exists(full_path):
            logger.warning(f"⚠️ 配置文件缺失: {filename}")
            return {}
        with open(full_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        logger.error(f"❌ 配置文件 {filename} 读取失败: {e}")
        return {}

# 导出全局单例配置，供其他脚本 import
HEADERS = load_json_config("headers.json")
URLS = load_json_config("urls.json")