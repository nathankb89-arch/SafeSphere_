import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './routes/ProtectedRoute'
import Navbar from './components/Navbar'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import ReportEmergency from './pages/ReportEmergency'
import Dashboard from './pages/Dashboard'
import About from './pages/About'
import Footer from './components/Footer'
import HowItWorks from './pages/HowItWorks'
import FAQ from './pages/FAQ'
import SafetyTips from './pages/SafetyTips'
import EmergencyEducation from './pages/EmergencyEducation'
import Profile from './pages/Profile'
import Professionals from './pages/Professionals'
import FirstAid from './pages/FirstAid'
import Map from './pages/Map'
import ResponderManagement from './pages/ResponderManagement'
import CommandCenter from './pages/CommandCenter'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/report" element={<ReportEmergency />} />
          <Route path="/map" element={<Map />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/command-center" element={<ProtectedRoute><CommandCenter /></ProtectedRoute>} />
          <Route path="/responder-management" element={<ProtectedRoute><ResponderManagement /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/about" element={<About />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/safety-tips" element={<SafetyTips />} />
          <Route path="/education" element={<EmergencyEducation />} />
          <Route path="/first-aid" element={<FirstAid />} />
          <Route path="/professionals" element={<Professionals />} />
        </Routes>
        <Footer />
      </AuthProvider>
    </BrowserRouter>
  )
}
