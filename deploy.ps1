# deploy.ps1
Write-Host "Starting Deployment to Minikube..." -ForegroundColor Green

# 1. Check Minikube Status
$minikubeStatus = minikube status --format='{{.Host}}'
if ($minikubeStatus -ne "Running") {
    Write-Host "Minikube is not running. Attempting to start..." -ForegroundColor Yellow
    minikube start
}

# 2. Configure Docker Environment
Write-Host "Configuring Docker environment..."
& minikube -p minikube docker-env --shell powershell | Invoke-Expression

# 3. Build Backend
Write-Host "Building Backend Image..." -ForegroundColor Cyan
docker build -t backend:v1 ./backend

# 4. Build Frontend
Write-Host "Building Frontend Image..." -ForegroundColor Cyan
docker build -t frontend:v1 ./frontend

# 5. Deploy with Helm
Write-Host "Deploying via Helm..." -ForegroundColor Cyan
# Check if secrets.yaml exists, if not warn
if (-Not (Test-Path "./charts/hackathon-app/secrets.yaml")) {
    Write-Host "WARNING: secrets.yaml not found. Using secrets.template.yaml (This is for demo only)" -ForegroundColor Red
    Copy-Item "./charts/hackathon-app/secrets.template.yaml" "./charts/hackathon-app/secrets.yaml"
}

helm upgrade --install hackathon-app ./charts/hackathon-app -f ./charts/hackathon-app/secrets.yaml

Write-Host "Deployment Verification..." -ForegroundColor Green
kubectl get pods
Write-Host "Done! Access the app via 'minikube service hackathon-app-frontend' or configured Ingress."