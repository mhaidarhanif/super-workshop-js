<div align="center">
<h1>Super Workshop JS :gear: Workshop with JavaScript</h1>
</div>

> This experimental workshop repo is designed for faster learning curve of practicing and implementing friendly best practice of various web technologies.

## Hall of Badges

### General

| Category | Badge |
|----------|-------|
| Management     | [![ZenHub](https://raw.githubusercontent.com/ZenHubIO/support/master/zenhub-badge.png)](https://zenhub.com) [![Waffle.io](https://img.shields.io/waffle/label/mhaidarh/super-workshop-js/ready.svg)](https://waffle.io/mhaidarh/super-workshop-js)
| License        | [![License](https://img.shields.io/github/license/mhaidarh/super-workshop-js.svg)](LICENSE)
| Style Guide    | [![Standard](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com) [![Good Parts](https://img.shields.io/badge/code%20style-goodparts-brightgreen.svg)](https://github.com/dwyl/goodparts "JavaScript The Good Parts")
| Dependency CI  | [![Dependency CI](https://dependencyci.com/github/mhaidarh/super-workshop-js/badge)](https://dependencyci.com/github/mhaidarh/super-workshop-js)
| bitHound       | [![bitHound Overall Score](https://bithound.io/github/mhaidarh/super-workshop-js/badges/score.svg)](https://bithound.io/github/mhaidarh/super-workshop-js) [![bitHound Code](https://www.bithound.io/github/mhaidarh/super-workshop-js/badges/code.svg)](https://www.bithound.io/github/mhaidarh/super-workshop-js)
| bitHound Dep   | [![bitHound Dependencies](https://www.bithound.io/github/mhaidarh/super-workshop-js/badges/dependencies.svg)](https://www.bithound.io/github/mhaidarh/super-workshop-js/master/dependencies/npm) [![bitHound Dev Dependencies](https://www.bithound.io/github/mhaidarh/super-workshop-js/badges/devDependencies.svg)](https://www.bithound.io/github/mhaidarh/super-workshop-js/master/dependencies/npm)
| Codacy Grade   | [![Codacy Grade](https://img.shields.io/codacy/grade/9820a9dd1787489dae6122392e101f53.svg)](https://codacy.com/app/mhaidarh/super-workshop-js?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=mhaidarh/super-workshop-js&amp;utm_campaign=Badge_Grade)
| Code Climate   | [![GPA](https://codeclimate.com/github/mhaidarh/super-workshop-js/badges/gpa.svg)](https://codeclimate.com/github/mhaidarh/super-workshop-js) [![Issue Count](https://codeclimate.com/github/mhaidarh/super-workshop-js/badges/issue_count.svg)](https://codeclimate.com/github/mhaidarh/super-workshop-js/issues) [![Test Coverage](https://codeclimate.com/github/mhaidarh/super-workshop-js/badges/coverage.svg)](https://codeclimate.com/github/mhaidarh/super-workshop-js/coverage)
| Travis CI      | [![Build Status](https://travis-ci.org/mhaidarh/super-workshop-js.svg?branch=master)](https://travis-ci.org/mhaidarh/super-workshop-js)
| Snap CI        | ...
| Codeship       | ...
| Inch CI Docs   | [![Inch CI](https://inch-ci.org/github/mhaidarh/super-workshop-js.svg?branch=master)](https://inch-ci.org/github/mhaidarh/super-workshop-js)

### Server with Node.js and Express

| Category | Badge |
|----------|-------|
| Node.js        | [![Node.js Version](https://img.shields.io/node/v/super-server-express.svg "Node.js 7, the latest supported")](http://nodejs.org/download)
| npm            | [![npm package version](https://img.shields.io/npm/v/super-server-express.svg)](https://npmjs.com/package/super-server-express)
| Dependency     | [![Dependency Status](https://david-dm.org/mhaidarh/super-server-express.svg "Dependencies Checked & Updated Regularly (Security is Important!)")](https://david-dm.org/mhaidarh/super-server-express)
| Dev Dependency | [![devDependencies Status](https://david-dm.org/mhaidarh/super-server-express/dev-status.svg)](https://david-dm.org/mhaidarh/super-server-express?type=dev)
| Express        | [![Express 4](http://img.shields.io/badge/express-^4.14.0-brightgreen.svg "Latest Express.js")](https://expressjs.com)
| Coverage       | [![Coveralls](https://coveralls.io/repos/github/mhaidarh/super-workshop-js/badge.svg?branch=master)](https://coveralls.io/github/mhaidarh/super-workshop-js?branch=master)
| Security       | [![NSP Status](https://nodesecurity.io/orgs/mhaidarh/projects/f52244a3-8070-4e73-817d-729065fad38e/badge)](https://nodesecurity.io/orgs/mhaidarh/projects/f52244a3-8070-4e73-817d-729065fad38e)

## Requirements

- Understanding of JavaScript and Node.js essentials
- Client & Server Side concepts
- Database & Deployment technologies

## Ingredients

Tooling:

* Terminal and zsh
* Git

Documentation:

* README
* API Blueprint

Web Development:

* JavaScript and Node.js
* HTML, Handlebars, and EJS
* CSS, PostCSS, and Stylus
* npm, Yarn, and Bower
* Express and Feathers
* Axios or SuperAgent
* jQuery or Zepto
* Angular 1 or Angular 2
* Vue
* React
* Webpack or Gulp
* PM2

Web Application:

* REST API
* HTTP and CORS
* Environment Variables

Database:

* NeDB
* MongoDB with Mongoose ODM
* PostgreSQL with Sequelize

Authentication:

* Local Password
* OAuth
  * GitHub
  * Facebook
  * Twitter
  * Google
* Passport

Testing:

* Mocha or Karma
* Jasmine
* Chai and Chai HTTP
* PhantomJS, Electron, and Nightmare

Continuous X:

* Travis CI
* Snap CI
* GitLab CI
* Codeship

--------------------------------------------------------------------------------

## Development

Make sure you have installed the latest Node.js and npm. Afterwards, install the required global dependencies.

```sh
# node modules
npm install -g yarn pnpm pm2 nodemon mocha karma-cli live-server bower vue-cli react-native-cli
# ruby gems
sudo gem install travis
```

Then open these directories separately, based on your own preference:

- `servers/server-*`
- `clients/client-*`
- `tests/test-*`

### Server Express (`server-express`)

```sh
npm install
# copy config/*.schema.js to their own config/*.js
# edit each config/*.js
npm run start:dev
```

### Client jQuery (`client-jquery`)

```sh
bower install
live-server
```

### Test Chai (`test-chai`)

```sh
yarn
# edit .env
npm test
travis login --auto
```

--------------------------------------------------------------------------------

## Deployment

(Later, define usage with Codeship or Snap CI)

### Last Check

```sh
npm start
```

### Deploy to Server

```sh
npm run deploy:dev:setup
npm run deploy:dev
```

--------------------------------------------------------------------------------

## Object Model

### Accounts

```json
{
  "name": "String",
  "username": "String",
  "email": "String",
  "password": "String",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Books

```json
{
  "isbn": "String",
  "name": "String",
  "price": "String",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

--------------------------------------------------------------------------------

## API

Default Root URL: `http://localhost:3000`

**Note:** All IDs that required for each endpoints are not using default ID from the database (such as `ObjectId`).

### Accounts

| API Endpoint       | HTTP | Description
|--------------------|------|------------
| `auth/signup`      | POST | Sign up for new account
| `auth/sigin`       | POST | Sign in with existed account
| `api/accounts`     | GET  | Get all accounts
| `api/accounts`     | DEL  | Delete all accounts
| `api/accounts/:accountId` | GET  | Get one account profile by accountId
| `api/accounts/:accountId` | DEL  | Delete one account profile by accountId
| `api/accounts/:accountId` | PUT  | Update one account profile by accountId

### Books

| API Endpoint      | HTTP | Description
|-------------------|------|------------
| `api/books`       | GET  | Get all books
| `api/books`       | DEL  | Delete all books
| `api/books`       | POST | Post a new book
| `api/books/:isbn` | GET  | Get book by ISBN
| `api/books/:isbn` | DEL  | Delete book by ISBN
| `api/books/:isbn` | PUT  | Update book by ISBN

--------------------------------------------------------------------------------

## References and Resources

- [Cloud9 Workspace](https://ide.c9.io/mhaidarh/super-workshop-js)

--------------------------------------------------------------------------------

## [MIT License](https://mhaidarh.mit-license.org)

Copyright (c) 2016
[M Haidar Hanif, https://mhaidarhanif.com](https://mhaidarhanif.com)
