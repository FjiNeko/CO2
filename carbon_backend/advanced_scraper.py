import asyncio
import httpx
import re
import tempfile
import os
import json
import pdfplumber
from datetime import datetime, timezone
from database import rule_collection

# ==========================================
# 模块 1：动态加载外部请求头配置
# ==========================================
def load_headers(file_path="headers.json"):
    """从外部 JSON 文件动态读取高级反爬指纹"""
    try:
        # 获取当前脚本所在目录的绝对路径，确保能在任何地方运行
        current_dir = os.path.dirname(os.path.abspath(__file__))
        full_path = os.path.join(current_dir, file_path)
        
        with open(full_path, 'r', encoding='utf-8') as f:
            headers = json.load(f)
            print("✅ 成功加载外部请求头配置 (headers.json)")
            return headers
    except Exception as e:
        print(f"⚠️ 读取配置失败，将使用基础兜底请求头。原因: {e}")
        return {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
    
# 全局请求头变量
HEADERS = load_headers()
print(HEADERS)