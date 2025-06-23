
# docker build --tag rhonalchirinos/exec04-survey:latest .
# docker push rhonalchirinos/exec04-survey:latest
docker buildx create --use 
docker buildx build --platform linux/amd64 -t rhonalchirinos/exec04-survey:latest . --push


