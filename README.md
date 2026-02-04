
# YemenJPT Sovereign Platform v10.0
**Production Ecosystem:** `ph-ye.org`
**Main IP:** `13.61.154.217`

## 🌐 Sovereign Subdomains
| Service | Domain URL | Description |
|---------|------------|-------------|
| **Core App & API** | [ai.ph-ye.org](http://ai.ph-ye.org) | Intelligence Hub |
| **Secure Files** | [files.ph-ye.org](http://files.ph-ye.org) | Evidence & Forensic Vault |
| **Automation** | [automation.ph-ye.org](http://automation.ph-ye.org) | n8n Flow Engine |
| **Control Center** | [control.ph-ye.org](http://control.ph-ye.org) | DB & Adminer |
| **Forensics** | [scan.ph-ye.org](http://scan.ph-ye.org) | Media Verification |

---

## 🚀 Cloudflare Setup
The `deploy.sh` script handles DNS registration automatically using the provided Token.
Ensure that the Cloudflare Zone for `ph-ye.org` is active.

### Run Deployment:
```bash
chmod +x deploy.sh
sudo ./deploy.sh
```

## 🛠 Features
- **Auto-DNS**: A-records created via Cloudflare API.
- **Native AI**: Ollama running directly on Ubuntu 24.04 for max speed.
- **Unified Routing**: Single entry point for App/API on `ai.ph-ye.org`.
- **Sovereign Storage**: `files.ph-ye.org` points to local encrypted disk.
