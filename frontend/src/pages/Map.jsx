import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CircleMarker, MapContainer, Popup, TileLayer, useMap } from 'react-leaflet'
import api from '../services/api'
import { getEmergencyIcon } from '../utils/emergencyIcons'
import 'leaflet/dist/leaflet.css'
import './Map.css'

const DEMO_EMERGENCIES = [
  { id: 'demo-1', emergency_type: 'fire', severity: 'critical', status: 'in_progress', location: 'Kigali Heights, KG 7 Ave', description: 'Smoke reported near the commercial district.', latitude: -1.9441, longitude: 30.0619, created_at: new Date(Date.now() - 18 * 60000).toISOString() },
  { id: 'demo-2', emergency_type: 'medical', severity: 'high', status: 'assigned', location: 'Remera Bus Terminal', description: 'Medical assistance requested at the terminal.', latitude: -1.9536, longitude: 30.104, created_at: new Date(Date.now() - 42 * 60000).toISOString() },
  { id: 'demo-3', emergency_type: 'flood', severity: 'medium', status: 'reported', location: 'Nyabugogo Wetland', description: 'Water levels are rising near the main road.', latitude: -1.9407, longitude: 30.0445, created_at: new Date(Date.now() - 77 * 60000).toISOString() },
  { id: 'demo-4', emergency_type: 'accident', severity: 'high', status: 'reported', location: 'KN 3 Rd, Kacyiru', description: 'Traffic collision slowing both lanes.', latitude: -1.9275, longitude: 30.0851, created_at: new Date(Date.now() - 105 * 60000).toISOString() },
]

const SEVERITIES = ['all', 'critical', 'high', 'medium', 'low']
const STATUS_LABELS = { reported: 'Reported', assigned: 'Assigned', in_progress: 'In progress', resolved: 'Resolved' }
const KIGALI_CENTER = [-1.9441, 30.0619]

function formatTime(date) {
  return new Intl.DateTimeFormat('en', { hour: 'numeric', minute: '2-digit' }).format(new Date(date))
}

function LeafletIncidentLayer({ emergencies, onSelect }) {
  const map = useMap()

  useEffect(() => {
    const coordinates = emergencies.filter((emergency) => emergency.latitude != null && emergency.longitude != null).map((emergency) => [Number(emergency.latitude), Number(emergency.longitude)])
    if (coordinates.length > 1) map.fitBounds(coordinates, { padding: [48, 48], maxZoom: 14 })
    else if (coordinates.length === 1) map.setView(coordinates[0], 14)
  }, [emergencies, map])

  return emergencies.map((emergency) => emergency.latitude != null && emergency.longitude != null && (
    <CircleMarker
      key={emergency.id}
      center={[Number(emergency.latitude), Number(emergency.longitude)]}
      pathOptions={{ color: '#ffffff', weight: 3, fillColor: emergency.severity === 'critical' ? '#d94835' : emergency.severity === 'high' ? '#ed9c31' : emergency.severity === 'medium' ? '#4b87ce' : '#51a471', fillOpacity: 1 }}
      radius={emergency.severity === 'critical' ? 12 : 9}
      eventHandlers={{ click: () => onSelect(emergency.id) }}
    >
      <Popup><strong>{getEmergencyIcon(emergency.emergency_type)} {emergency.location}</strong><br />{emergency.description}</Popup>
    </CircleMarker>
  ))
}

function LeafletControls() {
  const map = useMap()
  return <div className="map-controls"><button type="button" onClick={() => map.zoomIn()} aria-label="Zoom in">+</button><button type="button" onClick={() => map.zoomOut()} aria-label="Zoom out">−</button><button type="button" onClick={() => map.setView(KIGALI_CENTER, 13)} aria-label="Center map">⌖</button></div>
}

export default function Map() {
  const [emergencies, setEmergencies] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [severity, setSeverity] = useState('all')
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [usingDemo, setUsingDemo] = useState(false)

  const fetchEmergencies = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/emergencies/')
      const results = data.results ?? data
      setEmergencies(results.length ? results : DEMO_EMERGENCIES)
      setUsingDemo(!results.length)
    } catch {
      setEmergencies(DEMO_EMERGENCIES)
      setUsingDemo(true)
    } finally {
      setLoading(false)
    }
  }

  const filteredEmergencies = useMemo(() => emergencies.filter((emergency) => {
    const matchesSeverity = severity === 'all' || emergency.severity === severity
    const haystack = `${emergency.location} ${emergency.emergency_type} ${emergency.description}`.toLowerCase()
    return matchesSeverity && haystack.includes(query.toLowerCase())
  }), [emergencies, query, severity])

  useEffect(() => { fetchEmergencies() }, [])

  const selected = filteredEmergencies.find((emergency) => emergency.id === selectedId) ?? filteredEmergencies[0]
  const coordinateCount = filteredEmergencies.filter((emergency) => emergency.latitude != null && emergency.longitude != null).length

  return (
    <main className="map-page">
      <section className="map-header">
        <div>
          <p className="eyebrow">Community response network</p>
          <h1 className="map-title">Emergency map</h1>
          <p className="map-subtitle">See active reports around your community and understand where help may be needed most.</p>
        </div>
        <div className="map-header-actions">
          <span className="live-status"><span className="live-dot" />Live updates</span>
          <button type="button" onClick={fetchEmergencies} className="map-refresh" aria-label="Refresh emergency map">↻ <span>Refresh</span></button>
          <Link to="/report" className="primary-btn">Report emergency</Link>
        </div>
      </section>

      <section className="map-workspace" aria-label="Emergency locations">
        <aside className="incident-panel">
          <div className="incident-panel-top">
            <div>
              <p className="panel-kicker">Reports nearby</p>
              <h2>{filteredEmergencies.length} incidents</h2>
            </div>
            <span className="incident-count">{coordinateCount} mapped</span>
          </div>
          <label className="map-search">
            <span aria-hidden="true">⌕</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search location or type" aria-label="Search incidents" />
          </label>
          <div className="severity-tabs" role="group" aria-label="Filter by severity">
            {SEVERITIES.map((option) => <button key={option} type="button" className={severity === option ? 'active' : ''} onClick={() => setSeverity(option)}>{option === 'all' ? 'All' : option}</button>)}
          </div>
          <div className="incident-list">
            {loading && <p className="empty-state">Loading current reports...</p>}
            {!loading && !filteredEmergencies.length && <p className="empty-state">No reports match these filters.</p>}
            {!loading && filteredEmergencies.map((emergency) => (
              <button type="button" key={emergency.id} className={`incident-item ${selected?.id === emergency.id ? 'selected' : ''}`} onClick={() => setSelectedId(emergency.id)}>
                <span className={`incident-icon severity-${emergency.severity}`}>{getEmergencyIcon(emergency.emergency_type)}</span>
                <span className="incident-copy"><strong>{emergency.location}</strong><span>{emergency.emergency_type} · {formatTime(emergency.created_at)}</span></span>
                <span className={`status-marker status-${emergency.status}`} aria-label={STATUS_LABELS[emergency.status] || emergency.status} />
              </button>
            ))}
          </div>
          <div className="map-legend"><span className="panel-kicker">Severity</span><span><i className="legend-dot critical" />Critical</span><span><i className="legend-dot high" />High</span><span><i className="legend-dot medium" />Medium</span></div>
        </aside>

        <div className="map-canvas">
          <MapContainer center={KIGALI_CENTER} zoom={13} scrollWheelZoom className="leaflet-map" aria-label="OpenStreetMap showing emergency locations">
            <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LeafletIncidentLayer emergencies={filteredEmergencies} onSelect={setSelectedId} />
            <LeafletControls />
          </MapContainer>
          <div className="map-attribution">SafeSphere community reports · Kigali area</div>
        </div>
      </section>
      {usingDemo && <p className="demo-note">Showing sample locations while live reports connect. Reported locations will appear here as coordinates become available.</p>}
    </main>
  )
}
