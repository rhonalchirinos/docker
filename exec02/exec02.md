# Task

Configure Docker Volumes for MySQL  

## Create a Volume

```cmd
docker volume create --name storage_test
```

## List All Volumes

```cmd
docker volume ls
```

## Where Does Docker Store My Volume Data?

```cmd
docker volume inspect storage_test
```

> 💡 This command shows detailed information about the volume, including the path on your host system where the data is stored.

## Remove a Volume

```cmd
docker volume rm storage_test
```

> ⚠️ You can’t remove a volume that’s currently in use by a running container.

## Run a MySQL Container with a Volume

```cmd
docker volume create --name storagedb

docker run --name mysql-01 \
  -v storagedb:/var/lib/mysql \
  -e MYSQL_ROOT_PASSWORD=123456 \
  -d mysql:latest
```

## Execute a SQL Script Inside the Container

```cmd
docker exec -i mysql-01 \
sh -c 'exec mysql -uroot -p"$MYSQL_ROOT_PASSWORD"' < ./mysql/databases.sql
```

## Notes

💡 Docker volumes are a powerful way to persist and share data across containers. You can also use the same volume in multiple containers if needed.

Thanks for reading! ✨
