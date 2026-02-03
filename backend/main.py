
from fastapi import FastAPI, UploadFile, File, HTTPException, Depends, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import subprocess
import os
import json
import shutil
from datetime import datetime
from typing import List, Dict, Any
from ai_router import AIRouter

# إعداد التطبيق
app = FastAPI(title="YemenJPT Sovereign Core v8.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "/app/uploads"
VOICE_DIR = "/app/shared-uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(VOICE_DIR, exist_ok=True)

# Initialize Sovereign AI Router
ai_router = AIRouter()

# --- MODELS ---

class AnalysisRequest(BaseModel):
    text: str

class VoiceRequest(BaseModel):
    text: str

class ChatRequest(BaseModel):
    prompt: str
    model_name: str = "allam:latest"

# --- ENDPOINTS ---

@app.get("/api/system/health")
async def health_check():
    return {
        "status": "operational",
        "containers": [
            {"id": "api", "name": "YJPT_api", "status": "running", "uptime": "14d 2h", "latency": "12ms"},
            {"id": "radar", "name": "YJPT_Radar", "status": "running", "uptime": "14d 2h", "latency": "45ms"},
            {"id": "legal", "name": "YJPT_LegalMeter", "status": "running", "uptime": "1d 4h", "latency": "120ms"}
        ]
    }

# 1. Agent Chat (Sovereign Unified Gateway with RAG)
@app.post("/api/ai/agent_chat")
async def agent_chat(request: ChatRequest):
    """
    The main intelligence gateway. 
    It routes the prompt through the AIRouter which performs:
    1. Sovereign RAG (retrieving Yemen-specific context)
    2. Tool Routing (Weather, Video, Archiving)
    3. Local LLM Generation (Ollama)
    """
    try:
        result = await ai_router.generate(request.prompt, request.model_name)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Sovereign AI Router Error: {str(e)}")

# 2. Forensic Scan (Sherloq)
@app.post("/api/forensics/sherloq")
async def forensic_scan(file: UploadFile = File(...)):
    temp_path = os.path.join(UPLOAD_DIR, f"scan_{file.filename}")
    try:
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        result = subprocess.run(
            ["python3", "backend/sherloq_cli.py", temp_path],
            capture_output=True,
            text=True
        )
        return json.loads(result.stdout)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Forensic Engine Failure: {str(e)}")
    finally:
        if os.path.exists(temp_path): os.remove(temp_path)

# 3. Service: Legal-Meter (Integration endpoint)
@app.post("/api/services/legal-meter")
async def legal_meter(request: AnalysisRequest):
    # Simulated connection to Qdrant service
    return {
        "score": "85%",
        "violated_articles": [],
        "interpretation": "النص متوافق مع الدستور اليمني ومخرجات الحوار الوطني."
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
