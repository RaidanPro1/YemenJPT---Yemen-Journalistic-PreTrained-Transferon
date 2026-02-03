
#!/bin/bash
# YemenJPT Localhost Setup Script v8.1
# Ubuntu 24.04 LTS Compatible

set -e

echo "🔵 --- YemenJPT Sovereign Node Setup ---"

# 1. Install System Dependencies
echo "🔵 [1/5] Installing System Dependencies (Docker, Python, Node.js)..."
sudo apt update
sudo apt install -y curl git jq docker.io docker-compose-v2 python3-pip python3-venv build-essential ffmpeg libmagic1

# Install Node.js (via nvm or direct)
if ! command -v npm &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt install -y nodejs
fi

# 2. Backend Setup
echo "🔵 [2/5] Setting up Python Backend..."
python3 -m venv venv
source venv/bin/activate
pip install -r backend/requirements.txt

# 3. AI Model Setup
echo "🔵 [3/5] Configuring Constitutional AI (Ollama)..."
if ! command -v ollama &> /dev/null; then
    curl -fsSL https://ollama.com/install.sh | sh
fi

# Start Ollama if not running
if ! pgrep -x "ollama" > /dev/null; then
    ollama serve > /dev/null 2>&1 &
    echo "   ...Waiting for Ollama to initialize..."
    sleep 10
fi

# Pull base model
ollama pull llama3

# Create Custom Constitutional Model
if [ -f "models/Modelfile.YemenJPT" ]; then
    echo "   Creating 'YemenJPT' from Modelfile..."
    ollama create YemenJPT -f models/Modelfile.YemenJPT
else
    echo "⚠️ Warning: models/Modelfile.YemenJPT not found."
fi

# 4. Frontend Setup
echo "🔵 [4/5] Installing Frontend Dependencies..."
npm install

# 5. Launch Instructions
echo "🔵 [5/5] Setup Complete!"
echo ""
echo "🚀 TO START THE PLATFORM:"
echo "1. Start Backend:  source venv/bin/activate && cd backend && uvicorn main:app --reload"
echo "2. Start Frontend: npm run dev"
echo ""
echo "Access the dashboard at: http://localhost:3000"
