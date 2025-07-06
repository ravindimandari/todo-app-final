# To-Do Task Web Application

This repository contains a full-stack To-Do task web application built according to the requirements of the Senior Full Stack Engineer Take Home Assessment. The application allows users to create, view (most recent 5), and mark tasks as completed through a web UI.

The entire application stack is containerized using Docker and orchestrated with Docker Compose for easy setup and deployment.

## Table of Contents

1.  [Features](#features)
2.  [Architecture](#architecture)
3.  [Tech Stack](#tech-stack)
4.  [Prerequisites](#prerequisites)
5.  [Setup and Running Instructions](#setup-and-running-instructions)
    * [Clone the Repository](#clone-the-repository)
    * [Environment Variables](#environment-variables)
    * [Build and Run with Docker Compose](#build-and-run-with-docker-compose)
    * [Access the Application](#access-the-application)
    * [Stopping and Cleaning Up](#stopping-and-cleaning-up)
6.  [Database Schema](#database-schema)
7.  [Testing](#testing)

---

### 1. Features

* **Create Tasks:** Users can add new to-do tasks by providing a title and a description through the web UI.
* **List Recent Tasks:** Displays the 5 most recently added to-do tasks.
* **Mark as Completed:** Users can mark a task as completed using a "Done" button. Completed tasks are no longer visible in the UI.

### 2. Architecture

The system comprises three main components, each running in its own Docker container:

* **Database (DB):** Stores all to-do task data.
* **Backend API:** A RESTful API responsible for handling business logic and interacting with the database.
* **Frontend UI:** A Single Page Application (SPA) that provides the user interface and communicates with the Backend API.

```
+----------------+       +----------------+       +----------------+
|                |       |                |       |                |
|    Frontend    | ----> |     Backend    | ----> |     MySQL      |
|      (Node)    |       |    (Spring)    |       |    (Database)  |
|                |       |                |       |                |
+----------------+       +----------------+       +----------------+
      ^                          ^                          ^
      |                          |                          |
      |                          |                          |
    User (Browser)          Docker Network             Docker Network
```

### 3. Tech Stack

* **Database:** MySQL (Dockerized)
* **Backend:** Java 21, Spring Boot, Spring Data JPA
* **Frontend:** Node.js 22 (e.g., React, Vue, or vanilla JS), served via `npm start` (or `serve` for production build)
* **Containerization:** Docker, Docker Compose

### 4. Prerequisites

Before you begin, ensure you have the following installed on your system:

* **Git:** For cloning the repository.
    * [Download Git](https://git-scm.com/downloads)
* **Docker Desktop:** Includes Docker Engine and Docker Compose CLI.
    * [Download Docker Desktop](https://www.docker.com/products/docker-desktop/)

### 5. Setup and Running Instructions

Follow these steps to get the application up and running locally using Docker Compose.

#### Clone the Repository

First, clone this repository to your local machine:

```bash
git clone https://github.com/ravindimandari/todo-app-final
cd todo-app-final
```

(Replace `your-username` with your actual GitHub username)

#### Environment Variables

Create a `.env` file in the root directory of the project (where `docker-compose.yml` is located) and populate it with the necessary environment variables. This file is ignored by Git for security reasons.

```bash
cp .env.example .env
```

Now, open the newly created `.env` file and set the values:

```
# MySQL Database Credentials
MYSQL_ROOT_PASSWORD=root
MYSQL_USER=your_user # Replace with your desired MySQL user
MYSQL_PASSWORD=root
```

#### Build and Run with Docker Compose

Navigate to the root directory of the `todo-app-final` project (where `docker-compose.yml` is located) in your terminal.

This command will:

1.  Build the Docker images for your backend and frontend services (using their respective `Dockerfile`s).
2.  Create a Docker network for the services.
3.  Start the MySQL database container.
4.  Start the Spring Boot backend container, linking it to the MySQL database.
5.  Start the Node.js frontend container, linking it to the backend.

```bash
docker compose up --build -d
```

* `--build`: Ensures that the Docker images for backend and frontend are rebuilt, picking up any code changes.
* `-d`: Runs the containers in detached mode (in the background).

#### Verify Services are Running

You can check the status of all running containers:

```bash
docker compose ps
```

You should see `mysql-docker`, `product-app-container` (backend), and `frontend-app-container` listed with `Up` status.

#### Access the Application

Once all services are up and running, you can access the frontend application in your web browser:

```
http://localhost:3001
```

The frontend will communicate with the backend API, which is accessible internally within the Docker network via `http://backend:8080`.

#### Stopping and Cleaning Up

To stop all running services and remove their containers, networks, and volumes (database data will persist in the `db_data` volume):

```bash
docker compose down
```

If you want to remove the database data volume as well (for a completely fresh start, **this will delete all your data**):

```bash
docker compose down -v
```

### 6. Database Schema

The database contains a `task` table to store to-do items. The columns are designed to meet the application's requirements:

* `id` (Primary Key, Auto-increment)
* `title` (VARCHAR)
* `description` (VARCHAR)
* `completed` (BOOLEAN, default false)
* `created_at` (TIMESTAMP, default current timestamp)

*(You might want to replace this with your actual schema details or a simple diagram if you have one.)*

### 7. Testing

* **Backend Unit/Integration Tests:**
    The backend includes unit and integration tests to ensure the core API functionality and database interactions are working correctly.
    To run backend tests locally (outside Docker):

    ```bash
    cd backend
    ./gradlew test # Or `mvn test` if using Maven
    ```

* **Frontend Unit Tests:**
    
    ```bash
    cd frontend
    npm test
    ```

* **End-to-End Tests:**
    

