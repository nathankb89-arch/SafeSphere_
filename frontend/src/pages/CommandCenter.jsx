import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CircleMarker, MapContainer, Popup, TileLayer, useMap } from 'react-leaflet'
import api from '../services/api'
import { getEmergencyIcon } from '../utils/emergencyIcons'
import 'leaflet/dist/leaflet.css'
import './CommandCenter.css'

const KIGALI_CENTER = [-1.9441, 30.0619]
const DEMO_INCIDENTS = [
  { id: 'demo-1', emergency_type: 'medical', severity: 'critical', status: 'reported', location: 'Kigali Heights, KG 7 Ave', description: 'Unresponsive person reported near the main entrance.', latitude: -1.9441, longitude: 30.0619, created_at: new Date(Date.now() - 2 * 60000).toISOString() },
  { id: 'demo-2', emergency_type: 'fire', severity: 'high', status: 'in_progress', location: 'Building 3, Kacyiru', description: 'Smoke reported near the commercial district.', latitude: -1.9275, longitude: 30.0851, created_at: new Date(Date.now() - 15 * 60000).toISOString() },
  { id: 'demo-3', emergency_type: 'accident', severity: 'medium', status: 'assigned', location: 'KN 3 Rd, Remera', description: 'Traffic collision slowing both lanes.', latitude: -1.9536, longitude: 30.104, created_at: new Date(Date.now() - 28 * 60000).toISOString() },
  { id: 'demo-4', emergency_type: 'flood', severity: 'low', status: 'reported', location: 'Nyabugogo Wetland', description: 'Water levels are rising near the main road.', latitude: -1.9407, longitude: 30.0445, created_at: new Date(Date.now() - 42 * 60000).toISOString() },
]

const RESPONDERS = ['Amina N.', 'Eugene K.', 'Ruth M.', 'John S.']
const SEVERITIES = ['all', 'critical', 'high', 'medium', 'low']
const severityClass = (severity) => `severity-${severity || 'low'}`
const formatAge = (date) => {
  const minutes = Math.max(1, Math.round((Date.now() - new Date(date).getTime()) / 60000))
  return minutes < 60 ? `${minutes}m ago` : `${Math.round(minutes / 60)}h ago`
}

function IncidentMarkers({ incidents, selectedId, onSelect }) {
  const map = useMap()

  useEffect(() => {
    const coordinates = incidents.filter((incident) => incident.latitude != null && incident.longitude != null).map((incident) => [Number(incident.latitude), Number(incident.longitude)])
    if (coordinates.length > 1) map.fitBounds(coordinates, { padding: [32, 32], maxZoom: 13 })
  }, [incidents, map])

  return incidents.map((incident) => incident.latitude != null && incident.longitude != null && (
    <CircleMarker
      key={incident.id}
      center={[Number(incident.latitude), Number(incident.longitude)]}
      radius={selectedId === incident.id ? 14 : 9}
      pathOptions={{ color: '#fff', weight: selectedId === incident.id ? 4 : 2, fillColor: incident.severity === 'critical' ? '#e5484d' : incident.severity === 'high' ? '#e09f3e' : incident.severity === 'medium' ? '#3f7cac' : '#48966b', fillOpacity: 0.95 }}
      eventHandlers={{ click: () => onSelect(incident.id) }}
    >
      <Popup><strong>{getEmergencyIcon(incident.emergency_type)} {incident.location}</strong><br />{incident.description}</Popup>
    </CircleMarker>
  ))
}

export default function CommandCenter() {
  const [incidents, setIncidents] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [query, setQuery] = useState('')
  const [severity, setSeverity] = useState('all')
  const [loading, setLoading] = useState(true)
  const [demoMode, setDemoMode] = useState(false)
  const [radarOn, setRadarOn] = useState(true)
  const [assignments, setAssignments] = useState({})
  const [notice, setNotice] = useState('')

  const fetchIncidents = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/emergencies/')
      const results = data.results ?? data
      setIncidents(results.length ? results : DEMO_INCIDENTS)
      setDemoMode(!results.length)
    } catch {
      setIncidents(DEMO_INCIDENTS)
      setDemoMode(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchIncidents() }, [])

  const visibleIncidents = useMemo(() => incidents.filter((incident) => {
    const matchesSeverity = severity === 'all' || incident.severity === severity
    const haystack = `${incident.location} ${incident.emergency_type} ${incident.description}`.toLowerCase()
    return matchesSeverity && haystack.includes(query.toLowerCase())
  }), [incidents, query, severity])

  const selected = visibleIncidents.find((incident) => incident.id === selectedId) ?? visibleIncidents[0]
  const activeCount = incidents.filter((incident) => incident.status !== 'resolved').length
  const respondingCount = incidents.filter((incident) => incident.status === 'assigned' || incident.status === 'in_progress').length

  useEffect(() => {
    if (selected && selected.id !== selectedId) setSelectedId(selected.id)
  }, [selected, selectedId])

  const updateStatus = async (status) => {
    if (!selected || String(selected.id).startsWith('demo-')) {
      setNotice(`Demo incident marked ${status.replace('_', ' ')}.`)
      return
    }
    await api.patch(`/emergencies/${selected.id}/`, { status })
    setNotice(`Incident updated to ${status.replace('_', ' ')}.`)
    fetchIncidents()
  }

  const assignResponder = async (responder) => {
    if (!selected) return
    setAssignments((current) => ({ ...current, [selected.id]: responder }))
    await updateStatus('assigned')
  }

  return (
    <main className="command-center">
      <header className="command-header">
        <div>
          <p className="command-kicker">SafeSphere / Operations</p>
          <h1>Emergency command center</h1>
          <p className="command-subtitle">Monitor reports, coordinate responders, and keep a clear view of what needs attention.</p>
        </div>
        <div className="command-actions">
          <span className="live-status"><span className="live-dot" />Live link</span>
          <button type="button" className="icon-action" onClick={fetchIncidents} aria-label="Refresh incidents" title="Refresh incidents">↻</button>
          <Link to="/report" className="command-primary">Report emergency</Link>
        </div>
      </header>

      <section className="command-metrics" aria-label="Incident overview">
        <div className="metric-card metric-critical"><span>Active incidents</span><strong>{activeCount}</strong><small>Current reports</small></div>
        <div className="metric-card metric-response"><span>Responding</span><strong>{respondingCount}</strong><small>Assigned or in progress</small></div>
        <div className="metric-card"><span>Mapped now</span><strong>{visibleIncidents.filter((incident) => incident.latitude != null).length}</strong><small>With location data</small></div>
        <div className="metric-card"><span>Coverage</span><strong>94%</strong><small>Responder availability</small></div>
      </section>

      <section className="command-grid">
        <aside className="incident-rail">
          <div className="rail-heading"><div><p className="command-kicker">Priority queue</p><h2>Active incidents <span>{visibleIncidents.length}</span></h2></div><button type="button" className="filter-button" onClick={() => setSeverity('all')} aria-label="Clear filters" title="Clear filters">⌕</button></div>
          <label className="command-search"><span aria-hidden="true">⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search incidents" aria-label="Search incidents" /></label>
          <div className="filter-pills" role="group" aria-label="Filter incidents by severity">{SEVERITIES.map((option) => <button type="button" key={option} className={severity === option ? 'active' : ''} onClick={() => setSeverity(option)}>{option === 'all' ? 'All' : option}</button>)}</div>
          <div className="incident-list">
            {loading && <p className="empty-state">Connecting to live reports...</p>}
            {!loading && !visibleIncidents.length && <p className="empty-state">No incidents match these filters.</p>}
            {!loading && visibleIncidents.map((incident) => <button type="button" key={incident.id} className={`incident-row ${selected?.id === incident.id ? 'selected' : ''}`} onClick={() => setSelectedId(incident.id)}><span className={`incident-symbol ${severityClass(incident.severity)}`}>{getEmergencyIcon(incident.emergency_type)}</span><span className="incident-copy"><strong>{incident.emergency_type}</strong><span>{incident.location}</span></span><span className={`incident-severity ${severityClass(incident.severity)}`}>{incident.severity}</span></button>)}
          </div>
          {demoMode && <p className="demo-note">Sample locations shown while live reports connect.</p>}
        </aside>

        <div className="map-panel">
          <div className={`map-radar ${radarOn ? 'is-on' : ''}`} aria-hidden="true" />
          <MapContainer center={KIGALI_CENTER} zoom={12} scrollWheelZoom className="command-map" aria-label="Live emergency map">
            <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <IncidentMarkers incidents={visibleIncidents} selectedId={selected?.id} onSelect={setSelectedId} />
          </MapContainer>
          <div className="map-topline"><span className="live-dot" />Radar scanning · Kigali area</div>
          <button type="button" className={`radar-toggle ${radarOn ? 'active' : ''}`} onClick={() => setRadarOn((value) => !value)}>{radarOn ? 'Radar on' : 'Radar off'}</button>
        </div>

        <aside className="detail-panel">
          {selected ? <>
            <div className="detail-title"><span className={`detail-symbol ${severityClass(selected.severity)}`}>{getEmergencyIcon(selected.emergency_type)}</span><div><p className="command-kicker">Selected report</p><h2>{selected.emergency_type}</h2><span className={`status-badge ${severityClass(selected.severity)}`}>{selected.severity} priority</span></div></div>
            <div className="detail-fields"><div><span>Location</span><strong>{selected.location}</strong></div><div><span>Reported</span><strong>{formatAge(selected.created_at)}</strong></div><div><span>Notes</span><strong>{selected.description}</strong></div></div>
            <label className="assignment-field"><span>Assign responder</span><select value={assignments[selected.id] || ''} onChange={(event) => assignResponder(event.target.value)}><option value="">Choose a unit</option>{RESPONDERS.map((responder) => <option key={responder} value={responder}>{responder}</option>)}</select></label>
            <div className="detail-actions"><button type="button" onClick={() => updateStatus('in_progress')}>In progress</button><button type="button" className="resolve" onClick={() => updateStatus('resolved')}>Resolve</button></div>
            {notice && <p className="command-notice" role="status">{notice}</p>}
          </> : <p className="empty-state">Select an incident to see details.</p>}
        </aside>
      </section>
    </main>
  )
}
