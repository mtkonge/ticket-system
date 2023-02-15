# api

## edit document

`document/edit`

request: 

```json
{
    "token": "{token_string}",
    "id": 1024,
    "title": "...",
    "content": ['a', 'b', 'c']
}
```

response: 

status: `200` | `400` | `500`

```json
{
    "msg": "..."
}
```

## create document

`document/create`

request: 

```json
{
    "token": "{token_string}",
    "title": "...",
    "content": ['a', 'b', 'c']
}
```

response: 

status: `200` | `400` | `500`

```json
{
    "msg": "..."
}
```

## all documents

`document/all`

request: 

```json
{
    "token": "{token_string}",
}
```

response: 

status: `200` | `400` | `500`

```json
{
    "msg": "..."
    "documents": [
        {
            "id": 1024,
            "title": "...",
        }
    ]
}
```

## user created tickets

`user/opened`

request: 

```json
{
    "token": "{token_string}",
}
```

response: 

status: `200` | `400` | `500`

```json
{
    "msg": "..."
    "tickets": [
        {
            id: 1024,
            title: "...",
            content: "...",
            creator: 1024,
            assignee: 1024,
            comments: [
                {
                    id: 1024,
                    message: "...",
                    user_id: 1024,
                }
            ]
        }
    ]
}
```

## user assigned tickets

`user/assigned`

request: 

```json
{
    "token": "{token_string}",
}
```

response: 

status: `200` | `400` | `500`

```json
{
    "msg": "..."
    "tickets": [
        {
            id: 1024,
            title: "...",
            content: "...",
            creator: 1024,
            assignee: 1024,
            comments: [
                {
                    id: 1024,
                    message: "...",
                    user_id: 1024,
                }
            ]
        }
    ]
}
```

## all users

`user/all`

request: 

```json
{
    "token": "{token_string}",
}
```

response: 

status: `200` | `400` | `500`

```json
{
    "msg": "..."
    "users": [
        {
            "id": 1024,
            "name": "...",
            "role": "Consumer" | "LevelOne" | "LevelTwo" | "Admin"
        }
    ]
}
```

## edit role

`user/edit_role`

request: 

```json
{
    "token": "{token_string}",
    "user_id": 1024,
    "role": "Consumer" | "LevelOne" | "LevelTwo" | "Admin"
}
```

response: 

status: `200` | `400` | `500`

```json
{
    "msg": "..."
}
```

## register

`user/register`

request: 

```json
{
    "username": "...",
    "password": "..."
}
```

response: 

status: `200` | `400` | `500`

```json
{
    "msg": "..."
}
```

## login

`user/login`

request: 

```json
{
    "username": "...",
    "password": "..."
}
```

response: 

status: `200` | `400` | `500`

```json
{
    "msg": "...",
    "session": "..."
}
```

## open ticket

`ticket/open`

request: 

```json
{
    "token": "...",
    "title": "...",
    "content": "...",
}
```

response: 

status: `200` | `400` | `500`

```json
{
    "msg": "...",
}
```

## user info

`user/info`

request:

```ts
{
    token: string,
}
```

response:

```ts
{
    msg: string,
    user_id?: string,
    username?: string
}
```
