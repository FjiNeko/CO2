import httpx

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