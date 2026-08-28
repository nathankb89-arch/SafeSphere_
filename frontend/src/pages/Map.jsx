import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import { getEmergencyIcon } from '../utils/emergencyIcons'
import './Map.css'

const DEMO_EMERGENCIES = [
  { id: 'demo-1', emergency_type: 'fire', severity: 'critical', status: 'in_progress', location: 'Kigali Heights, KG 7 Ave', description: 'Smoke reported near the commercial district.', latitude: -1.9441, longitude: 30.0619, created_at: new Date(Date.now() - 18 * 60000).toISOString() },
  { id: 'demo-2', emergency_type: 'medical', severity: 'high', status: 'assigned', location: 'Remera Bus Terminal', description: 'Medical assistance requested at the terminal.', latitude: -1.9536, longitude: 30.104, created_at: new Date(Date.now() - 42 * 60000).toISOString() },
  { id: 'demo-3', emergency_type: 'flood', severity: 'medium', status: 'reported', location: 'Nyabugogo Wetland', description: 'Water levels are rising near the main road.', latitude: -1.9407, longitude: 30.0445, created_at: new Date(Date.now() - 77 * 60000).toISOString() },
  { id: 'demo-4', emergency_type: 'accident', severity: 'high', status: 'reported', location: 'KN 3 Rd, Kacyiru', description: 'Traffic collision slowing both lanes.', latitude: -1.9275, longitude: 30.0851, created_at: new Date(Date.now() - 105 * 60000).toISOString() },
]

const SEVERITIES = ['all', 'critical', 'high', 'medium', 'low']
const STATUS_LABELS = { reported: 'Reported', assigned: 'Assigned', in_progress: 'In progress', resolved: 'Resolved' }

function formatTime(date) {
  return new Intl.DateTimeFormat('en', { hour: 'numeric', minute: '2-digit' }).format(new Date(date))
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

  useEffect(() => { fetchEmergencies() }, [])

  const filteredEmergencies = useMemo(() => emergencies.filter((emergency) => {
    const matchesSeverity = severity === 'all' || emergency.severity === severity
    const haystack = `${emergency.location} ${emergency.emergency_type} ${emergency.description}`.toLowerCase()
    return matchesSeverity && haystack.includes(query.toLowerCase())
  }), [emergencies, query, severity])

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
          <div className="map-topo topo-one" /><div className="map-topo topo-two" /><div className="map-road road-one" /><div className="map-road road-two" /><div className="map-road road-three" />
          <div className="map-label label-north">KIGALI NORTH</div><div className="map-label label-center">CITY CENTER</div><div className="map-label label-east">REmera</div><div className="map-label label-south">NYABUGOGO</div>
          {filteredEmergencies.map((emergency, index) => {
            const hasCoordinates = emergency.latitude != null && emergency.longitude != null
            const positions = [{ top: '34%', left: '49%' }, { top: '48%', left: '72%' }, { top: '62%', left: '29%' }, { top: '25%', left: '67%' }]
            return hasCoordinates && <button type="button" key={emergency.id} className={`map-pin pin-${emergency.severity} ${selected?.id === emergency.id ? 'active' : ''}`} style={positions[index % positions.length]} onClick={() => setSelectedId(emergency.id)} aria-label={`View ${emergency.emergency_type} at ${emergency.location}`}><span>{getEmergencyIcon(emergency.emergency_type)}</span></button>
          })}
          <div className="map-controls"><button type="button" aria-label="Zoom in">+</button><button type="button" aria-label="Zoom out">−</button><button type="button" aria-label="Center map">⌖</button></div>
          {selected && <article className="map-detail"><div className="detail-heading"><span className={`incident-icon severity-${selected.severity}`}>{getEmergencyIcon(selected.emergency_type)}</span><div><p className="panel-kicker">{selected.emergency_type}</p><h3>{selected.location}</h3></div><button type="button" onClick={() => setSelectedId(null)} aria-label="Close incident details">×</button></div><p>{selected.description}</p><div className="detail-meta"><span className={`status-badge status-${selected.status}`}>{STATUS_LABELS[selected.status] || selected.status}</span><span>Updated {formatTime(selected.updated_at || selected.created_at)}</span></div></article>}
          <div className="map-attribution">SafeSphere community reports · Kigali area</div>
        </div>
      </section>
      {usingDemo && <p className="demo-note">Showing sample locations while live reports connect. Reported locations will appear here as coordinates become available.</p>}
    </main>
  )
}
