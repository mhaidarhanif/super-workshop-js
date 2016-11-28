<div align="center">
<h1>Super Workshop JS :gear: Workshop with JavaScript</h1>
</div>

> This experimental workshop repo is designed for faster learning curve of practicing and implementing friendly best practice of various web technologies.

## Hall of Badges

| Category | Badge |
|----------|-------|
| License        | [![License](https://img.shields.io/github/license/mhaidarh/super-workshop-js.svg)](LICENSE)
| Standard Style | [![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
| Dependency CI  | [![Dependency CI](https://dependencyci.com/github/mhaidarh/super-workshop-js/badge)](https://dependencyci.com/github/mhaidarh/super-workshop-js)
| bitHound       | [![bitHound Overall Score](https://www.bithound.io/github/mhaidarh/super-workshop-js/badges/score.svg)](https://www.bithound.io/github/mhaidarh/super-workshop-js) [![bitHound Dependency](https://img.shields.io/bithound/dependencies/github/mhaidarh/super-workshop-js.svg)](https://bithound.io/github/mhaidarh/super-workshop-js) [![bitHound Code](https://img.shields.io/bithound/code/github/mhaidarh/super-workshop-js.svg)](https://bithound.io/github/mhaidarh/super-workshop-js)
| Codacy Grade   | [![Codacy Grade](https://img.shields.io/codacy/grade/9820a9dd1787489dae6122392e101f53.svg)](https://codacy.com/app/mhaidarh/super-workshop-js?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=mhaidarh/super-workshop-js&amp;utm_campaign=Badge_Grade)
| Code Climate   | [![Code Climate](https://codeclimate.com/github/mhaidarh/super-workshop-js/badges/gpa.svg)](https://codeclimate.com/github/mhaidarh/super-workshop-js) [![Issue Count](https://codeclimate.com/github/mhaidarh/super-workshop-js/badges/issue_count.svg)](https://codeclimate.com/github/mhaidarh/super-workshop-js/issues) [![Test Coverage](https://codeclimate.com/github/mhaidarh/super-workshop-js/badges/coverage.svg)](https://codeclimate.com/github/mhaidarh/super-workshop-js/coverage)
| Inch CI Docs   | [![Inch CI](https://inch-ci.org/github/mhaidarh/super-workshop-js.svg?branch=master)](https://inch-ci.org/github/mhaidarh/super-workshop-js)

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
* jQuery
* Angular
* Vue
* React
* Webpack
* PM2

Web Application:

* REST API
* HTTP and CORS
* Environment Variables

Database:

* MongoDB
* Mongoose ODM

Authentication:

* Local Password
* OAuth
* Passport

Testing:

* Mocha
* Chai
* PhantomJS
* Nightmare

Continuous X:

* Travis
* Snap CI
* Codeship

--------------------------------------------------------------------------------

## Development

Make sure you have installed the latest Node.js and npm. Afterwards, install the required global dependencies.

```sh
npm install -g yarn pnpm nodemon live-server bower mocha vue-cli react-native-cli pm2
```

Then open `server-*` and `client-*` directory separately.

### Server Express (`server-express`)

```sh
npm install
npm run dev
```

### Client jQuery (`client-jquery`)

```sh
bower install
live-server
```

--------------------------------------------------------------------------------

## Deployment

### Last Check

```sh
pm2 start ecosystem.json
```

### Deploy to Server

```sh
pm2 deploy ecosystem.json
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

## [MIT License](https://mhaidarh.mit-license.org)

Copyright (c) 2016
[M Haidar Hanif, https://mhaidarhanif.com](https://mhaidarhanif.com)

