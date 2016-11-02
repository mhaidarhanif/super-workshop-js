# Express Workshop

Express workshop.

## Setup

```sh
npm install
```

## Usage

```sh
npm start
```

--------------------------------------------------------------------------------

## API

| Endpoint          | HTTP | Description
|-------------------|------|------------
| `api/books`       | GET  | Get all books
| `api/books`       | POST | Post a new book
| `api/books/:isbn` | GET  | Get book by ISBN

--------------------------------------------------------------------------------

## Test

### Create new book

```
curl localhost:3000/api/books \
  -X POST \
  -d "isbn=12345&name=Buku&price=99"
```

--------------------------------------------------------------------------------

## Licence

MIT
