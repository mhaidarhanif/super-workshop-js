# Express Workshop

This experimental repo is designed for easy learning curve of implementing these technologies:

Tooling:

* Git
* Terminal and zsh

Web Development:

* HTML and EJS
* CSS and Stylus
* JavaScript and Node.js
* npm and Bower
* Express
* EJS
* jQuery
* Vue
* React

Web Application:

* REST API
* CORS
* Environment Variables

Database:

* MongoDB
* Mongoose ODM

Authentication:

* Password
* OAuth
* Passport

Testing:

* Mocha
* Chai
* Nightmare
* Travis

--------------------------------------------------------------------------------

## Development

Make sure you have installed the latest Node.js and npm. Afterwards, install the required global dependencies.

```sh
npm install -g nodemon live-server bower mocha vue-cli
```

Then open `client` and `server` directory separately.

### Server

```sh
npm install
npm run dev
```

### Client

```sh
bower install
live-server
```

--------------------------------------------------------------------------------

## Testing

### Account

```sh
# Sign up a new account
curl localhost:3000/auth/signup -X POST -d "email=admin@admin.com&name=Administrator&username=admin&password=admin"

# Sign in
curl localhost:3000/auth/signin -X POST -d "username=admin&password=admin"

# Get list of all accounts
curl localhost:3000/api/accounts -X GET

# Delete all accounts
curl localhost:3000/api/accounts -X DELETE
```

### Book

```sh
# Get all books
curl localhost:3000/api/books -X GET
```

--------------------------------------------------------------------------------

## Deployment

...

--------------------------------------------------------------------------------

## License

[MIT License](https://mit-license.org)
