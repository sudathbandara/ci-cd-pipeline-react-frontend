# Docker Setup for CI/CD Pipeline

## Overview
Your CI/CD pipeline now includes automated Docker image building and pushing to both Docker Hub and GitHub Container Registry.

## Files Created

### 1. Dockerfile (Multi-stage Build)
- **Build Stage**: Uses Node.js 20 Alpine to build the React app
- **Production Stage**: Uses Nginx Alpine to serve the static files
- Includes health check for container monitoring
- Optimized for small image size

### 2. .dockerignore
Excludes unnecessary files from Docker build:
- node_modules, coverage, build folders
- Git files, credentials, development files
- Reduces image size and build time

### 3. CI/CD Pipeline Updates
Added `build-and-push-docker` job that:
- Builds Docker images for multiple architectures (amd64, arm64)
- Pushes to Docker Hub and GitHub Container Registry
- Creates multiple tags (branch, sha, latest)
- Uses layer caching for faster builds

## Setup Instructions

### Step 1: Configure Docker Hub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions → New repository secret

Add these secrets:
1. **DOCKER_USERNAME**: Your Docker Hub username
2. **DOCKER_PASSWORD**: Your Docker Hub access token (NOT your password!)

To create a Docker Hub access token:
1. Go to https://hub.docker.com/settings/security
2. Click "New Access Token"
3. Give it a description (e.g., "GitHub Actions")
4. Copy the token and save it as `DOCKER_PASSWORD` secret

### Step 2: Enable GitHub Container Registry (Optional)

GHCR is automatically enabled with `GITHUB_TOKEN`. Images will be pushed to:
`ghcr.io/sudathbandara/ci-cd-pipeline-react-frontend`

To make images public:
1. Go to https://github.com/sudathbandara/ci-cd-pipeline-react-frontend/pkgs/container/ci-cd-pipeline-react-frontend
2. Click "Package settings"
3. Change visibility to "Public"

## Docker Image Tags

The pipeline creates multiple tags automatically:

| Tag Pattern | Example | When Created |
|-------------|---------|--------------|
| `latest` | `latest` | Only on main branch |
| `branch-name` | `main`, `develop` | Every branch push |
| `branch-sha` | `main-abc1234` | Every commit |
| `pr-number` | `pr-123` | Pull requests |

## Local Testing

### Build Docker Image Locally
```bash
docker build -t ci-cd-pipeline-react-frontend:local .
```

### Run Docker Container
```bash
docker run -p 8080:80 ci-cd-pipeline-react-frontend:local
```

Then open http://localhost:8080 in your browser

### Test with Docker Compose (Optional)
Create a `docker-compose.yml`:
```yaml
version: '3.8'
services:
  frontend:
    build: .
    ports:
      - "8080:80"
    restart: unless-stopped
```

Run: `docker compose up`

## Pulling Images

### From Docker Hub
```bash
# Latest version
docker pull <your-dockerhub-username>/ci-cd-pipeline-react-frontend:latest

# Specific tag
docker pull <your-dockerhub-username>/ci-cd-pipeline-react-frontend:main
```

### From GitHub Container Registry
```bash
# Latest version
docker pull ghcr.io/sudathbandara/ci-cd-pipeline-react-frontend:latest

# Specific tag
docker pull ghcr.io/sudathbandara/ci-cd-pipeline-react-frontend:main
```

## CI/CD Pipeline Flow

```
┌─────────────────────┐
│  Push to GitHub     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Build & Test       │
│  - Install deps     │
│  - Run tests        │
│  - Build React app  │
└──────────┬──────────┘
           │
           ├──────────────────────┬─────────────────────┐
           ▼                      ▼                     ▼
┌──────────────────┐   ┌─────────────────┐   ┌────────────────┐
│  Docker Build    │   │  GitHub Pages   │   │  Other Deploy  │
│  - Multi-arch    │   │  - Static site  │   │  (Optional)    │
│  - Docker Hub    │   └─────────────────┘   └────────────────┘
│  - GHCR          │
└──────────────────┘
```

## Image Details

- **Base Image**: nginx:alpine (~15MB)
- **Architecture**: linux/amd64, linux/arm64
- **Exposed Port**: 80
- **Health Check**: Every 30 seconds
- **Web Server**: Nginx

## Troubleshooting

### Build Fails with "npm ci" Error
- Clear cache in GitHub Actions
- Check package-lock.json is committed

### Authentication Failed to Docker Hub
- Verify `DOCKER_USERNAME` and `DOCKER_PASSWORD` secrets
- Use Docker Hub Access Token, not password

### Image Size Too Large
- Check .dockerignore is properly configured
- Use `docker image ls` to check size
- Multi-stage build already optimizes size

### Cannot Pull from GHCR
- Make sure package is public
- Or authenticate: `echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin`

## Production Deployment

### Using Docker Run
```bash
docker run -d \
  --name react-app \
  -p 80:80 \
  --restart unless-stopped \
  <your-dockerhub-username>/ci-cd-pipeline-react-frontend:latest
```

### Using Docker Compose
```yaml
version: '3.8'
services:
  frontend:
    image: <your-dockerhub-username>/ci-cd-pipeline-react-frontend:latest
    ports:
      - "80:80"
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost/"]
      interval: 30s
      timeout: 3s
      retries: 3
```

### Using Kubernetes
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: react-frontend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: react-frontend
  template:
    metadata:
      labels:
        app: react-frontend
    spec:
      containers:
      - name: frontend
        image: <your-dockerhub-username>/ci-cd-pipeline-react-frontend:latest
        ports:
        - containerPort: 80
        livenessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 5
          periodSeconds: 30
```

## Next Steps

1. ✅ Add Docker Hub secrets to GitHub
2. ✅ Push code to trigger pipeline
3. ✅ Verify Docker images are built and pushed
4. ✅ Pull and test the image locally
5. ✅ Deploy to your production environment

## Security Best Practices

- ✅ Multi-stage build reduces attack surface
- ✅ Uses official Alpine images (minimal)
- ✅ No sensitive data in image
- ✅ Credentials excluded via .dockerignore
- 🔒 Consider: Image scanning (Trivy, Snyk)
- 🔒 Consider: Sign images with Docker Content Trust
- 🔒 Consider: Use specific version tags in production

## Support

For issues:
1. Check GitHub Actions logs
2. Test Docker build locally
3. Verify secrets are configured
4. Check Docker Hub for pushed images
