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

def get_scraper_headers(file_path: str = "headers.json") -> dict:
    """从外部 JSON 文件加载爬虫请求头配置"""
    try:
        # 确保路径正确，兼容不同的运行目录
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) 
        # 如果 headers.json 在根目录，可以直接用文件名
        full_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), file_path)
        
        with open(full_path, 'r', encoding='utf-8') as f:
            headers = json.load(f)
            return headers
    except FileNotFoundError:
        print("⚠️ 未找到 headers.json 配置文件，将使用默认基础请求头。")
        return {"User-Agent": "Mozilla/5.0"}
    except Exception as e:
        print(f"⚠️ 读取请求头配置失败: {e}")
        return {"User-Agent": "Mozilla/5.0"}

