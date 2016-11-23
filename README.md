<div align="center">
<h1>Workshop JS :gear: Workshop with JavaScript</h1>
</div>

<div align="center">
<a href="http://standardjs.com/"><img src="https://img.shields.io/badge/code%20style-standard-brightgreen.svg" alt="JavaScript Style Guide"></a>
<a href="https://inch-ci.org/github/mhaidarh/super-workshop-js"><img src="https://inch-ci.org/github/mhaidarh/super-workshop-js.svg?branch=master" alt="Inch CI"></a>
<a href="https://dependencyci.com/github/mhaidarh/super-workshop-js"><img src="https://dependencyci.com/github/mhaidarh/super-workshop-js/badge" alt="Dependency CI"></a>
<a href="https://david-dm.org/mhaidarh/super-workshop-js"><img src="https://img.shields.io/david/mhaidarh/super-workshop-js.svg" alt="David Dependency"></a>
<a href="https://bithound.io/github/mhaidarh/super-workshop-js"><img src="https://img.shields.io/bithound/dependencies/github/mhaidarh/super-workshop-js.svg" alt="bitHound Dependency"></a>
<a href="https://bithound.io/github/mhaidarh/super-workshop-js"><img src="https://img.shields.io/bithound/code/github/mhaidarh/super-workshop-js.svg" alt="bitHound Code"></a>
<a href="https://codacy.com/app/mhaidarh/super-workshop-js?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=mhaidarh/super-workshop-js&amp;utm_campaign=Badge_Grade"><img src="https://img.shields.io/codacy/grade/9820a9dd1787489dae6122392e101f53.svg" alt="Codacy Grade"></a>
<a href="LICENSE"><img src="https://img.shields.io/github/license/mhaidarh/super-workshop-js.svg" alt="License"></a>
</div>

This experimental workshop repo is designed for easy learning curve of practicing and implementing friendly best practice of these technologies:

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
npm install -g nodemon live-server bower mocha vue-cli pm2
```

Then open `server-*` and `client-*` directory separately.

### Server Express

```sh
npm install
npm run dev
```

### Client jQuery

```sh
bower install
live-server
```

--------------------------------------------------------------------------------

## Deployment

**TODO with PM2**

--------------------------------------------------------------------------------

## Object Model

### Accounts

```json
{
  "name": String,
  "username": String,
  "email": String,
  "password": String,
  "createdAt": Date,
  "updatedAt": Date
}
```

### Books

```json
{
  "isbn": String,
  "name": String,
  "price": String,
  "createdAt": Date,
  "updatedAt": Date
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

## License

[MIT License](https://mit-license.org)
