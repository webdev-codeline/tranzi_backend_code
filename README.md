# City Population Service

A Node.js service that provides an API for retrieving and updating city populations. This service is optimized for speed and efficiency, utilizing PostgreSQL for data persistence and Redis for caching. The service, database, and cache are containerized using Docker for easy deployment and scalability.

## Prerequisites

- Node.js v18 or later
- Docker and Docker Compose
- npm (comes with Node.js installation)

## Project Setup

### 1. Clone the Repository

Clone this repository to your local machine. Navigate to the project directory in the terminal.

```bash
git clone <repository-url>
cd <project-directory>
```


### 2. Install Dependencies

```bash
cd app
npm install
```

### 3. Build and Start the Docker Containers

Use Docker Compose to build the images and start the containers for the Node.js app, PostgreSQL, Redis, and Adminer.
```bash
docker-compose up --build
```

### 4. Run the Migration Script

After the Docker containers are up and running, execute the migration script to populate the PostgreSQL database with city population data.

```bash
cd app
node migrate.js
```

### 5. Access the Application

The Node.js application is now running, and you can access the API at:

```http://localhost:5555```

For database management, access Adminer at:

```http://localhost:8080```
