import asyncio
import httpx
import re
import os
import subprocess
import pdfplumber
import shutil
from datetime import datetime, timezone

# 注入全局组件
from database import rule_collection
from utils import logger, HEADERS, URLS, BASE_DIR, TMP_DIR, DEBUG_DIR

async def fetch_wuhan_data():
    """解析武汉 JS 动态数据对象"""
    url = URLS.get("wuhan", {}).get("calculator_url")
    if not url: return None
    
    logger.info(f"START [Wuhan] Fetching data from: {url}")
    
    try:
        async with httpx.AsyncClient(verify=False) as client:
            response = await client.get(url, headers=HEADERS, timeout=10.0)
            
            # 提取 JS 对象中的系数
            match = re.search(r'const factors\s*=\s*\{(.*?)\}', response.text, re.DOTALL)
            if match:
                block = match.group(1)
                bus = re.search(r'bus:\s*([0-9.]+)', block)
                subway = re.search(r'subway:\s*([0-9.]+)', block)
                if bus and subway:
                    data = {"bus": float(bus.group(1)), "subway": float(subway.group(1))}
                    logger.info(f"SUCCESS [Wuhan] Extracted data: {data}")
                    return data
        return None
    except Exception as e:
        logger.error(f"ERROR [Wuhan] Task failed: {e}")
        return None

async def fetch_shenzhen_pdf_data():
    """解析深圳官方 PDF (针对 12720026.pdf 混乱结构的专项逻辑)"""
    pdf_url = URLS.get("shenzhen", {}).get("pdf_url")
    if not pdf_url: return None

    # 保持原始文件名
    original_filename = os.path.basename(pdf_url)
    tmp_pdf_path = os.path.join(TMP_DIR, original_filename)
    
    logger.info(f"START [Shenzhen] Downloading original file: {original_filename}")
    
    try:
        # 使用 Curl 穿透 SSL 限制
        ua = HEADERS.get("User-Agent", "Mozilla/5.0")
        logger.info("[Shenzhen] Invoking system curl engine...")
        
        result = subprocess.run([
            "curl", "-k", "-s", "-L", "-A", ua, "-o", tmp_pdf_path, pdf_url
        ], capture_output=True)

        if result.returncode != 0:
            raise Exception(f"Curl error: {result.stderr.decode()}")

        file_size = os.path.getsize(tmp_pdf_path)
        if file_size < 5000:
            logger.error(f"ERROR [Shenzhen] {original_filename} size abnormal ({file_size} bytes). Possible WAF block.")
            return None

        # 针对 12720026.pdf 的混乱文本流进行专项提取
        shenzhen_data = {}
        with pdfplumber.open(tmp_pdf_path) as pdf:
            # 数据通常在第一页
            page = pdf.pages[0]
            tables = page.extract_tables()
            
            for table in tables:
                for row in table:
                    # 定位包含 2026 年份的行
                    if row and "2026" in str(row[0]):
                        logger.info(f"MATCH [Shenzhen] Data row detected, raw content: {row}")
                        
                        # --- 核心修复：处理 row[1] 中的粘连数据 (如 "0.0928 \n 0.0819") ---
                        col_1_data = str(row[1]).split() 
                        
                        try:
                            if len(col_1_data) >= 2:
                                # 成功拆分基准线和公交
                                shenzhen_data["baseline"] = float(col_1_data[0])
                                shenzhen_data["bus"] = float(col_1_data[1])
                            else:
                                # 如果没有粘连，尝试从下一列获取公交
                                shenzhen_data["baseline"] = float(col_1_data[0])
                                if len(row) > 2:
                                    shenzhen_data["bus"] = float(str(row[2]).strip())

                            # 提取地铁：通常在最后一列
                            last_val = str(row[-1]).strip()
                            shenzhen_data["subway"] = float(last_val)
                            
                            logger.info(f"SUCCESS [Shenzhen] Extraction complete: {shenzhen_data}")
                            return shenzhen_data
                        except Exception as parse_err:
                            logger.error(f"PARSE_ERROR [Shenzhen] Failed to parse row data: {parse_err}")
                            continue
                            
        logger.error(f"FAILED [Shenzhen] No valid 2026 data found in {original_filename}")
        return None
    except Exception as e:
        logger.error(f"CRITICAL [Shenzhen] PDF parsing crashed: {e}")
        return None

async def integrate_and_update_db():
    logger.info("-" * 60)
    logger.info("START Data synchronization engine (Strict Mode)")
    
    wuhan, shenzhen = await asyncio.gather(fetch_wuhan_data(), fetch_shenzhen_pdf_data())
    
    # 严格逻辑：双地数据必须真实获取才入库，拒绝默认值
    if wuhan and shenzhen:
        baseline = shenzhen["baseline"]
        avg_bus = (wuhan["bus"] + shenzhen["bus"]) / 2
        avg_subway = (wuhan["subway"] + shenzhen["subway"]) / 2
        
        rules = [
            {"activity_type": "bus", "factor": round((baseline - avg_bus) * 100, 2)},
            {"activity_type": "subway", "factor": round((baseline - avg_subway) * 100, 2)},
            {"activity_type": "bicycle", "factor": round(baseline * 100, 2)}
        ]
        
        for rule in rules:
            rule["update_time"] = datetime.now(timezone.utc)
            rule["source"] = "2026_Official_Data_Dynamic_Sync"
            await rule_collection.update_one(
                {"activity_type": rule["activity_type"]}, 
                {"$set": rule}, 
                upsert=True
            )
            logger.info(f"DB_UPDATE Success for activity_type: {rule['activity_type']} -> {rule['factor']}")
            
        logger.info("FINISH Automated carbon emission factor synchronization completed.")
    else:
        logger.critical("ABORT Data source incomplete (Wuhan or Shenzhen failed). Database update aborted to prevent data corruption.")

if __name__ == "__main__":
    if os.name == 'nt':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(integrate_and_update_db())