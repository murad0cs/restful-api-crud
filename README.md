# RESTful API CRUD - ES Modules Version

A simple, scalable REST API built with Node.js and Express using ES Modules and async/await.

## 🚀 Features
- RESTful endpoints for item management (Create, Read, Update, Delete)
- Modern ES6+ syntax with `import/export`
- Async/await for future database integration
- Centralized error handling and input validation

## 🧱 Folder Structure

```
.
├── controllers/
│   └── itemController.js
├── models/
│   └── itemModel.js
├── routes/
│   └── itemRoutes.js
├── services/
│   └── itemService.js
├── middlewares/
│   └── errorHandler.js
├── utils/
│   └── validator.js
├── index.js
├── package.json
└── README.md
```

## 📦 Installation

```bash
npm install
```

## ▶️ Run the API

```bash
npm start
```

## 📬 Endpoints

| Method | Endpoint      | Description             |
|--------|---------------|-------------------------|
| GET    | /items        | Get all items           |
| GET    | /items/:id    | Get item by ID          |
| POST   | /items        | Create a new item       |
| PUT    | /items/:id    | Update an existing item |
| DELETE | /items/:id    | Delete an item          |

## 🧪 Testing

Use Postman or import the included collection file `postman_collection.json` for testing all endpoints.

## 🔐 Notes

- In-memory storage only; no database required.
- Easily extendable to support persistent DBs like MongoDB or PostgreSQL.
