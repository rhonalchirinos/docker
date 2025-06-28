# ✅ Task

Configure an inverse proxy with NGINX for 3 microservices using Docker Compose and Docker Swarm.

---

## 🐳 Initialize Docker Swarm

Initialize Docker Swarm on your manager node:

```bash
docker swarm init 
```

---

## ➕ Add Worker Nodes to the Swarm

To add worker nodes to your Swarm, run the following command on each worker node (replace the token and IP with your actual values):

```bash
docker swarm join --token <WORKER_TOKEN> <MANAGER_IP>:2377
```

> **Tip:** Retrieve the worker join token with:
>
> ```bash
> docker swarm join-token worker
> ```

---

## 🏷️ Label Your Nodes

Label your nodes to specify their roles (e.g., database or worker):

1. List all nodes:
    ```bash
    docker node ls 
    ```
2. Add a label to a node (replace `NODE_ID` as needed):
    ```bash
    docker node update --label-add db=true NODE_ID
    docker node update --label-add worker=true NODE_ID
    ```

---

## 📝 Example `docker-compose.yml`

Below is an example `docker-compose.yml` file for your stack:

```yaml
version: '3.8'

services:
  db:
    image: mongo:latest
    ports:
      - 27017:27017
    volumes:
      - db-data:/data/db
    deploy:
      placement:
        constraints:
          - node.labels.db == true
      resources:
        limits:
          cpus: '8.0'
          memory: 8G

  survey:
    image: rhonalchirinos/exec04-survey:latest
    ports:
      - 3000:3000
    command: sh -c "node /app/src/main.js"
    depends_on:
      - db
    deploy:
      replicas: 3
      resources:
        limits:
          cpus: '1.0'
          memory: 1G
      placement:
        constraints: [ node.labels.worker == true ]

  auth:
    image: rhonalchirinos/exec04-auth:latest
    ports:
      - 3001:3001
    command: sh -c "node /app/src/main.js"
    depends_on:
      - db
    deploy:
      replicas: 3
      resources:
        limits:
          cpus: '1.0'
          memory: 1G
      placement:
        constraints: [ node.labels.worker == true ]
    environment:
      - MONGO_DB=mongodb://db:27017/app
      - PORT=3001

  stats:
    image: rhonalchirinos/exec04-stats:latest
    ports:
      - 3002:3002
    depends_on:
      - db
    deploy:
      replicas: 2
      resources:
        limits:
          cpus: '1.0'
          memory: 1G
      placement:
        constraints: [ node.labels.worker == true ]

  haproxy:
    image: rhonalchirinos/exec04-haproxy:latest
    ports:
      - "80:8080"
    depends_on:
      - stats
      - auth
      - survey
    deploy:
      placement:
        constraints: [ node.role == manager ]

  visualizer:
    image: dockersamples/visualizer:latest
    ports:
      - "8080:8080"
    volumes:
      - "/var/run/docker.sock:/var/run/docker.sock:ro"
    deploy:
      placement:
        constraints: [ node.role == manager ]
      replicas: 1

volumes:
  db-data:
```

---

## 🚀 Deploy the Stack

Deploy your stack using the following command:

```bash
docker stack deploy -c docker-compose.yml mystack
```

---

## 📌 Notes

- Ensure all images are built and available (locally or on a registry) before deploying.
- The `haproxy` service acts as a reverse proxy for your microservices.
- The `visualizer` service provides a UI to visualize your Docker Swarm cluster.
- Adjust resource limits and replica counts as needed for your environment.
