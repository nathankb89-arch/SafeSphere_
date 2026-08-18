import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AccessibilityToggle from './AccessibilityToggle'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <nav className="flex flex-wrap items-center justify-between gap-3 bg-red-700 px-6 py-4 text-white shadow">
      <Link to="/" className="text-xl font-bold">SafeSphere</Link>
      <div className="flex flex-wrap items-center gap-4">
        <AccessibilityToggle />
        <Link to="/report" className="font-semibold hover:underline">Report Emergency</Link>
        <Link to="/about" className="hover:underline">About</Link>
        <Link to="/how-it-works" className="hover:underline">How It Works</Link>
        <Link to="/safety-tips" className="hover:underline">Safety Tips</Link>
        <Link to="/faq" className="hover:underline">FAQ</Link>
        {user ? (
          <>
            <Link to="/dashboard" className="hover:underline">Dashboard</Link>
            <span className="text-sm opacity-80">Hi, {user.username}</span>
            <button onClick={() => { logout(); navigate('/') }} className="rounded bg-white px-3 py-1 font-medium text-red-700">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline">Login</Link>
            <Link to="/register" className="rounded bg-white px-3 py-1 font-medium text-red-700">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  )
}
