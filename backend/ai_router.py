
import os
import httpx
import json
import re
import numpy as np
from datetime import datetime
from typing import List, Dict, Any, Optional
from mcp_tools import MCPToolHub
from sentence_transformers import SentenceTransformer

class AIRouter:
    def __init__(self):
        self.local_url = os.getenv("OLLAMA_URL", "http://host.docker.internal:11434")
        self.default_model = os.getenv("LOCAL_MODEL", "YemenJPT")
        self.mcp = MCPToolHub()
        
        # Sovereign RAG Initialization
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
            matches = [f"{i['title']}: {i['content']}" for i in self.kb_data if any(w.lower() in i['content'].lower() for w in query.split())]
            return "\n\n".join(matches[:top_k])
        
        query_embedding = self.embedder.encode([query], convert_to_tensor=False)[0]
        
        similarities = np.dot(self.kb_embeddings, query_embedding) / (
            np.linalg.norm(self.kb_embeddings, axis=1) * np.linalg.norm(query_embedding) + 1e-9
        )
        
        top_indices = np.argsort(similarities)[-top_k:][::-1]
        
        context_chunks = []
        for i in top_indices:
            if similarities[i] > 0.25: # Context relevance threshold
                item = self.kb_data[i]
                context_chunks.append(f"[{item.get('title')}]\n{item.get('content')}")
        
        return "\n\n".join(context_chunks)

    # --- SAFETY MIDDLEWARE (The Guardrails) ---
    
    def check_safety(self, prompt: str, response: str = "") -> Dict[str, Any]:
        """
        Guardrails Router:
        Enforces Ethical Constitution (Anti-GBV, Election Integrity, etc.)
        """
        prompt_lower = prompt.lower()
        response_lower = response.lower()
        
        # 1. Block Toxic Content / Deepfakes / GBV
        prohibited_patterns = [
            r"deepfake", r"fake video", r"voice clone", r"تزييف", r"فبركة",
            r"kill", r"murder", r"hate speech", r"تحريض", r"عنف",
            r"hack", r"bypass", r"exploit",
            r"violence against women", r"gender bias", r"عنف ضد المرأة"
        ]
        
        for pattern in prohibited_patterns:
            if re.search(pattern, prompt_lower):
                return {
                    "allowed": False,
                    "reason": "POLICY_VIOLATION",
                    "category": "Toxic/Deepfake/GBV",
                    "message": f"🚫 Policy Violation: Request blocked due to detection of restricted content ({pattern})."
                }

        # 2. Output Audit (If response is provided)
        if response:
            bias_markers = ["men are superior", "women cannot", "weak gender"]
            if any(m in response_lower for m in bias_markers):
                return {
                    "allowed": False,
                    "reason": "OUTPUT_BIAS",
                    "category": "Gender Bias",
                    "message": "[REDACTED] Output withheld due to potential Gender Bias violation (UNESCO GBV Protocol)."
                }

        # 3. Detect Sensitive Topics (Elections, Politics)
        sensitive_topics = [
            "election", "vote", "ballot", "انتخابات", "تصويت",
            "politician", "minister", "government", "حكومة", "وزير",
            "scandal", "corruption", "فساد"
        ]
        
        is_sensitive = any(topic in prompt_lower for topic in sensitive_topics)
        
        return {
            "allowed": True,
            "is_sensitive": is_sensitive,
            "mode": "STRICT_FACT_CHECK" if is_sensitive else "STANDARD"
        }

    async def generate(self, prompt: str, model: str = None, history: list = None):
        # 1. Pre-Generation Safety Check
        safety_check = self.check_safety(prompt)
        
        if not safety_check["allowed"]:
             # Log violation (Mock logging)
             print(f"[AUDIT LOG] BLOCKED: {prompt} | Reason: {safety_check['reason']}")
             return {
                 "source": "Guardrails",
                 "content": safety_check["message"],
                 "model": "Constitutional-Guardrail",
                 "status": "BLOCKED",
                 "safety_flag": True
             }

        target_model = model or self.default_model
        
        # 2. RAG Context Retrieval
        context = self._retrieve_context(prompt)
        
        # 3. Construct System Prompt based on Mode
        system_instruction = ""
        if safety_check.get("mode") == "STRICT_FACT_CHECK":
            system_instruction = (
                "⚠️ STRICT FACT-CHECKING MODE ACTIVE ⚠️\n"
                "You are analyzing a Political/Sensitive topic. \n"
                "1. Answer ONLY based on the provided context below.\n"
                "2. If the answer is not in the context, state: 'Information not available in Sovereign Archives'.\n"
                "3. Do not hallucinate or use outside knowledge.\n"
                f"CONTEXT:\n{context}\n"
            )
        else:
            system_instruction = (
                "Use the following context to inform your answer. Explain your reasoning. \n"
                f"CONTEXT:\n{context}\n"
            )

        # 4. Tool Routing (Weather, etc.)
        tool_call = None
        if "weather" in prompt.lower() or "طقس" in prompt:
            tool_call = {"name": "verify_weather_history", "args": {"location": "Sana'a", "date": datetime.now().strftime('%Y-%m-%d')}}

        tool_used_name = None
        final_prompt = f"{system_instruction}\nUSER QUESTION: {prompt}"
        
        if tool_call:
            tool_result = await self.mcp.execute_tool(tool_call["name"], tool_call["args"])
            tool_used_name = tool_call["name"]
            final_prompt += f"\nTOOL RESULT: {json.dumps(tool_result, ensure_ascii=False)}"

        # 5. Generate
        result = await self._call_local(final_prompt, target_model, tool_used=tool_used_name)
        
        # 6. Post-Generation Audit
        post_safety = self.check_safety(prompt, response=result.get("content", ""))
        if not post_safety["allowed"]:
            return {
                 "source": "Guardrails",
                 "content": post_safety["message"],
                 "model": "Constitutional-Guardrail",
                 "status": "BLOCKED",
                 "safety_flag": True
             }
            
        # Add metadata for frontend transparency
        result["safety_mode"] = safety_check.get("mode")
        result["citations"] = [item['title'] for item in self.kb_data if item['content'] in context] if context else []
        result["confidence_score"] = "High" if context else "Medium" # Simple heuristic

        return result

    async def _call_local(self, prompt, model, tool_used=None):
        try:
            async with httpx.AsyncClient() as client:
                res = await client.post(
                    f"{self.local_url}/api/generate",
                    json={"model": model, "prompt": prompt, "stream": False},
                    timeout=120.0
                )
                if res.status_code != 200:
                    return {"content": "Error: Local AI Core unreachable.", "source": "error"}
                
                return {
                    "source": "sovereign_local",
                    "content": res.json().get("response", ""),
                    "model": model,
                    "tool_used": tool_used
                }
        except Exception as e:
            return {"content": f"Connection Failure: {str(e)}", "source": "error"}
