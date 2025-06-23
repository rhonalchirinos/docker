
# docker build --tag rhonalchirinos/exec04-auth:latest .
# docker push rhonalchirinos/exec04-auth:latest

docker buildx build --platform linux/amd64 -t rhonalchirinos/exec04-auth:latest . --push

# docker network create prueba_nw
# docker volume create prueba_db
# docker run --rm --volume prueba_db:/data/db  --name db --network prueba_nw mongo:latest
# docker run --rm --publish "6001:3001" --network prueba_nw rhonalchirinos/exec04-auth:latest