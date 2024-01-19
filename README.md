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

`npm run start:dev` -- will start a nestjs server on port 3000

## usage

### UI

open `localhost:3000` in your browser. the browser ui will use `testuser` user

### API

use the API:
    - set `X-User` header to username
    - post JSON to chat endpoint `{input: <your message>}`

for example with curl:

 `curl -H "X-User: jaan" localhost:3000/chat -H "Content-Type: application/json" -d "{\"input\": \"show my orders\"}"`