# Full Stack Project with Node.js Backend and Next.js Frontend

## Description

This project is a full stack application that uses Node.js for the backend and Next.js for the frontend. The backend is responsible for managing the application logic, while the frontend is responsible for the user interface. The database used is PostgreSQL.

**Complete material available at:** https://repositorio.ufpe.br/handle/123456789/52785?locale=pt_BR

## Requirements

- Node.js
- Docker and Docker Compose
- PostgreSQL

## Project Structure

- `backend/`: Contains the Node.js server source code.
- `frontend/`: Contains the Next.js client source code.
- `docker-compose.yml`: File for Docker services orchestration.

## How to Run

### Backend

1. Navigate to the `backend/` directory.
2. Install dependencies with `npm install`.
3. To run the server, use `npm start`.

Or, using Docker:

```bash
docker-compose up
```

### Frontend

1. Navigate to the `frontend/` directory.
2. Install dependencies with `npm install`.
3. To run the server, use `npm run dev`.

### Docker Compose

To start all services (backend, frontend and PostgreSQL):

```bash
docker-compose up
```

## Technologies Used

### Backend

- **Node.js**: Runtime environment for JavaScript.
- **Express**: Framework for web applications.
- **Prisma**: ORM for PostgreSQL.
- **JWT**: Token-based authentication.
- **bcrypt**: Password hashing.
- **Jest**: Testing framework.

#### Backend NPM Scripts

- `npm start`: Starts the application in production mode.
- `npm run dev`: Starts the application in development mode with Nodemon.
- `npm test`: Runs tests with Jest.

### Frontend

- **Next.js**: React framework for SSR (Server Side Rendering).
- **React**: Library for building user interfaces.
- **Tailwind CSS**: Utility-first CSS framework.

---

**For complete documentation and additional resources, visit:** https://repositorio.ufpe.br/handle/123456789/52785?locale=pt_BR