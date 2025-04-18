## docker setup
- `$ cd monorepo `
- `$ docker volume create instagram-volume `
- `docker network create instagram-network `
- `$  docker run -d --name instagram-postgres -e POSTGRES_USER=instagram-user -e POSTGRES_PASSWORD=ig-password -e POSTGRES_DB=ig-pg-db -v instagram-volume:/var/lib/postgresql/data --network instagram-network -p ::5432 postgres`
- `$ docker build --build-arg DATABASE_URL="postgresql://instagram-user:ig-password@instagram-postgres:5432/ig-pg-db" -f ./docker/Dockerfile.http-backend -t apps/http-backend ./ `
- `$ docker build': docker build --build-arg DATABASE_URL="postgresql://instagram-user:ig-password@instagram-postgres:5432/ig-pg-db" -f ./docker/Dockerfile.ws-backend -t apps/ws-backend ./`
- `$  docker run -p 3000:3000 --network=instagram-network -e DATABASE_URL="postgres://instagram-user:ig-pas
sword@instagram-postgres:5432/ig-pg-db"  apps/http-backend `
- `$ docker run -p 8080:8080 --network=instagram-network -e DATABASE_URL="postgres://instagram-user:ig-password@instagram-postgres:5432/ig-pg-db"  apps/ws-backend`

## docker-compose 
- `$ cd monorepo `
- `$ docker compose up --build`