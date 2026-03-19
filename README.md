# IDATT2105 Full-stack application development

This was every assignment for this course. Had fun! won't do it again thoooo..


## Getting Started

### Start with Docker

1. Build and start all services:

   ```sh
   docker compose up --build
   ```

   This will start the backend, frontend, and JSON server.

2. Access the applications:
   - Frontend: http://localhost:8080
   - Backend API: http://localhost:8081
   - H2 Database Console: http://localhost:8081/h2-console
     - JDBC URL: `jdbc:h2:file:/data/calculatordb;AUTO_SERVER=TRUE`
     - User Name: `sa`
     - Password: (leave empty)
   - Feedback API (JSON server): http://localhost:3001/feedback

3. To stop all services:
   ```sh
   docker compose down
   ```

---

### Start without Docker (Locally)

#### Backend

1. Open a terminal in `calculator-backend/calculator-backend`.

2. Build and run with Maven Wrapper:
   - On Windows (PowerShell or CMD):
     ```sh
       .\mvnw.cmd spring-boot:run
     ```
   - From repository root on Windows (without changing directory):
     ```sh
     .\calculator-backend\calculator-backend\mvnw.cmd -f .\calculator-backend\calculator-backend\pom.xml spring-boot:run
     ```
   - On Unix/macOS (bash/zsh):

     ```sh
     ./mvnw spring-boot:run
     ```

   - The backend will be available at http://localhost:8081
   - H2 Console: http://localhost:8081/h2-console

#### Frontend

1. Open a terminal in `vue-calculator`.
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:

   ```sh
   npm run serve
   ```

   - The frontend will be available at http://localhost:8080

#### JSON Server (Feedback API)

1. Open a terminal in `vue-calculator`.
2. Start the JSON server:

   ```sh
   npx json-server db.json --port 3001
   ```

   - The feedback API will be available at http://localhost:3001/feedback
