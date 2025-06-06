# Task

Configuring persistent volumes for MySQL 

## CREATE VOLUME FOR MYSQL

Behind volume is where the data will be storage. 

```cmd
docker volume create --name storagedb
```

## RUN AND EXECUTE MYSQL 

```cmd
docker run --name mysql-01 -v storagedb:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=123456 mysql:latest
```

## GO TO CONTAINER WITH 

```cmd
docker exec -it mysql-01 sh
```

## INSPECT CONTAINER 

```cmd
docker inspect mysql-01
``` 

## ADD ANOTHER RUN A FOLDER 

```cmd
docker container stop mysql-01
```

```cmd
docker container remove mysql-01
```

```cmd
docker run --name mysql-01 -v storagedb:/var/lib/mysql -v ./:/home/script -e MYSQL_ROOT_PASSWORD=123456 mysql:latest
```

