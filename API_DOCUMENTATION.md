# API Documentation

## Generic Medicine Transparency System - REST API

**Base URL:** `http://localhost:5000/api`

---

## Endpoints

### 1. Get All Medicines

**Endpoint:** `GET /medicines`

**Description:** Retrieve all medicines from the database

**Response:**
```json
{
  "success": true,
  "count": 20,
  "data": [
    {
      "id": 1,
      "brandName": "Aspirin Plus",
      "genericName": "Acetylsalicylic Acid",
      "category": "Pain Relief",
      "composition": "Acetylsalicylic Acid 500mg",
      "price": "45.00",
      "manufacturer": "Bayer Healthcare",
      "created_at": "2024-01-15T10:30:00Z"
    },
    ...
  ]
}
```

**Example Request:**
```bash
curl http://localhost:5000/api/medicines
```

**Status Codes:**
- `200 OK` - Success
- `500 Internal Server Error` - Database error

---

### 2. Search Medicines

**Endpoint:** `GET /search?q=query`

**Description:** Search medicines by brand name, generic name, or category

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| q | string | Yes | Search query |

**Response:**
```json
{
  "success": true,
  "query": "aspirin",
  "count": 2,
  "data": [
    {
      "id": 1,
      "brandName": "Aspirin Plus",
      "genericName": "Acetylsalicylic Acid",
      "category": "Pain Relief",
      "composition": "Acetylsalicylic Acid 500mg",
      "price": "45.00",
      "manufacturer": "Bayer Healthcare",
      "created_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

**Example Requests:**
```bash
# Search by brand name
curl "http://localhost:5000/api/search?q=Aspirin"

# Search by generic name
curl "http://localhost:5000/api/search?q=Paracetamol"

# Search by category
curl "http://localhost:5000/api/search?q=Antibiotic"
```

**Error Response (missing query):**
```json
{
  "success": false,
  "message": "Search query is required"
}
```

**Status Codes:**
- `200 OK` - Success
- `400 Bad Request` - Missing query parameter
- `500 Internal Server Error` - Database error

---

### 3. Get Medicine by ID

**Endpoint:** `GET /medicines/:id`

**Description:** Get details of a specific medicine

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | number | Yes | Medicine ID (in URL path) |

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "brandName": "Aspirin Plus",
    "genericName": "Acetylsalicylic Acid",
    "category": "Pain Relief",
    "composition": "Acetylsalicylic Acid 500mg",
    "price": "45.00",
    "manufacturer": "Bayer Healthcare",
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

**Example Requests:**
```bash
curl http://localhost:5000/api/medicines/1
curl http://localhost:5000/api/medicines/5
```

**Error Response (not found):**
```json
{
  "success": false,
  "message": "Medicine not found"
}
```

**Status Codes:**
- `200 OK` - Success
- `400 Bad Request` - Missing ID
- `404 Not Found` - Medicine doesn't exist
- `500 Internal Server Error` - Database error

---

### 4. Get All Categories

**Endpoint:** `GET /categories`

**Description:** Get list of all medicine categories

**Response:**
```json
{
  "success": true,
  "count": 15,
  "data": [
    "Allergy Relief",
    "Antibiotic",
    "Antidepressant",
    "Antifungal",
    "Anti-Inflammatory",
    "Antacid",
    "Blood Pressure",
    "Cholesterol",
    "Cognitive Support",
    "Cough Suppressant",
    "Diabetes",
    "Fever & Pain",
    "Hypertension",
    "Pain Relief",
    "Respiratory",
    "Supplement"
  ]
}
```

**Example Request:**
```bash
curl http://localhost:5000/api/categories
```

**Status Codes:**
- `200 OK` - Success
- `500 Internal Server Error` - Database error

---

### 5. Get Medicines by Category

**Endpoint:** `GET /medicines/category/:category`

**Description:** Get all medicines in a specific category

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| category | string | Yes | Category name (in URL path) |

**Response:**
```json
{
  "success": true,
  "category": "Antibiotic",
  "count": 3,
  "data": [
    {
      "id": 5,
      "brandName": "Amoxycillin 500",
      "genericName": "Amoxycillin",
      "category": "Antibiotic",
      "composition": "Amoxycillin Trihydrate 500mg",
      "price": "120.00",
      "manufacturer": "Cipla Limited",
      "created_at": "2024-01-15T10:30:00Z"
    },
    ...
  ]
}
```

**Example Requests:**
```bash
curl "http://localhost:5000/api/medicines/category/Antibiotic"
curl "http://localhost:5000/api/medicines/category/Pain%20Relief"
curl "http://localhost:5000/api/medicines/category/Diabetes"
```

**Status Codes:**
- `200 OK` - Success
- `400 Bad Request` - Missing category
- `500 Internal Server Error` - Database error

---

## Health Check

**Endpoint:** `GET /health`

**Description:** Check if server is running

**Response:**
```json
{
  "message": "Server is running"
}
```

**Example Request:**
```bash
curl http://localhost:5000/health
```

---

## Error Handling

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error description"
}
```

### Common Error Messages:
- `"Search query is required"` - Missing q parameter
- `"Medicine not found"` - Invalid medicine ID
- `"Medicine ID is required"` - Missing ID in URL
- `"Category is required"` - Missing category parameter
- `"Error fetching medicines: ..."` - Database error

---

## Response Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 400 | Bad Request - Invalid parameters |
| 404 | Not Found - Resource doesn't exist |
| 500 | Internal Server Error - Server error |

---

## Usage Examples

### JavaScript/Fetch

```javascript
// Get all medicines
fetch('http://localhost:5000/api/medicines')
  .then(res => res.json())
  .then(data => console.log(data.data));

// Search medicines
fetch('http://localhost:5000/api/search?q=aspirin')
  .then(res => res.json())
  .then(data => console.log(data.data));

// Get categories
fetch('http://localhost:5000/api/categories')
  .then(res => res.json())
  .then(data => console.log(data.data));
```

### curl Commands

```bash
# Get all medicines (limit output)
curl http://localhost:5000/api/medicines | head -50

# Pretty print JSON (requires jq)
curl http://localhost:5000/api/medicines | jq

# Get only brand names
curl http://localhost:5000/api/medicines | jq '.data[].brandName'

# Count medicines
curl http://localhost:5000/api/medicines | jq '.count'
```

### Postman/Insomnia

1. Create a new request
2. Method: `GET`
3. URL: `http://localhost:5000/api/medicines`
4. Click "Send"

---

## Data Structure

### Medicine Object

```typescript
{
  id: number,                  // Unique identifier
  brandName: string,           // Brand/Trade name
  genericName: string,         // Active ingredient name
  category: string,            // Medicine category
  composition: string,         // Detailed ingredients & dosage
  price: string,               // Price in INR (₹)
  manufacturer: string,        // Manufacturing company
  created_at: string          // ISO timestamp
}
```

### Response Format

```typescript
{
  success: boolean,
  message?: string,            // Error message (if any)
  count?: number,              // Number of results
  query?: string,              // Search query (if applicable)
  data: Medicine[] | string[]  // Response data
}
```

---

## Rate Limiting

Currently no rate limiting is implemented. Production deployments should add:
- Express rate limiter middleware
- API key authentication
- Request throttling

---

## CORS Configuration

The API accepts requests from:
- `http://localhost:*` (All localhost ports)
- `http://127.0.0.1:*` (Localhost IP)

To add more origins, modify `server.js`:
```javascript
app.use(cors({
  origin: ['http://localhost:3000', 'http://example.com']
}));
```

---

## Performance Notes

- All endpoints return results instantly
- Search is case-insensitive and partial-match enabled
- Maximum response time: <100ms
- Database indexed on: brandName, genericName, category

---

## Pagination (Future)

Currently not implemented. To add pagination:

```javascript
GET /medicines?page=1&limit=10
```

Would return results 0-9 of first page.

---

**Last Updated:** 2024
**API Version:** 1.0.0
**Status:** Production Ready
