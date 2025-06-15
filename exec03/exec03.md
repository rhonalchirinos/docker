# ✅ Task

Display a Docker Swarm cluster with 3 nodes

## 📦 Create the API

Folder: swarm-api

> swarm-api/Dockerfile

```Dockerfile
FROM node:22.13-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install && npm audit fix --force

COPY . .

EXPOSE 3000

CMD ["node", "main.js"]
```

> swarm-api/package.json

```json
{
  "name": "swarm-api",
  "version": "1.0.0",
  "main": "main.js",
  "license": "MIT",
  "dependencies": {
    "express": "^5.1.0",
    "pg": "^8.16.0"
  }
}
```

> swarm-api/main.js

```js
const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3000;

const pool = new Pool({
  host: process.env.PGHOST || 'postgres',
  user: 'postgres',
  password: process.env.PGPASSWORD || 'secret',
  database: 'postgres',
  port: 5432,
});

app.get('/', async (req, res) => {
  const result = await pool.query('SELECT NOW()');
  res.json({ message: 'Hello from API', time: result.rows[0].now });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`API running on port ${port}`);
});
```

## 🛠️ Build the Docker image

```bash
docker build --tag rhonalchirinos/hello-api:latest .
```

## ☁️ Push to Docker Hub

```bash
docker login
docker push rhonalchirinos/hello-api:latest
```

## 🌐 Create an Overlay Network

```cmd
docker network create -d overlay hello-net
```

> ℹ️ Why an overlay network? Overlay networks allow containers and services to communicate across multiple Docker nodes in a Swarm. This eliminates the need for OS-level routing.

## 🐳 Initialize Docker Swarm

```bash
docker swarm init 
```

## ➕ Add Worker Nodes to the Swarm

```bash
docker swarm join --token SWMTKN-1-xxxxx 192.168.64.6:2377
```

> 📌 You can get the worker token using:

```bash
docker swarm join-token worker
```

## 🛢️ Create a PostgreSQL Service

```bash
docker service create \
  --name postgres \
  --env POSTGRES_PASSWORD=secret \
  --mount type=volume,source=testdb,target=/var/lib/postgresql/data \
  --network hello-net \
  postgres
```

## 🚀 Deploy the API Service in Swarm

First, check if services are listed:

```bash
docker service ls
```
Then create the service:

```bash
docker service create \
  --name some-api \
  --replicas 3 \
  --publish 3000:3000 \
  --network hello-net \
  rhonalchirinos/hello-api:latest
```

You can inspect the published ports with:

```bash
# inspect ports
docker service inspect some-api --format '{{json .Endpoint.Ports}}' | jq
```

## 🧪 Test the API

```bash
curl <http://localhost:3000>
```
