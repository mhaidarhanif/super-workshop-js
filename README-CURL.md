# Workshop JS :gear: Test with cURL

--------------------------------------------------------------------------------

## Sign up for a new account

**Request:**

```sh
# admin
curl localhost:3000/auth/signup -X POST -d "email=admin@admin.com&name=administrator&username=admin&password=admin"

# test
curl localhost:3000/auth/signup -X POST -d "name=Tester&username=test&password=test&email=test@test.com"
```

**Response:**

```sh
{"token":"ey123456789.eyABCDEFGHIJKLMNOPQRSTUVWXYZ.ABC-XYZ"}%
```

--------------------------------------------------------------------------------

## Sign in with existed account

**Request:**

```sh
# admin
curl localhost:3000/auth/signin -X POST -d "username=admin&password=admin"

# test
curl localhost:3000/auth/signin -X POST -d "username=test&password=test"
```

**Response:**

```sh
{"token":"ey123456789.eyABCDEFGHIJKLMNOPQRSTUVWXYZ.ABC-XYZ"}%
```

--------------------------------------------------------------------------------

## Check authentication

**Request:**

1. `req.body`: `/auth/isAuthenticated -d "token=JWT_TOKEN"`
2. `req.query`: `/auth/isAuthenticated?token=JWT_TOKEN`
3. `req.headers`: `Authorization: Bearer JWT_TOKEN`

```sh
export TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ODI4NjlmM2Q1OWZmY2ZkYjVmYzJmYTUiLCJpZCI6MSwidXNlcm5hbWUiOiJhZG1pbiIsIm5hbWUiOiJhZG1pbmlzdHJhdG9yIiwiaWF0IjoxNDc5Mjk2OTI5fQ.kn5kFk4fpDaPSkwJAeftPZDZ5C5Z2UDl1i6OX8cTRgE

# Body
curl http://localhost:3000/auth/isAuthenticated -d "token=$TOKEN" -X POST

# Query
curl "http://localhost:3000/auth/isAuthenticated?token=$TOKEN" -X POST

# Header
curl localhost:3000/auth/isAuthenticated -X POST -H "Authorization: Bearer $TOKEN" -X POST
```

**Response:**

```sh
true
```

_NOTE_: Use this only for checking.

--------------------------------------------------------------------------------

## Create a new book

**Request:**

```sh
curl localhost:3000/api/books -X POST -d "isbn=121212&name=Twelve&price=12"
```

**Response:**

```sh
{
  "__v": 0,
  "_id": "582c55169b62473608c0237e",
  "updatedAt": "2016-11-16T12:46:14.812Z",
  "createdAt": "2016-11-16T12:46:14.812Z",
  "isbn": "121212",
  "name": "Twelve",
  "price": 12,
  "owners": []
}
```
