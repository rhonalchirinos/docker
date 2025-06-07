# Task

Build a API that is less than 20 MB

## BUILD IMAGES

linux/armd64

```cmd
docker build --tag exec01 --platform linux/arm64 . 
```

linux/amd64

```cmd
docker build --tag exec01  --platform linux/amd64 . 
```

## RUN DOCKER

```cmd
docker run --rm --publish 8080:8080 exec01
```
