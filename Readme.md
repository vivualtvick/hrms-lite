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
├── frontend/       # React + Vite source code, Components, and Assets
└── README.md       # Project documentation
```

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

Developed with ❤️ by developervick















