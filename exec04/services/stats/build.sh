
# docker build --tag rhonalchirinos/exec04-stats:latest .
# docker push rhonalchirinos/exec04-stats:latest

docker buildx build --platform linux/amd64 -t rhonalchirinos/exec04-stats:latest . --push
