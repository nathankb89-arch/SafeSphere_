import { Link } from 'react-router-dom'

const TOPICS = [
  {
    title: 'CPR & cardiac emergencies',
    subtitle: 'Start chest compressions immediately and call emergency services.',
    emphasis: 'If someone is unresponsive or not breathing normally, call for professional help immediately.',
  },
  {
    title: 'Choking',
    subtitle: 'Ask whether the person can cough or speak. If they cannot, act quickly and seek emergency support.',
    emphasis: 'Do not try multiple rescue methods at once. Follow local emergency guidance.',
  },
  {
    title: 'Severe bleeding',
    subtitle: 'Apply direct pressure with a clean cloth and elevate the injured area if it is safe.',
    emphasis: 'Keep pressure on the wound and call emergency services if bleeding is serious or uncontrolled.',
  },
  {
    title: 'Burns',
    subtitle: 'Cool burns under running water if safe to do so and remove tight or hot items carefully.',
    emphasis: 'Large burns, facial burns, or burns on children need professional medical assessment.',
  },
  {
    title: 'Fires & smoke',
    subtitle: 'Get out immediately, close doors if safe, and stay low where visibility is poor.',
    emphasis: 'Never re-enter a burning building. Call the local fire service as soon as possible.',
  },
  {
    title: 'Natural disasters',
    subtitle: 'Move to safer ground, follow official alerts, and keep supplies and communication ready.',
    emphasis: 'Listen to local authorities and do not drive through flooded roads.',
  },
]

const QUICK_GUIDE = [
  {
    heading: 'What is happening?',
    text: 'Take a moment to assess the scene and identify any immediate danger before helping.',
  },
  {
    heading: 'What should I do now?',
    text: 'Move to safety, call emergency services if needed, and keep the person calm while you wait for help.',
  },
  {
    heading: 'What should I avoid?',
    text: 'Do not move someone with a suspected spinal injury unless there is immediate danger. Do not give food or drink to an unconscious person.',
  },
  {
    heading: 'When should I contact professionals?',
    text: 'If the person is in severe distress, unconscious, not breathing, bleeding heavily, or at risk of worsening harm, contact local emergency responders immediately.',
  },
]

export default function EmergencyEducation() {
  return (
    <main className="page-shell">
      <section className="container py-12">
        <div className="max-w-4xl">
          <p className="eyebrow">Emergency education</p>
          <h1 className="section-title">Know what to do before help arrives.</h1>
          <p className="lead-text">
            These steps are for general preparedness and safety guidance. They do not replace professional emergency care or local emergency dispatch.
          </p>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {TOPICS.map((topic) => (
            <article key={topic.title} className="info-card">
              <span className="status-badge status-amber">Preparedness</span>
              <h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-slate-100">{topic.title}</h2>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{topic.subtitle}</p>
              <p className="mt-4 border-l-2 border-red-500 pl-3 text-sm text-slate-700 dark:text-slate-200">{topic.emphasis}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container pb-12">
        <div className="section-headings">
          <p className="eyebrow">Quick emergency guidance</p>
          <h2 className="section-title small">A simple response framework</h2>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {QUICK_GUIDE.map((item) => (
            <div key={item.heading} className="info-card">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{item.heading}</h3>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container pb-16">
        <div className="cta-banner">
          <div>
            <p className="eyebrow text-red-100">Need help now?</p>
            <h2 className="section-title small text-white">Report an emergency or learn what to do next.</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/report" className="primary-btn white">Report emergency</Link>
            <Link to="/faq" className="secondary-btn light">Read FAQ</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
