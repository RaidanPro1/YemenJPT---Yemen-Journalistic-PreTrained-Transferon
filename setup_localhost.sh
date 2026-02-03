
#!/bin/bash
# RaidanPro / YemenJPT Localhost Setup for Ubuntu 24.04 LTS
# Full Stack Installation: FastAPI + React + Ollama + RAG Dependencies

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}--- YEMENJPT SOVEREIGN NODE SETUP v8.0 ---${NC}"

echo -e "${BLUE}[1/6] Installing System Core...${NC}"
sudo apt update && sudo apt install -y curl git jq docker.io docker-compose-v2 python3-pip python3-venv build-essential ffmpeg libmagic1

echo -e "${BLUE}[2/6] Setting up Python Virtual Environment...${NC}"
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r backend/requirements.txt

echo -e "${BLUE}[3/6] Configuring Sovereign AI (Ollama)...${NC}"
if ! command -v ollama &> /dev/null; then
    curl -fsSL https://ollama.com/install.sh | sh
fi

# Ensure Ollama is running
if ! pgrep -x "ollama" > /dev/null; then
    ollama serve > /dev/null 2>&1 &
    echo "Waiting for Ollama to warm up..."
    sleep 10
fi

echo -e "${BLUE}[4/6] Pulling Language Models...${NC}"
ollama pull allam:latest
ollama pull qwen2.5:7b

echo -e "${BLUE}[5/6] Initializing Knowledge Base (RAG)...${NC}"
# Pre-creating data directories
mkdir -p backend/data backend/uploads shared-uploads
# The AI Router will auto-build embeddings on first boot

echo -e "${BLUE}[6/6] Launching Docker Infrastructure...${NC}"
docker compose -f docker-compose.stack.yml up -d

echo -e "${GREEN}✅ YemenJPT Sovereign Node is fully deployed!${NC}"
echo -e "--------------------------------------------------"
echo -e "🔗 Main Dashboard: http://localhost:80"
echo -e "🧠 AI Engine: http://localhost:11434"
echo -e "🛠️ API Gateway: http://localhost:8000"
echo -e "📓 Jupyter Lab: http://localhost:8888"
echo -e "--------------------------------------------------"
echo -e "Default Master Key: Samah@2052024X"
