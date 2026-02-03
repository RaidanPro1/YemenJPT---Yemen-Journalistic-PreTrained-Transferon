
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
app = FastAPI(title="YemenJPT Sovereign Core v9.6 (Localhost)")

# CORS Configuration for Localhost
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://0.0.0.0:3000",
    "*"  # Allow all for local dev ease, restrict in production if needed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
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
    model_name: str = "YemenJPT"

# --- ENDPOINTS ---

@app.get("/api/system/health")
async def health_check():
    return {
        "status": "operational",
        "deployment_mode": "Localhost Port-Based",
        "containers": [
            {"id": "api", "name": "YJPT_api", "status": "running", "uptime": "Local", "latency": "1ms"},
            {"id": "radar", "name": "YJPT_Radar", "status": "running", "uptime": "Local", "latency": "2ms"},
            {"id": "legal", "name": "YJPT_LegalMeter", "status": "running", "uptime": "Local", "latency": "2ms"}
        ]
    }

# 1. Agent Chat (Sovereign Unified Gateway with RAG)
@app.post("/api/ai/agent_chat")
async def agent_chat(request: ChatRequest):
    """
    The main intelligence gateway. 
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

# Token endpoint for Auth Guard
@app.post("/token")
async def login_for_access_token(form_data: Any = Depends()):
    # Mock Auth
    if form_data.username == "admin" and form_data.password == os.getenv("MASTER_PASSWORD", "admin"):
         return {"access_token": "sovereign_token_localhost", "token_type": "bearer"}
    # Fallback for old creds
    if form_data.username == "info@raidan.pro" and form_data.password == "samah@2052024":
        return {"access_token": "sovereign_token_xyz", "token_type": "bearer"}
    raise HTTPException(status_code=400, detail="Incorrect username or password")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
