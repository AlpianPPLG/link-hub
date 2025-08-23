# API Reference

## Authentication

All API endpoints require authentication using JWT tokens.

### Headers

```
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

## Endpoints

### Links

#### Get All Links

```http
GET /api/links
```

**Response**
```json
{
  "data": [
    {
      "id": "string",
      "url": "string",
      "title": "string",
      "description": "string",
      "createdAt": "string",
      "updatedAt": "string"
    }
  ]
}
```

#### Create New Link

```http
POST /api/links
```

**Request Body**
```json
{
  "url": "string",
  "title": "string",
  "description": "string"
}
```

**Response**
```json
{
  "id": "string",
  "url": "string",
  "title": "string",
  "description": "string",
  "createdAt": "string",
  "updatedAt": "string"
}
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Validation Error",
  "message": "Error details here"
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Authentication required"
}
```

### 404 Not Found
```json
{
  "error": "Not Found",
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred"
}
```
