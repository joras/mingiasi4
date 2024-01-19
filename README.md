# product chat

## to install deps

`npm install`

#### you need a postgesql database

you can create one with docker:
`docker run --name product-chat-db -e POSTGRES_PASSWORD=secret -d -p 5432:5432 postgres`

## to configure

set `DATABASE_URL` and `OPENAI_API_KEY` in env or in `.env` file, for ex:

```
DATABASE_URL="postgresql://postgres:secret@localhost:5432/product-chat-db?schema=public"
OPENAI_API_KEY = 'YOUR SUPERSECRET KEY'
```

#### create database

`npx prisma db push` -- will create the database tables
`npx prisma db seed` -- will seed the database

## run