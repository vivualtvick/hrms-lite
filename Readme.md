# HRMS Lite - Human Resource Management System

A comprehensive, lightweight HR management solution designed to streamline employee record-keeping, departmental organization, and daily attendance tracking. This project features a robust Django REST backend and a high-performance React frontend.

**Live Application:** [https://hrms-lite-eosin-delta.vercel.app](https://hrms-lite-eosin-delta.vercel.app)  
**GitHub Repository:** [https://github.com/vivualtvick/hrms-lite](https://github.com/vivualtvick/hrms-lite)

---

## 🚀 Tech Stack

### Backend
* **Language/Framework:** Python & Django
* **Database:** PostgreSQL
* **Deployment:** [Railway](https://railway.app/)

### Frontend
* **Framework:** React.js (built with Vite)
* **Routing:** React Router
* **Deployment:** [Vercel](https://vercel.com/)

---

## ✨ Features

### 📊 Dashboard
* **Real-time Analytics:** View key metrics including Total Employees, Present/Absent counts, and Departmental distribution.
* **Quick Overview:** Displays a "Recently Added" list of the last 10 employees for easy access.

### 👥 Employee Management
* **Comprehensive CRUD:** Create, View, and Delete employee profiles.
* **Smart Search:** Filter employees by ID, Email, Name, or Date joined.
* **Detailed Profiles:** Access deep-dive views of employee information and their complete attendance history.

### 📅 Attendance System
* **Daily Monitoring:** View the current day's status at a glance.
* **Flexible Logs:** Add or modify attendance for any date (Status: Present, Absent, or On Leave).
* **History Management:** Modify or delete historical attendance records as needed.

### 🏢 Department Management
* **Organization:** Create and manage departments to categorize your workforce.
* **Data Integrity:** Delete departments when no longer needed.

### 🛠️ UX/UI & System Design
* **Global Loader:** Seamless transitions and visual feedback during data fetching.
* **Safety Protocols:** Dedicated modals for destructive events (deletions) to prevent accidents.
* **Intuitive UI:** Clean, modern design with quick-action modals for common tasks.
* **Robust Error Handling:** Professional feedback for network failures and form validations.

---

## 📂 Project Structure

```text
├── backend/        # Django project, API logic, and PostgreSQL configuration
|   ├── core
|   │   ├── asgi.py
|   │   ├── __init__.py
|   │   ├── __pycache__
|   │   ├── settings.py
|   │   ├── urls.py
|   │   └── wsgi.py
|   ├── docker-compose.local.yaml
|   ├── Dockerfile
|   ├── Dockerfile.local
|   ├── eather
|   │   ├── ...
|   ├── entrypoint.sh
|   ├── manage.py
|   ├── media
|   ├── requirements.txt
|    └── static
├── frontend/       # React + Vite source code, Components, and Assets
|   ├── dist
|   ├── eslint.config.js
|   ├── index.html
|   ├── node_modules
|   ├── package.json
|   ├── package-lock.json
|   ├── public
|   ├── README.md
|   ├── src
|   ├── tsconfig.app.json
|   ├── tsconfig.json
|   ├── tsconfig.node.json
|   └── vite.config.ts
└── README.md       # Project documentation
```

# 🚀 Deployment Guide: HRMS Lite

This guide outlines the step-by-step process for deploying the **HRMS Lite** application using Railway (Backend & Database) and Vercel (Frontend).

---

## 💻 Frontend Deployment (Vercel)
Vercel is optimized for Vite projects and offers seamless GitHub integration.

1. Project Import
   - Log in to Vercel and click Add New > Project.
   - Import your GitHub repository hrms-lite.
   
3. Framework Configuration
   - Under Project Settings, set the Framework Preset to Vite.
   - Set the Root Directory to frontend.

3. Environment Variables (Optional but Recommended)
   - frontend uses an API base URL variable (e.g., VITE_API_URL), we can leave it blank for now:
   - Key: VITE_API_URL
   - Value: https://your-railway-backend-url.up.railway.app

4. Deploy
   - Click Deploy.

Once finished, copy the provided .vercel.app URL.

## 🏗️ Backend & Database Deployment (Railway)

Railway handles both your PostgreSQL database and the Django application.

### 1. Project Setup
1. Create a free tier account on [Railway.app](https://railway.app/).
2. Create a **New Project**.
3. Click **Add Service** -> **Database** -> **Add PostgreSQL**.
4. Wait for the database to deploy.

### 2. Deploying the Django Service
1. Click **New** -> **GitHub Repo** -> Select your `hrms-lite` repository.
2. Once the service is created, go to **Service Settings** > **Source**.
3. Set the **Root Directory** to `backend`.

### 3. Networking & Build Configuration
1. **Domain:** Go to the **Settings** tab > **Networking** > Click **Generate Domain** (Save this URL for the frontend setup).
2. **Build Customization:**
   - Go to the **Settings** tab > **Build**.
   - Select **Docker** as the build interface.
   - Set the **Dockerfile Location** to `backend/Dockerfile`.

### 4. Environment Variables
Go to the **Variables** tab, click **Edit Raw**, and paste the following JSON/List (ensuring you replace the placeholder values with your actual Railway Database credentials and Vercel URL):

```env
DEBUG=True
DATABASE_URL=postgres://myuser:mypassword@db:5432/mydatabase
PGUSER=myuser
PGPASSWORD=mypassword
PGDATABASE=mydatabase
PGPORT=5432
PGHOST=db
FRONTEND_URL="[https://your-vercel-app-url.vercel.app](https://your-vercel-app-url.vercel.app)"
CSRF_TRUSTED_ORIGINS="[https://your-vercel-app-url.vercel.app](https://your-vercel-app-url.vercel.app)"
ALLOWED_HOSTS="your-railway-domain.up.railway.app"
SECRET_KEY="your-very-secure-random-secret-key"

# Database Specific Variable
POSTGRES_DB=mydatabase
```

🔄 Final Configuration & Redeployment
To ensure the Frontend and Backend communicate correctly, follow these final steps to link the two services.

1. Configure Frontend Environment Variables
   - Go to your Vercel Dashboard and select your project.
   - Navigate to Settings > Environment Variables.
   - Add a new variable:
   - Key: VITE_API_URL
   - Value: https://your-backend-service.up.railway.app (Your public Railway host).
   - Click Save.
   - Important: Go back to your Railway Backend Variables and update FRONTEND_URL, CSRF_TRUSTED_ORIGINS with this live URL.


2. Redeploy Frontend
   - Environment variables in Vite are injected at build time. To apply the change:
   - Go to the Deployments tab in Vercel.
   - Click the three dots ... on your latest deployment.
   - Select Redeploy (ensure "Use existing Build Cache" is unchecked for a clean build).

3. Sync Backend Settings (Railway)
   - Ensure your Backend allows requests from your new Vercel URL. Go to Railway > Variables and verify:
   - ALLOWED_HOSTS: Should include your Railway domain (e.g., api-production.up.railway.app).
   - CSRF_TRUSTED_ORIGINS: Must include your Vercel URL (e.g., https://hrms-lite.vercel.app).
   - FRONTEND_URL: Set to your Vercel production URL.

### 🔗 Deployment Data Flow
| Step | Action                      | Outcome                      |
|------|-----------------------------|------------------------------|
| 1    | User opens Vercel URL       | React App loads in browser   |
| 2    | React calls VITE_API_URL    | Request sent to Railway      |
| 3    | Django checks ALLOWED_HOSTS | Security validation passed   |
| 4    | Django queries PostgreSQL   | Data retrieved and sent back |

## 🛠️ Installation & Local Setup
### 1. Clone the repository
```bash
git clone [https://github.com/vivualtvick/hrms-lite.git](https://github.com/vivualtvick/hrms-lite.git)
cd hrms-lite`
```
### 2. Backend Setup
```
# Navigate to backend directory
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start with docker
sudo docker compose -f docker-compose.local up --build
sudo docker compose -f docker-compose.local.yaml exec backend-web python3 manage.py makemigrations
sudo docker compose -f docker-compose.local.yaml exec backend-web python3 manage.py migrate 
```
Backend wiil be available on: [http://localhost:8000](http://localhost:8000)

### 3. Frontend Setup
```
cd ../frontend

# Install dependencies
npm install

# Start development server
npm run dev
```
Frontend wiil be available on: [http://localhost:5173/](http://localhost:5173/)

## 🔗 Project Links
Repository: [vivualtvick/hrms-lite](https://github.com/vivualtvick/hrms-lite/main/)

Live App: [HRMS Lite on Vercel](https://hrms-lite-eosin-delta.vercel.app)

## 🛠️ Quick Troubleshooting
1. Connection & CORS
   - Vercel URL: Must be in CSRF_TRUSTED_ORIGINS (with https://) and ALLOWED_HOSTS (without https://) in Railway.
   - Vite Variables: Ensure your variable starts exactly with VITE_ (e.g., VITE_API_URL).
   - Redeploy: Vercel requires a redeploy after adding environment variables to inject them into the build.

2. Database & API
   - Migrations: If you see "Table not found," run python manage.py migrate in the Railway CMD/Shell.
   - Internal URL: Ensure DATABASE_URL matches the string in your Railway Postgres variables.
   - Debug Mode: If DEBUG=False, your ALLOWED_HOSTS must be 100% accurate or the site will return a 500 error.

3. Build Failures
   - Root Directory: Double-check Vercel is pointing to /frontend and Railway is pointing to /backend.
   - Case Sensitivity: Ensure your imports match your filenames exactly (e.g., App.jsx vs app.jsx).

Developed with ❤️ by developervick [Vivek Kustwar](https://linkedin.com/in/vivek-kustwar)






















