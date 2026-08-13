import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

export default function Landing() {
  const [hotlines, setHotlines] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/safety/')
      .then((res) => setHotlines(res.data.results ?? res.data))
      .catch(() => setHotlines([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <section className="mb-10 text-center">
        <h1 className="mb-2 text-3xl font-bold">Protecting Communities Through Smart Emergency Response</h1>
        <p className="mb-6 text-gray-600">Report an emergency instantly — no account required.</p>
        <Link to="/report" className="inline-block rounded-lg bg-red-700 px-6 py-3 text-lg font-semibold text-white">Report an Emergency Now</Link>
      </section>
      <section>
        <h2 className="mb-4 text-xl font-semibold">Emergency Hotlines</h2>
        {loading && <p>Loading hotlines...</p>}
        {!loading && hotlines.length === 0 && <p className="text-gray-500">No hotlines have been published yet.</p>}
        <ul className="grid gap-3 sm:grid-cols-2">
          {hotlines.map((hotline) => (
            <li key={hotline.id} className="flex items-center justify-between rounded-lg border p-4">
              <div><p className="font-medium">{hotline.name}</p><p className="text-sm text-gray-500">{hotline.region || 'National'}</p></div>
              <a href={`tel:${hotline.phone_number}`} className="font-bold text-red-700">{hotline.phone_number}</a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
