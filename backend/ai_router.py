
import os
import httpx
import json
import re
import numpy as np
from datetime import datetime
from typing import List, Dict, Any
from mcp_tools import MCPToolHub
from sentence_transformers import SentenceTransformer

class AIRouter:
    def __init__(self):
        self.local_url = os.getenv("OLLAMA_URL", "http://host.docker.internal:11434")
        self.default_model = os.getenv("LOCAL_MODEL", "allam:latest")
        self.mcp = MCPToolHub()
        
        # Sovereign RAG Initialization
        # We use 'all-MiniLM-L6-v2' for fast, local-only vector search
        try:
            self.embedder = SentenceTransformer('all-MiniLM-L6-v2')
        except:
            print("Warning: Embedding model not found, falling back to keyword search.")
            self.embedder = None
            
        self.knowledge_base_path = "backend/data/knowledge_base.json"
        
        # Ensure data directory exists
        os.makedirs("backend/data", exist_ok=True)
        
        self.kb_data = self._load_knowledge_base()
        self.kb_embeddings = self._build_kb_embeddings()

    def _load_knowledge_base(self) -> List[Dict[str, Any]]:
        if os.path.exists(self.knowledge_base_path):
            try:
                with open(self.knowledge_base_path, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except Exception as e:
                print(f"Error loading KB: {e}")
        return []

    def _build_kb_embeddings(self):
        if not self.kb_data or not self.embedder:
            return None
        texts = [f"{item.get('title', '')}: {item.get('content', '')}" for item in self.kb_data]
        return self.embedder.encode(texts, convert_to_tensor=False)

    def _retrieve_context(self, query: str, top_k: int = 3) -> str:
        if self.kb_embeddings is None or not self.kb_data or not self.embedder:
            # Fallback to simple keyword matching if vector search fails
            matches = [f"{i['title']}: {i['content']}" for i in self.kb_data if any(w.lower() in i['content'].lower() for w in query.split())]
            return "\n\n".join(matches[:top_k])
        
        query_embedding = self.embedder.encode([query], convert_to_tensor=False)[0]
        
        # Simple Cosine Similarity
        similarities = np.dot(self.kb_embeddings, query_embedding) / (
            np.linalg.norm(self.kb_embeddings, axis=1) * np.linalg.norm(query_embedding) + 1e-9
        )
        
        top_indices = np.argsort(similarities)[-top_k:][::-1]
        
        context_chunks = []
        for i in top_indices:
            if similarities[i] > 0.2: # Broad threshold for investigative relevance
                item = self.kb_data[i]
                context_chunks.append(f"[{item.get('title')}]\n{item.get('content')}")
        
        return "\n\n".join(context_chunks)

    async def generate(self, prompt: str, model: str = None, history: list = None):
        target_model = model or self.default_model
        prompt_low = prompt.lower()
        
        # 1. RAG Augmentation
        context = self._retrieve_context(prompt)
        system_instruction = (
            "أنت YemenJPT، مساعد ذكاء اصطناعي سيادي متخصص في الصحافة الاستقصائية والتحقق الجنائي في اليمن.\n"
            "تلتزم ببروتوكولات الأمان السيادي وحماية المصادر.\n"
            "استخدم المعلومات التالية من قاعدة المعرفة لدعم إجابتك:\n\n"
            f"{context}\n\n"
            "إذا طلب المستخدم تحليل صورة أو فيديو، اذكر أدوات MKLab و ELA/CFA المتاحة في لوحة التحكم.\n"
        )

        # 2. Tool Routing
        tool_call = None
        if any(x in prompt_low for x in ["الطقس", "weather"]):
            tool_call = {"name": "verify_weather_history", "args": {"location": "Sana'a", "date": datetime.now().strftime('%Y-%m-%d')}}
        elif any(x in prompt_low for x in ["فيديو", "video"]):
            tool_call = {"name": "extract_video_metadata", "args": {"url": "pending_extraction"}}

        # 3. Execution & Synthesis
        tool_used_name = None
        if tool_call:
            tool_result = await self.mcp.execute_tool(tool_call["name"], tool_call["args"])
            tool_used_name = tool_call["name"]
            final_prompt = f"{system_instruction}\nسؤال المستخدم: {prompt}\nنتيجة الأداة المساعدة: {json.dumps(tool_result, ensure_ascii=False)}"
        else:
            final_prompt = f"{system_instruction}\nسؤال المستخدم: {prompt}"

        return await self._call_local(final_prompt, target_model, tool_used=tool_used_name)

    async def _call_local(self, prompt, model, tool_used=None):
        try:
            async with httpx.AsyncClient() as client:
                res = await client.post(
                    f"{self.local_url}/api/generate",
                    json={"model": model, "prompt": prompt, "stream": False},
                    timeout=120.0
                )
                if res.status_code != 200:
                    return {"content": "عذراً، محرك الذكاء الاصطناعي المحلي مشغول حالياً.", "source": "error"}
                
                return {
                    "source": "sovereign_local",
                    "content": res.json().get("response", ""),
                    "model": model,
                    "tool_used": tool_used
                }
        except Exception as e:
            return {"content": f"فشل الاتصال بالنواة المحلية: {str(e)}", "source": "error"}
