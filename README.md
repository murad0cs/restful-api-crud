
# 🚀 Scalable REST API

A production-ready, scalable, and extensible REST API built with **Node.js**, **Express**, **ES Modules**, **Joi** validation, and an in-memory datastore — future-proofed for DB integration.

---

## 📁 Project Structure

```
restful-api-crud/
│
├── server.js                     # Entry point
├── package.json
├── .env                          # Environment variables
│
└── src/
    ├── controllers/              # Request logic handlers (CRUD, validation use)
    │   └── itemController.js
    │
    ├── routes/                   # Express route definitions
    │   └── itemRoutes.js
    │
    ├── services/                 # Business logic (service layer)
    │   └── itemService.js
    │
    ├── models/                   # Data model and Joi schemas
    │   └── Item.js
    │
    ├── validators/              # Reusable Joi validation schemas (optional)
    │   └── itemValidator.js
    │
    ├── middleware/              # Error handler, 404 catcher
    │   └── errorMiddleware.js
    │
    └── utils/                   # Utilities (logger, AppError class)
        ├── logger.js
        └── AppError.js
```

---

## ✅ Features

- ✅ ES Module support (`import`/`export`)
- ✅ Centralized `Joi` validation for input and queries
- ✅ Clean controller-service separation
- ✅ Pagination, sorting, search, filtering
- ✅ Centralized error handling with custom `AppError`
- ✅ In-memory store (easily swappable with a real DB)
- ✅ ESM-ready with `"type": "module"`
- ✅ Request logging and health check route

---

## Installation

1. **Clone the repo**

```bash
git clone https://github.com/your-username/restful-api-crud.git
cd restful-api-crud
```

2. **Install dependencies**

```bash
npm install
```

3. **Set environment variables**

Create a `.env` file in the root:

```env
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

---

## Running the Project

### Development Mode (with auto-reload)

```bash
npm run dev
```

> Uses `nodemon` to restart on file changes.

### Production Mode

```bash
npm start
```

---

## API Endpoints

| Method | Endpoint              | Description                     |
|--------|-----------------------|---------------------------------|
| GET    | `/api/v1/items`       | List items (supports filters, pagination) |
| GET    | `/api/v1/items/:id`   | Get single item by ID           |
| POST   | `/api/v1/items`       | Create new item (requires `name` and `price`) |
| PUT    | `/api/v1/items/:id`   | Update item by ID               |
| DELETE | `/api/v1/items/:id`   | Delete item by ID               |
| GET    | `/api/v1/items/stats` | Get stats (if implemented)      |
| GET    | `/health`             | Health check endpoint           |

---

## Query Parameters (for GET `/items`)

| Param      | Type     | Description                     |
|------------|----------|---------------------------------|
| `page`     | Number   | Page number (default: 1)        |
| `limit`    | Number   | Items per page (default: 10)    |
| `category` | String   | Filter by category              |
| `search`   | String   | Search in name, desc, or tags   |
| `isActive` | Boolean  | Filter by active status         |
| `sortBy`   | String   | `name`, `price`, `createdAt`, `updatedAt` |
| `sortOrder`| String   | `asc` or `desc`                 |

---

## Code Style & Tools

- **Linting**: Uses `eslint` for code quality
- **Validation**: `Joi` for request body and query schemas
- **Logging**: `winston`-based custom logger
- **Testing**: `jest` and `supertest` ready

---

## Future Integration Ideas

- 🔌 MongoDB or PostgreSQL via Mongoose/Sequelize
- 🛡 Authentication with JWT
- 📈 Swagger (OpenAPI) docs
- ⚡ Redis caching
- 📦 Docker support

---

## License

MIT License — free to use and modify.
