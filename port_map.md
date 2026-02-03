# YemenJPT Port Mapping Strategy

| Subdomain | Service | Port | Internal |
|-----------|---------|------|----------|
| api.raidan.pro | Gateway | 8000 | 8000 |
| radar.raidan.pro | NLP Engine | 8001 | 8001 |
| meter.raidan.pro | Legal Meter | 8002 | 8002 |
| voice.raidan.pro | Voice Legacy | 8003 | 8003 |
| scan.raidan.pro | Forensics | 8080 | 8080 |
| vault.raidan.pro | MinIO | 9000 | 9000 |
| studio.raidan.pro | n8n | 5678 | 5678 |
| vector.raidan.pro | Qdrant | 6333 | 6333 |
| db.raidan.pro | Postgres | 5432 | 5432 |
| graph.raidan.pro | Neo4j | 7474 | 7474 |
| news.raidan.pro | Ghost CMS | 2368 | 2368 |

*Range: 3000-9999 reserved for dynamic microservices.*
