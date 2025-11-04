# Quick Docker Commands Reference

## Local Development

### Build Image
```bash
docker build -t ci-cd-pipeline-react-frontend:local .
```

### Run Container
```bash
docker run -d -p 8080:80 --name react-app ci-cd-pipeline-react-frontend:local
```

### Using Docker Compose
```bash
# Start
docker compose up -d

# View logs
docker compose logs -f

# Stop
docker compose down
```

### Access Application
- Open http://localhost:8080

## Container Management

### View Running Containers
```bash
docker ps
```

### Stop Container
```bash
docker stop react-app
```

### Remove Container
```bash
docker rm react-app
```

### View Logs
```bash
docker logs react-app -f
```

### Execute Commands Inside Container
```bash
docker exec -it react-app sh
```

## Image Management

### List Images
```bash
docker images
```

### Remove Image
```bash
docker rmi ci-cd-pipeline-react-frontend:local
```

### Clean Up
```bash
# Remove unused images
docker image prune

# Remove all unused resources
docker system prune -a
```

## Production

### Pull Latest Image (Docker Hub)
```bash
docker pull <your-username>/ci-cd-pipeline-react-frontend:latest
```

### Pull Latest Image (GitHub Container Registry)
```bash
docker pull ghcr.io/sudathbandara/ci-cd-pipeline-react-frontend:latest
```

### Run Production Container
```bash
docker run -d \
  --name react-frontend-prod \
  -p 80:80 \
  --restart unless-stopped \
  <your-username>/ci-cd-pipeline-react-frontend:latest
```

## Troubleshooting

### Check Container Health
```bash
docker inspect --format='{{json .State.Health}}' react-app
```

### View Container Resource Usage
```bash
docker stats react-app
```

### Rebuild Without Cache
```bash
docker build --no-cache -t ci-cd-pipeline-react-frontend:local .
```
