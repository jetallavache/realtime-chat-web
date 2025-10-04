# BuzzLine

<p align="center">
    <a href="https://github.com/jetallavache/real-time-chat"><img src="https://img.shields.io/github/release-date/jetallavache/real-time-chat" alt="GitHub Release Date"></a>
    <a href="https://github.com/jetallavache/real-time-chat/latest"><img src="https://img.shields.io/github/commits-since/jetallavache/real-time-chat/latest" alt="GitHub commits since latest release"></a>
    <a href="https://github.com/semantic-release/semantic-release"><img src="https://img.shields.io/badge/semantic--release-angular-e10079?logo=semantic-release" alt="semantic-release"></a>
    <a href=""><img src="https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white" alt=""></a>
    <a href=""><img src="https://img.shields.io/badge/Node.js-43853D?logo=node.js&logoColor=white" alt=""></a>
    <a href=""><img src="https://img.shields.io/badge/Express.js-404D59" alt=""></a>
    <a href=""><img src="https://img.shields.io/badge/-v4.7.5-23853D?label=socket.io" alt=""></a>   
    <a href=""><img src="https://img.shields.io/badge/-v8.5.1-23853D?label=mongoose" alt=""></a>
    <a href=""><img src="https://img.shields.io/badge/-v3.20.2-23853D?label=zod" alt=""></a>
    <a href=""><img src="https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB" alt=""></a>
    <a href=""><img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white" alt=""></a>
    <a href="https://github.com/shadcn-ui/ui"><img src="https://img.shields.io/badge/-shancn/ui@0.8.0-303030" alt=""></a>
</p>

## About

This is a real-time chat application built using React and NodeJS/Express/Socket.io Backend.

A real-time chat implementation that allows users to join a common channel where they can send and receive messages.


## Getting started

A reliable and fast way to launch a project is to use docker containers. In [docker-compose.yml](/docker-compose.dev.yml) allows you to run containers with the database, server and client application sequentially.

### Quick start

Clone the repo to your machine 

```bash
$ git clone https://github.com/jetallavache/real-time-chat.git
```

Start up application by running

```bash
$ npm run dev:compose:up
```

App should be running on http://localhost:80

### Alternative start

To start, you will need to run the mongodb service. I suggest running a ready-made docker image. You must specify the data for initializing the database. 

- Script for initializing the creation of an admin user [./mongo/mongo-init.js](/mongo/mongo-init.js)
- Defining variables for *root-user*
- Creating a volume *chat-mongodb-data*

Create *.env* file and add the following lines

```
M_USERNAME=user
M_PASSWORD=password
M_DATABASE=chat-db
```

Start up database by running

```bash
$ docker run --name chat-mongodb -d -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=root -e MONGO_INITDB_ROOT_PASSWORD=password -e MONGO_INITDB_DATABASE=chat-db -v chat-mongodb-data:/data/db -v ./mongodb/mongo-init.js:/docker-entrypoint-initdb.d/mongo-init.js:ro mongo:latest  
```

Lunch backend & frontend app

```bash
$ npm run dev
```

App should be running on http://localhost:8080
