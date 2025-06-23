
# docker build --tag rhonalchirinos/exec04-haproxy:latest .
# docker push rhonalchirinos/exec04-haproxy:latest

docker buildx build --platform linux/amd64 -t rhonalchirinos/exec04-haproxy:latest . --push
