const RESPONDERS = [
  {
    id: 1,
    name: 'Amina Ndayisaba',
    role: 'Volunteer lead',
    zone: 'Kigali Central',
    status: 'available',
    active: 2,
    skillSet: ['Medical', 'Traffic support'],
    responseTime: '6 min',
    phone: '+250 788 111 111',
    rating: 4.9,
  },
  {
    id: 2,
    name: 'Eugene Kayonga',
    role: 'NGO responder',
    zone: 'Kicukiro',
    status: 'on-route',
    active: 3,
    skillSet: ['Fire support', 'Evacuation'],
    responseTime: '9 min',
    phone: '+250 788 222 222',
    rating: 4.7,
  },
  {
    id: 3,
    name: 'Ruth Mutesa',
    role: 'Paramedic',
    zone: 'Gasabo',
    status: 'busy',
    active: 4,
    skillSet: ['Medical', 'First aid'],
    responseTime: '12 min',
    phone: '+250 788 333 333',
    rating: 4.8,
  },
  {
    id: 4,
    name: 'John Semakula',
    role: 'Field coordinator',
    zone: 'Remera',
    status: 'available',
    active: 1,
    skillSet: ['Logistics', 'Dispatch'],
    responseTime: '5 min',
    phone: '+250 788 444 444',
    rating: 4.9,
  },
]

const REQUIREMENTS = [
  {
    title: 'Role-based access',
    text: 'Only assigned responders, NGO staff, and admins can view all active incidents and assign teams.',
  },
  {
    title: 'Responder availability',
    text: 'Each responder must have a live status such as available, on-route, busy, or offline.',
  },
  {
    title: 'Coverage by zone',
    text: 'Dispatchers must see which areas each responder can reach quickly and what their current workload is.',
  },
  {
    title: 'Skill matching',
    text: 'Assignments should match responder skills like medical, fire support, evacuation, and logistics.',
  },
  {
    title: 'Escalation rules',
    text: 'Critical incidents should auto-prioritize for the next available responder in the affected zone.',
  },
  {
    title: 'Notification workflow',
    text: 'Responders should receive SMS, push, or email alerts when incidents are assigned or escalated.',
  },
]

const STATUS_STYLES = {
  available: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-200',
  'on-route': 'bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-200',
  busy: 'bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-200',
  offline: 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200',
}

export default function ResponderManagement() {
  return (
    <main className="page-shell py-12">
      <div className="container max-w-7xl">
        <header className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow">Operations</p>
            <h1 className="section-title small">Responder management</h1>
            <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-300">
              Coordinate people, coverage, and urgency so the right responder reaches the right incident quickly.
            </p>
          </div>
          <button type="button" className="primary-btn">Add responder</button>
        </header>

        <section className="mb-8 grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <p className="text-sm text-slate-500 dark:text-slate-400">Total responders</p>
            <p className="mt-3 text-3xl font-black text-slate-900 dark:text-white">24</p>
          </div>
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm dark:border-emerald-900/60 dark:bg-emerald-950/20">
            <p className="text-sm text-emerald-700 dark:text-emerald-200">Available now</p>
            <p className="mt-3 text-3xl font-black text-emerald-700 dark:text-emerald-200">11</p>
          </div>
          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 shadow-sm dark:border-blue-900/60 dark:bg-blue-950/20">
            <p className="text-sm text-blue-700 dark:text-blue-200">On route</p>
            <p className="mt-3 text-3xl font-black text-blue-700 dark:text-blue-200">7</p>
          </div>
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 shadow-sm dark:border-amber-900/60 dark:bg-amber-950/20">
            <p className="text-sm text-amber-700 dark:text-amber-200">Need coverage</p>
            <p className="mt-3 text-3xl font-black text-amber-700 dark:text-amber-200">3</p>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="eyebrow">Team roster</p>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Responder overview</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {['All', 'Available', 'On route', 'Busy', 'Offline'].map((item) => (
                <button
                  key={item}
                  type="button"
                  className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-slate-600 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {RESPONDERS.map((responder) => (
              <article key={responder.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/60">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-lg font-black text-red-700 dark:bg-red-950/40 dark:text-red-200">
                      {responder.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{responder.name}</h3>
                        <span className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${STATUS_STYLES[responder.status]}`}>
                          {responder.status}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-300">{responder.role} · {responder.zone}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {responder.skillSet.map((skill) => (
                          <span key={skill} className="rounded-full bg-white px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-600 dark:bg-slate-900 dark:text-slate-200">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-2 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-3">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.12em] text-slate-400">Active cases</p>
                      <p className="mt-1 font-semibold text-slate-900 dark:text-white">{responder.active}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.12em] text-slate-400">Avg. response</p>
                      <p className="mt-1 font-semibold text-slate-900 dark:text-white">{responder.responseTime}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.12em] text-slate-400">Rating</p>
                      <p className="mt-1 font-semibold text-slate-900 dark:text-white">{responder.rating}/5</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button type="button" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200">
                      View profile
                    </button>
                    <button type="button" className="rounded-xl bg-red-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-700">
                      Dispatch
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-5">
            <p className="eyebrow">Requirements</p>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">What the responder system must support</h2>
          </div>

          <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {REQUIREMENTS.map((item) => (
              <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.text}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
