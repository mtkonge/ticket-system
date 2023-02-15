# api

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
