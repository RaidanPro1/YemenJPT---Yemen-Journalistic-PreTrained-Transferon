from fastapi import FastAPI
from pydantic import BaseModel
from transformers import pipeline
import os

app = FastAPI()
# Assuming MARBERT is used for sentiment
analyzer = pipeline("sentiment-analysis", model="UBC-NLP/MARBERT")

class SentimentRequest(BaseModel):
    text: str

YEMENI_KEYWORDS = ["جُباة", "حَنق", "مشقاص", "خبير", "صاحبي"]

@app.post("/analyze-news")
async def analyze(request: SentimentRequest):
    result = analyzer(request.text)[0]
    sentiment = result['label']
    score = result['score']
    
    detected_keywords = [k for k in YEMENI_KEYWORDS if k in request.text]
    alert = "High Alert" if sentiment == "NEGATIVE" and len(detected_keywords) > 0 else "Normal"
    
    return {
        "sentiment": sentiment,
        "confidence": f"{score:.2f}",
        "yemeni_keywords_found": detected_keywords,
        "alert_status": alert
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
