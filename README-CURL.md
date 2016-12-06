# Super Workshop JS :gear: Test with cURL

--------------------------------------------------------------------------------

## Sign up for a new account

**Request:**

```sh
# Sign up via x-www-form-urlencoded
curl localhost:3000/auth/signup -X POST -d "email=apollo@apollo.com&name=Apollo&username=apollo&password=apollo"

# Sign up via JSON
curl localhost:3000/auth/signup \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "email": "apollo@apollo.com",
    "name": "Apollo",
    "username": "apollo",
    "password": "apollo"
  }'
```

**Response:**

```sh
{"token":"ey123456789.eyABCDEFGHIJKLMNOPQRSTUVWXYZ.ABC-XYZ"}%
```

--------------------------------------------------------------------------------

## Sign in with existed account

**Request:**

```sh
# apollo
curl localhost:3000/auth/signin -X POST -d "username=apollo&password=apollo"
```

**Response:**

```sh
{"token":"ey123456789.eyABCDEFGHIJKLMNOPQRSTUVWXYZ.ABC-XYZ"}%
```

--------------------------------------------------------------------------------

## Check authentication

**Request:**

1. `req.body`: `/auth/is-authenticated -d "token=JWT_TOKEN"`
2. `req.query`: `/auth/is-authenticated?token=JWT_TOKEN`
3. `req.headers`: `Authorization: Bearer JWT_TOKEN`

```sh
export TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ODI4NjlmM2Q1OWZmY2ZkYjVmYzJmYTUiLCJpZCI6MSwidXNlcm5hbWUiOiJhZG1pbiIsIm5hbWUiOiJhZG1pbmlzdHJhdG9yIiwiaWF0IjoxNDc5Mjk2OTI5fQ.kn5kFk4fpDaPSkwJAeftPZDZ5C5Z2UDl1i6OX8cTRgE

# Body
curl http://localhost:3000/auth/is-authenticated -d "token=$TOKEN" -X POST

# Query
curl "http://localhost:3000/auth/is-authenticated?token=$TOKEN" -X POST

# Header
curl localhost:3000/auth/is-authenticated -X POST -H "Authorization: Bearer $TOKEN" -X POST
```

**Response:**

```sh
true
```

_NOTE_: Use this only for checking.

--------------------------------------------------------------------------------

## Post a new book

**Request:**

```sh
curl localhost:3000/api/books \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "isbn": "121212",
    "name": "Twelve",
    "price": 12
  }'
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
