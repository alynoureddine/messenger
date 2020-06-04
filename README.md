## This is a work in progress..

This is the unfinished back-end part of a <b>chat app</b>, to be built using the following: 
* <a href="https://nestjs.com/">NestJS</a> as a NodeJS framework
* <a href="https://socket.io/">Socket.io</a> for websockets
* <a href="https://www.docker.com/">Docker</a> as a container
* <a href="http://www.passportjs.org/">Passport</a> for authentication
* <a href="https://reactjs.org/">React</a> for client side (will create a different repo for that)
* <a href="https://www.mongodb.com/">MongoDB</a> for sessions (using mongoose as an ORM)
* <a href="https://www.mysql.com/">MySQL</a> as a default relational database (using TypeORM)
* <a href="https://jestjs.io/">Jest</a> for testing

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
