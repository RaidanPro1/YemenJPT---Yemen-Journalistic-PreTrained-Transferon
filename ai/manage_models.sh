#!/bin/bash

# YemenJPT Model Ops Manager
ENV_FILE="../.env"
THRESHOLD=90

monitor() {
    CPU=$(top -bn1 | grep "Cpu(s)" | awk '{print $2 + $4}')
    GPU=$(nvidia-smi --query-gpu=utilization.gpu --format=csv,noheader,nounits 2>/dev/null || echo 0)
    
    echo "[LOG] System Load: CPU $CPU% | GPU $GPU%"
    
    if (( $(echo "$CPU > $THRESHOLD" | bc -l) )); then
        echo "[ALERT] Load high. Switching to Cloud Failover (Gemini API)..."
        switch_to_cloud
    fi
}

switch_to_cloud() {
    # Logic to notify backend to route traffic to Gemini
    # For now, we update a shared flag in .env or Redis
    sed -i 's/LOCAL_MODE=true/LOCAL_MODE=false/' "$ENV_FILE"
    echo "[SUCCESS] Failover complete."
}

update_yemen_context() {
    echo "[SYNC] Pulling latest investigative data..."
    # Logic to fetch from Postgres and update Qdrant
    python3 ../legal-meter/sync_vectors.py
}

case "$1" in
    monitor) monitor ;;
    sync) update_yemen_context ;;
    *) echo "Usage: $0 {monitor|sync}" ;;
esac
