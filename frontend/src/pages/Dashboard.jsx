import { useEffect, useMemo, useState } from 'react'
import { CircleMarker, MapContainer, Popup, TileLayer, useMap } from 'react-leaflet'
import api from '../services/api'
import Spinner from '../components/Spinner'
import { getEmergencyIcon } from '../utils/emergencyIcons'
import { useAuth } from '../context/AuthContext'
import 'leaflet/dist/leaflet.css'

const STATUS_COLORS = {
  reported: 'bg-yellow-100 text-yellow-800',
  assigned: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-purple-100 text-purple-800',
  resolved: 'bg-green-100 text-green-800',
}

const SEVERITY_LEVELS = ['all', 'critical', 'high', 'medium', 'low']
const STATUS_OPTIONS = ['all', 'reported', 'assigned', 'in_progress', 'resolved']
const RESPONDERS = ['Amina N.', 'Eugene K.', 'Ruth M.', 'John S.', 'Sonia D.']
const ALERT_CHANNELS = ['SMS', 'Push', 'Email']
const KIGALI_CENTER = [-1.9441, 30.0619]

function DispatchMapLayer({ emergencies, selectedId, onSelect }) {
  const map = useMap()

  useEffect(() => {
    const coordinates = emergencies
      .filter((emergency) => emergency.latitude != null && emergency.longitude != null)
      .map((emergency) => [Number(emergency.latitude), Number(emergency.longitude)])

    if (coordinates.length > 1) {
      map.fitBounds(coordinates, { padding: [40, 40], maxZoom: 13 })
    } else if (coordinates.length === 1) {
      map.setView(coordinates[0], 13)
    }
  }, [emergencies, map])

  return emergencies.map((emergency) => {
    if (emergency.latitude == null || emergency.longitude == null) return null

    const isActive = selectedId === emergency.id
    return (
      <CircleMarker
        key={emergency.id}
        center={[Number(emergency.latitude), Number(emergency.longitude)]}
        radius={isActive ? 13 : 9}
        pathOptions={{
          color: '#ffffff',
          weight: isActive ? 4 : 2,
          fillColor: emergency.severity === 'critical' ? '#d94835' : emergency.severity === 'high' ? '#ed9c31' : emergency.severity === 'medium' ? '#4b87ce' : '#51a471',
          fillOpacity: isActive ? 1 : 0.9,
        }}
        eventHandlers={{ click: () => onSelect(emergency.id) }}
      >
        <Popup>
          <strong>{getEmergencyIcon(emergency.emergency_type)} {emergency.location}</strong><br />
          {emergency.description}
        </Popup>
      </CircleMarker>
    )
  })
}

export default function Dashboard() {
  const { user } = useAuth()
  const [emergencies, setEmergencies] = useState([])
  const [search, setSearch] = useState('')
  const [severity, setSeverity] = useState('all')
  const [status, setStatus] = useState('all')
  const [selectedId, setSelectedId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState(null)
  const [assignments, setAssignments] = useState({})
  const [alertChannels, setAlertChannels] = useState({})

  const isResponder = ['admin', 'ngo', 'volunteer'].includes(user?.role)

  const fetchEmergencies = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/emergencies/')
      setEmergencies(data.results ?? data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEmergencies()
  }, [])

  const visibleEmergencies = useMemo(() => {
    const relevantReports = isResponder
      ? emergencies
      : emergencies.filter((emergency) => String(emergency.reporter) === String(user?.id) || emergency.reporter_username === user?.username)

    return relevantReports.filter((emergency) => {
      const matchesSearch = !search || `${emergency.location} ${emergency.emergency_type} ${emergency.description}`.toLowerCase().includes(search.toLowerCase())
      const matchesSeverity = severity === 'all' || emergency.severity === severity
      const matchesStatus = status === 'all' || emergency.status === status
      return matchesSearch && matchesSeverity && matchesStatus
    })
  }, [emergencies, isResponder, search, severity, status, user])

  useEffect(() => {
    if (visibleEmergencies.length && !visibleEmergencies.some((emergency) => emergency.id === selectedId)) {
      setSelectedId(visibleEmergencies[0].id)
    }
  }, [selectedId, visibleEmergencies])

  const selectedEmergency = visibleEmergencies.find((emergency) => emergency.id === selectedId) ?? visibleEmergencies[0]

  const metrics = useMemo(() => {
    const active = emergencies.filter((emergency) => emergency.status !== 'resolved')
    return {
      total: active.length,
      critical: active.filter((emergency) => emergency.severity === 'critical').length,
      assigned: active.filter((emergency) => emergency.status === 'assigned' || emergency.status === 'in_progress').length,
      resolved: emergencies.filter((emergency) => emergency.status === 'resolved').length,
    }
  }, [emergencies])

  const updateStatus = async (id, nextStatus) => {
    setUpdatingId(id)
    try {
      await api.patch(`/emergencies/${id}/`, { status: nextStatus })
      await fetchEmergencies()
    } finally {
      setUpdatingId(null)
    }
  }

  const assignResponder = (incidentId, responder) => {
    setAssignments((current) => ({ ...current, [incidentId]: responder }))
    setSelectedId(incidentId)
    updateStatus(incidentId, 'assigned')
  }

  const toggleAlertChannel = (incidentId, channel) => {
    setAlertChannels((current) => ({
      ...current,
      [incidentId]: {
        ...(current[incidentId] ?? { SMS: true, Push: true, Email: true }),
        [channel]: !(current[incidentId]?.[channel] ?? true),
      },
    }))
  }

  if (!user) return null

  if (isResponder) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow">Dispatch center</p>
            <h1 className="section-title mb-2">Emergency response dashboard</h1>
            <p className="text-slate-600 dark:text-slate-300">Coordinate active incidents, assign teams, and alert the right responders.</p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 dark:border-red-900/70 dark:bg-red-950/40 dark:text-red-200">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
            Live dispatch active
          </div>
        </header>

        <section className="mb-8 grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <p className="text-sm text-slate-500 dark:text-slate-400">Open incidents</p>
            <p className="mt-3 text-3xl font-black text-slate-900 dark:text-white">{metrics.total}</p>
          </div>
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 shadow-sm dark:border-red-900/60 dark:bg-red-950/20">
            <p className="text-sm text-red-700 dark:text-red-200">Critical</p>
            <p className="mt-3 text-3xl font-black text-red-700 dark:text-red-200">{metrics.critical}</p>
          </div>
          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 shadow-sm dark:border-blue-900/60 dark:bg-blue-950/20">
            <p className="text-sm text-blue-700 dark:text-blue-200">Assigned</p>
            <p className="mt-3 text-3xl font-black text-blue-700 dark:text-blue-200">{metrics.assigned}</p>
          </div>
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm dark:border-emerald-900/60 dark:bg-emerald-950/20">
            <p className="text-sm text-emerald-700 dark:text-emerald-200">Resolved</p>
            <p className="mt-3 text-3xl font-black text-emerald-700 dark:text-emerald-200">{metrics.resolved}</p>
          </div>
        </section>

        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <label className="flex flex-1 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
              <span aria-hidden="true">⌕</span>
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search location, type or description" className="w-full border-0 bg-transparent text-sm outline-none placeholder:text-slate-400" />
            </label>

            <div className="flex flex-wrap gap-2">
              {SEVERITY_LEVELS.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setSeverity(option)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition ${severity === option ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'}`}
                >
                  {option === 'all' ? 'All severity' : option}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {STATUS_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setStatus(option)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition ${status === option ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'}`}
              >
                {option === 'all' ? 'All status' : option.replace('_', ' ')}
              </button>
            ))}
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-4">
            {loading && <Spinner />}
            {!loading && !visibleEmergencies.length && <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">No incidents match the current filters.</p>}
            {!loading && visibleEmergencies.map((emergency) => (
              <button
                key={emergency.id}
                type="button"
                onClick={() => setSelectedId(emergency.id)}
                className={`w-full rounded-2xl border bg-white p-5 text-left shadow-sm transition dark:bg-slate-900 ${selectedEmergency?.id === emergency.id ? 'border-red-300 ring-2 ring-red-200 dark:border-red-700 dark:ring-red-900/60' : 'border-slate-200 dark:border-slate-700'}`}
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex gap-4">
                    <span className={`flex h-12 w-12 items-center justify-center rounded-2xl text-lg ${emergency.severity === 'critical' ? 'bg-red-100 text-red-700' : emergency.severity === 'high' ? 'bg-orange-100 text-orange-700' : emergency.severity === 'medium' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      {getEmergencyIcon(emergency.emergency_type)}
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-xl font-bold capitalize text-slate-900 dark:text-white">{emergency.emergency_type}</h2>
                        <span className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${STATUS_COLORS[emergency.status] ?? 'bg-gray-100 text-gray-800'}`}>
                          {emergency.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="mt-1 font-semibold text-slate-700 dark:text-slate-200">{emergency.location}</p>
                      <p className="mt-2 max-w-xl text-sm text-slate-600 dark:text-slate-300">{emergency.description}</p>
                      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                        <span>Severity: <strong className="capitalize">{emergency.severity}</strong></span>
                        <span>Reporter: <strong>{emergency.reporter_username || 'Unknown'}</strong></span>
                        <span>{new Date(emergency.created_at).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-start gap-2 lg:items-end">
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-600 dark:bg-slate-800 dark:text-slate-200">
                      {assignments[emergency.id] || 'Unassigned'}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{emergency.status === 'resolved' ? 'Closed' : 'Awaiting response'}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <aside className="space-y-5">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <div className="border-b border-slate-200 p-4 dark:border-slate-700">
                <p className="eyebrow">Live map</p>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Incident coverage</h2>
              </div>
              <div className="h-72">
                <MapContainer center={KIGALI_CENTER} zoom={12} scrollWheelZoom className="h-full w-full" aria-label="Emergency map">
                  <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <DispatchMapLayer emergencies={visibleEmergencies} selectedId={selectedEmergency?.id ?? null} onSelect={setSelectedId} />
                </MapContainer>
              </div>
            </div>

            {selectedEmergency && (
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <p className="eyebrow">Selected incident</p>
                <div className="mt-2 flex items-start gap-3">
                  <span className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg ${selectedEmergency.severity === 'critical' ? 'bg-red-100 text-red-700' : selectedEmergency.severity === 'high' ? 'bg-orange-100 text-orange-700' : selectedEmergency.severity === 'medium' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>
                    {getEmergencyIcon(selectedEmergency.emergency_type)}
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{selectedEmergency.location}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300">{selectedEmergency.emergency_type} · {selectedEmergency.severity}</p>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                    Assign responder
                    <select
                      value={assignments[selectedEmergency.id] || ''}
                      onChange={(event) => assignResponder(selectedEmergency.id, event.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none dark:border-slate-700 dark:bg-slate-800"
                    >
                      <option value="">Select responder</option>
                      {RESPONDERS.map((responder) => (
                        <option key={responder} value={responder}>{responder}</option>
                      ))}
                    </select>
                  </label>

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Alert channels</p>
                    <div className="flex flex-wrap gap-2">
                      {ALERT_CHANNELS.map((channel) => {
                        const enabled = alertChannels[selectedEmergency.id]?.[channel] ?? true
                        return (
                          <button
                            key={channel}
                            type="button"
                            onClick={() => toggleAlertChannel(selectedEmergency.id, channel)}
                            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${enabled ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-200'}`}
                          >
                            {channel}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button type="button" onClick={() => updateStatus(selectedEmergency.id, 'assigned')} className="flex-1 rounded-xl bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50" disabled={updatingId === selectedEmergency.id}>
                      Assign
                    </button>
                    <button type="button" onClick={() => updateStatus(selectedEmergency.id, 'in_progress')} className="flex-1 rounded-xl bg-violet-600 px-3 py-2 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50" disabled={updatingId === selectedEmergency.id}>
                      In progress
                    </button>
                    <button type="button" onClick={() => updateStatus(selectedEmergency.id, 'resolved')} className="flex-1 rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50" disabled={updatingId === selectedEmergency.id}>
                      Resolve
                    </button>
                  </div>
                </div>
              </div>
            )}
          </aside>
        </section>
      </main>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="mb-4 text-2xl font-bold">My Emergency Reports</h1>
      <form onSubmit={(event) => { event.preventDefault(); fetchEmergencies(search) }} className="mb-6 flex gap-2">
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by description or location" className="flex-1 rounded border p-2" />
        <button type="submit" className="rounded bg-red-700 px-4 text-white">Search</button>
      </form>
      {loading && <Spinner />}
      {!loading && !visibleEmergencies.length && <p className="text-gray-500">No reports found.</p>}
      <ul className="space-y-3">
        {visibleEmergencies.map((emergency) => (
          <li key={emergency.id} className="rounded-lg border p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold capitalize">{getEmergencyIcon(emergency.emergency_type)} {emergency.emergency_type} — {emergency.location}</p>
                <p className="text-sm text-gray-600">{emergency.description}</p>
                <p className="mt-1 text-xs text-gray-400">{new Date(emergency.created_at).toLocaleString()}</p>
              </div>
              <span className={`rounded-full px-2 py-1 text-xs font-medium ${STATUS_COLORS[emergency.status] ?? 'bg-gray-100 text-gray-800'}`}>
                {emergency.status.replace('_', ' ')}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
