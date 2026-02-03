from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
from qdrant_client import QdrantClient
import os

app = FastAPI()
model = SentenceTransformer('all-MiniLM-L6-v2')
qdrant = QdrantClient(host="qdrant", port=6333)

class AnalysisRequest(BaseModel):
    text: str

@app.post("/analyze-compliance")
async def analyze(request: AnalysisRequest):
    try:
        embedding = model.encode(request.text).tolist()
        
        # Search Qdrant for matching articles
        search_result = qdrant.search(
            collection_name="yemen_constitution",
            query_vector=embedding,
            limit=3
        )
        
        violated = [res.payload['article_id'] for res in search_result if res.score > 0.8]
        score = 100 - (len(violated) * 15)
        
        return {
            "score": f"{max(score, 0)}%",
            "violated_articles": violated,
            "status": "Verified" if score > 80 else "Potential Violation"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)
