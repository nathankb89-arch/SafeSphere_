import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <nav className="flex items-center justify-between bg-red-700 px-6 py-4 text-white shadow">
      <Link to="/" className="text-xl font-bold">SafeSphere</Link>
      <div className="flex items-center gap-4">
        <Link to="/report" className="font-semibold hover:underline">Report Emergency</Link>
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
