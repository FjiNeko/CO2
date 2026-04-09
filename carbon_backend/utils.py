import httpx
import json
import os

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

import json
import os
import httpx

# ... 你之前的 get_ip_location 函数保留在这里 ...

def get_scraper_headers(file_path: str = "config/headers.json") -> dict:
    """从外部 JSON 文件加载爬虫请求头配置"""
    try:
        # 获取当前 utils.py 所在的绝对目录 (即 carbon_backend 根目录)
        base_dir = os.path.dirname(os.path.abspath(__file__))
        # 拼接出配置文件的完整绝对路径
        full_path = os.path.join(base_dir, file_path)
        
        with open(full_path, 'r', encoding='utf-8') as f:
            headers = json.load(f)
            return headers
    except FileNotFoundError:
        print(f"⚠️ 未找到配置文件 {full_path}，将使用默认基础请求头。")
        return {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
    except Exception as e:
        print(f"⚠️ 读取请求头配置失败: {e}")
        return {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}

