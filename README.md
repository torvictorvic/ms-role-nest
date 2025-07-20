# ms-role-nest – Roles & Permissions Microservice

A **serverless-ready**, fully‑typed microservice for managing **Roles** and **Permissions**.  
Built with **NestJS 10**, **MongoDB**, and the **Serverless Framework** for effortless deployment to **AWS Lambda & API Gateway**.

---

## Key Features
- **CRUD** operations for roles and permissions (single & bulk).
- **Pagination + search** out‑of‑the‑box.
- Clean, modular **NestJS** architecture (controllers · services · repositories · DTOs).
- **MongoDB** data access via internal `@localrepo/lib_data_access_mongodb`.
- Ready for **AWS Lambda** thanks to `@codegenie/serverless-express`.
- Infrastructure as Code with **serverless.yml** (deploy to any stage).
- **Unit tests & coverage** with Jest.
- **ESLint + Prettier** configured for consistent code style.
- Seamless **AWS CodeArtifact** login (`npm run co:login`).

---

## API Reference

### Roles
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/role-permission/roles/list-all` | List every role |
| `GET`  | `/role-permission/roles/paginate?from=0&size=10&word=<search>` | Paginated list |
| `GET`  | `/role-permission/roles/get?id=<id>` | Retrieve one role |
| `POST` | `/role-permission/roles/create` | Create role |
| `PUT`  | `/role-permission/roles/update?id=<id>` | Update role |
| `DELETE`| `/role-permission/roles/delete?id=<id>` | Delete role |

### Permissions
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/role-permission/permissions/list-all` | List every permission |
| `GET`  | `/role-permission/permissions/paginate?from=0&size=10&word=<search>` | Paginated list |
| `GET`  | `/role-permission/permissions/get?id=<id>` | Retrieve one permission |
| `POST` | `/role-permission/permissions/create` | Create permission |
| `POST` | `/role-permission/permissions/multi` | Bulk create permissions |
| `PUT`  | `/role-permission/permissions/update?id=<id>` | Update permission |
| `DELETE`| `/role-permission/permissions/delete?id=<id>` | Delete permission |

---

## Project Structure
```text
src/
 ├── commons/        # Shared helpers and constants
 ├── config/         # Environment & service configuration
 ├── decorators/     # Custom parameter/route decorators
 ├── filters/        # Global exception filters
 ├── middleware/     # Request/response middlewares
 ├── permissions/    # Permissions module (CRUD, DTOs, repos)
 ├── roles/          # Roles module (CRUD, DTOs, repos)
 ├── utils/          # Generic utilities
 ├── app.module.ts   # Root NestJS module
 └── main.ts         # Lambda bootstrap
```

---

## ⚙️ Prerequisites
| Tool | Minimum version |
|------|-----------------|
| Node.js | **18.20.4** |
| npm     | **10.7.0** |
| AWS CLI | 2.x (configured credentials & default region) |

---

## Getting Started

```bash
# 1) Clone the repository
git clone https://github.com/torvictorvic/ms-role-nest
cd ms-role-nest

# 2) (Once) authenticate to AWS CodeArtifact
npm run co:login

# 3) Install dependencies
npm install

# 4) Build the project
npm run build
```

### Local development (Lambda emulator)

```bash
# Start Serverless Offline + live‑reload
npm run dev
```
`serverless-offline` will expose the REST API on **http://localhost:3000** (port configurable).

### Running Tests

```bash
# Unit tests
npm run test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

### Deployment

```bash
# Deploy to AWS (default stage: dev)
npx serverless deploy

# Deploy to a specific stage/region
npx serverless deploy --stage prod --region us-east-1
```

---

## Environment Variables

Create a `.env` (never commit it) or use AWS Secrets Manager.  
Essential variables:

| Name | Example | Purpose |
|------|---------|---------|
| `MONGO_URI` | `mongodb://user:pass@cluster0/example` | MongoDB connection |
| `ELASTICSEARCH_ENDPOINT` | `https://search-domain.es.amazonaws.com` | Optional search index |
| `NODE_ENV` | `development` | Runtime environment |

---

## Contributing

1. Fork the repo  
2. Create a branch: `git checkout -b feature/amazing-feature`  
3. Commit your changes: `git commit -m "feat: add amazing feature"`  
4. Push to your branch: `git push origin feature/amazing-feature`  
5. Open a Pull Request  

Please run **ESLint** and **Prettier** before submitting.

---

## License
Distributed under the **MIT License**. See `LICENSE` for more information.
