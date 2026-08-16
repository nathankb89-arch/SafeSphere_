import { useEffect, useState } from 'react'
import api from '../services/api'
import Spinner from '../components/Spinner'

export default function About() {
  const [info, setInfo] = useState(null)
  useEffect(() => { api.get('/safety/about/').then((res) => setInfo(res.data)) }, [])
  if (!info) return <Spinner />
  return <div className="mx-auto max-w-2xl px-6 py-10"><h1 className="mb-2 text-2xl font-bold">{info.name}</h1><p className="mb-6 text-gray-600">{info.tagline}</p><p className="mb-6">{info.mission}</p><p className="text-sm text-gray-500">Contact: <a href={`mailto:${info.contact_email}`} className="underline">{info.contact_email}</a></p></div>
}
