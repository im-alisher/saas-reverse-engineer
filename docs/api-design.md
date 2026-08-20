# API Design

## Base URL

```
/api/v1
```

## Endpoints

### Create Analysis

```
POST /api/v1/analyses
```

**Request:**
```json
{
  "url": "https://example-saas.com"
}
```

**Validation:**
- `url` must be a valid URL format
- `url` must use http or https protocol
- Maximum URL length: 2048 characters

**Response (201):**
```json
{
  "id": "clxyz123...",
  "url": "https://example-saas.com",
  "status": "PROCESSING",
  "createdAt": "2026-01-01T00:00:00.000Z"
}
```

---

### Get Analysis

```
GET /api/v1/analyses/:id
```

**Response (200):**
```json
{
  "id": "clxyz123...",
  "url": "https://example-saas.com",
  "status": "COMPLETED",
  "productSummary": { ... },
  "coreFeatures": { ... },
  "competitors": { ... },
  "revenueModel": { ... },
  "architecture": { ... },
  "databaseSchema": { ... },
  "apiDesign": { ... },
  "mvpRoadmap": { ... },
  "createdAt": "2026-01-01T00:00:00.000Z",
  "updatedAt": "2026-01-01T00:05:00.000Z"
}
```

---

### List Analyses

```
GET /api/v1/analyses?page=1&limit=20
```

**Query Parameters:**
- `page` (optional, default: 1)
- `limit` (optional, default: 20, max: 100)

**Response (200):**
```json
{
  "data": [ ... ],
  "meta": {
    "total": 42,
    "page": 1,
    "limit": 20,
    "totalPages": 3
  }
}
```

---

### Delete Analysis

```
DELETE /api/v1/analyses/:id
```

**Response (204):** No content

---

## Error Responses

```json
{
  "statusCode": 400,
  "message": ["url must be a valid URL"],
  "error": "Bad Request"
}
```

```json
{
  "statusCode": 404,
  "message": "Analysis not found",
  "error": "Not Found"
}
```

```json
{
  "statusCode": 500,
  "message": "Analysis processing failed",
  "error": "Internal Server Error"
}
```

## CORS

- Frontend origin configurable via `CORS_ORIGIN` env variable
- Default: `http://localhost:5173`
