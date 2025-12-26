### DB

#### Build the PostgreSQL Image

```bash
docker build -f Dockerfile.postgres -t my-postgres14 .
```

#### Run the Database Container

```bash
docker run -d \
  --name postgres-database \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=admin \
  -e POSTGRES_DB=mydatabase \
  -p 5432:5432 \
  -v pgdata:/var/lib/postgresql/data \
  my-postgres14
```

#### Verify Database is Running

```bash
docker ps | grep postgres-database
docker logs postgres-database
```

#### Database Connection Details

- **Host:** `localhost`
- **Port:** `5432`
- **Database:** `mydatabase`
- **User:** `admin`
- **Password:** `admin`
- **Full URL:** `postgresql+asyncpg://admin:admin@localhost:5432/mydatabase`


### Migrations

uv run alembic revision --autogenerate -m "description"

uv run alembic upgrade head


### Run app

uv run uvicorn app.main:app --reload