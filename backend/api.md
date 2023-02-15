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

>>>>>>> 9403e3b (specify user info)
