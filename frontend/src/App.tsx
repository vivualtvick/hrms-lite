import './App.css'
import { Toaster } from 'react-hot-toast' // Ensure curly braces
import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/layout'
import Dashboard from './components/routes/Dashboard'
import Employees from './components/routes/Employees'
import Attendance from './components/routes/Attendance'
import Departments from './components/routes/Departments'

function App() {
  return (
    <>
      {/* Note: Toaster should be self-closing. 
        If 'style' still errors, cast it using 'as React.CSSProperties'
      */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            fontSize: '14px',
            borderRadius: '10px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
            background: '#fff',
            color: '#333',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="employees" element={<Employees />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="departments" element={<Departments />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </>
  )
}

export default App