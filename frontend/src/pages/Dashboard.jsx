import { useEffect, useState } from 'react'
import api from '../services/api'
import Spinner from '../components/Spinner'
import { getEmergencyIcon } from '../utils/emergencyIcons'

const STATUS_COLORS = { reported: 'bg-yellow-100 text-yellow-800', assigned: 'bg-blue-100 text-blue-800', in_progress: 'bg-purple-100 text-purple-800', resolved: 'bg-green-100 text-green-800' }

export default function Dashboard() {
  const [emergencies, setEmergencies] = useState([]); const [search, setSearch] = useState(''); const [loading, setLoading] = useState(true)
  const fetchEmergencies = async (query = '') => {
    setLoading(true)
    try { const { data } = await api.get(`/emergencies/${query ? `?search=${encodeURIComponent(query)}` : ''}`); setEmergencies(data.results ?? data) } finally { setLoading(false) }
    }
  useEffect(() => { fetchEmergencies() }, [])
  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="mb-4 text-2xl font-bold">My Emergency Reports</h1>
      <form onSubmit={(event) => { event.preventDefault(); fetchEmergencies(search) }} className="mb-6 flex gap-2"><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by description or location" className="flex-1 rounded border p-2" /><button type="submit" className="rounded bg-red-700 px-4 text-white">Search</button></form>
      {loading && <Spinner />}{!loading && emergencies.length === 0 && <p className="text-gray-500">No reports found.</p>}
      <ul className="space-y-3">{emergencies.map((emergency) => <li key={emergency.id} className="rounded-lg border p-4"><div className="flex items-start justify-between"><div><p className="font-semibold capitalize">{getEmergencyIcon(emergency.emergency_type)} {emergency.emergency_type} — {emergency.location}</p><p className="text-sm text-gray-600">{emergency.description}</p><p className="mt-1 text-xs text-gray-400">{new Date(emergency.created_at).toLocaleString()}</p></div><span className={`rounded-full px-2 py-1 text-xs font-medium ${STATUS_COLORS[emergency.status] ?? 'bg-gray-100 text-gray-800'}`}>{emergency.status.replace('_', ' ')}</span></div></li>)}</ul>
    </div>
  )
}
