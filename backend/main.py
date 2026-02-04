
from fastapi import FastAPI, UploadFile, File, HTTPException, Depends, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import subprocess
import os
import json
import shutil
from datetime import datetime
from typing import List, Dict, Any
from ai_router import AIRouter

# إعداد التطبيق
app = FastAPI(title="YemenJPT Sovereign Core v10.0 (Production Ph-Ye)")

# CORS Configuration for Subdomains
origins = [
    "http://ai.ph-ye.org",
    "https://ai.ph-ye.org",
    "http://files.ph-ye.org",
    "http://control.ph-ye.org",
    "http://13.61.154.217:3000",
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration
UPLOAD_DIR = "/app/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Mount Uploads directory
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# Initialize Sovereign AI Router
ai_router = AIRouter()

# --- MODELS ---
class ChatRequest(BaseModel):
    prompt: str
    model_name: str = "YemenJPT"

# --- ENDPOINTS ---
@app.get("/api/system/health")
async def health_check():
    return {
        "status": "operational",
        "domain": "ph-ye.org",
        "node_ip": "13.61.154.217",
        "storage_hub": "files.ph-ye.org",
        "ai_gateway": "ai.ph-ye.org"
    }

@app.post("/api/ai/agent_chat")
async def agent_chat(request: ChatRequest):
    try:
        result = await ai_router.generate(request.prompt, request.model_name)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Sovereign AI Router Error: {str(e)}")

@app.post("/token")
async def login_for_access_token(form_data: Any = Depends()):
    # Unified Master Password Auth
    if form_data.username == "admin" and form_data.password == os.getenv("MASTER_PASSWORD", "admin"):
         return {"access_token": "sovereign_token_prod_10", "token_type": "bearer"}
    raise HTTPException(status_code=400, detail="Incorrect username or password")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
