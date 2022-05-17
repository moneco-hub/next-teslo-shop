# Next.js Teslo Shop

To run locally you need the database

```
    docker-compose up -d
```

- -d, means **detached**

- Local MongoDB URL:

```
mongodb://localhost:27018/teslodb
```

- Install node modules and start development server

```
yarn install
yarn dev
```

## Set environment variables

Rename the file **.env.template** to **.env**

- Set the environment variable MONGO_URL:

```
MONGO_URL = mongodb://localhost:27017/entriesdb
```

## Populate the database with test info

call enpoint:

```
    http://localhost:3000/api/seed
```
