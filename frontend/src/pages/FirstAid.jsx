import { Link } from 'react-router-dom'

const LESSONS = [
  {
    title: 'Check the scene',
    summary: 'Look for traffic, fire, electricity, violence, or other hazards before approaching.',
    action: 'Protect yourself first. Ask someone to contact local emergency services when serious danger is present.',
    avoid: 'Do not enter an unsafe scene or create another casualty.',
  },
  {
    title: 'Check responsiveness and breathing',
    summary: 'Speak to the person and look for normal breathing. Treat a person who is unresponsive or not breathing normally as an emergency.',
    action: 'Call local emergency services immediately and follow the dispatcher instructions.',
    avoid: 'Do not leave the person alone unless you must get help or move away from immediate danger.',
  },
  {
    title: 'Severe bleeding',
    summary: 'Heavy or uncontrolled bleeding needs urgent professional care.',
    action: 'Apply firm, direct pressure with a clean cloth or dressing and keep pressure in place while help is coming.',
    avoid: 'Do not repeatedly lift the dressing to check the wound. Add another layer if needed.',
  },
  {
    title: 'Burns',
    summary: 'Heat, chemical, electrical, and extensive burns can require urgent medical assessment.',
    action: 'Cool a minor thermal burn with clean, cool running water when safe. Seek professional advice for serious burns.',
    avoid: 'Do not apply ice, butter, or creams to a serious burn, and do not remove material stuck to the skin.',
  },
  {
    title: 'Choking',
    summary: 'A person who cannot cough, speak, or breathe normally needs immediate help.',
    action: 'Call local emergency services and follow their instructions for the person’s age and condition.',
    avoid: 'Do not give food or drink to someone who is choking or becoming unresponsive.',
  },
  {
    title: 'Shock and fainting',
    summary: 'Pale, clammy skin, confusion, weakness, or collapse can signal a serious problem.',
    action: 'Lay the person safely if appropriate, keep them warm, monitor breathing, and contact professionals.',
    avoid: 'Do not give an unconscious person anything to eat or drink.',
  },
]

export default function FirstAid() {
  return (
    <main className="page-shell">
      <section className="container py-12">
        <div className="max-w-4xl">
          <p className="eyebrow">First-aid learning</p>
          <h1 className="section-title">Simple actions while professional help is coming.</h1>
          <p className="lead-text">Use this page to learn a calm response pattern for common situations. It is general education, not a substitute for trained first-aid instruction, local emergency dispatch, or medical care.</p>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {LESSONS.map((lesson) => (
            <article key={lesson.title} className="info-card">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">{lesson.title}</h2>
              <div className="mt-5 space-y-4 text-sm leading-6">
                <div>
                  <p className="font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">What is happening?</p>
                  <p className="mt-1 text-slate-700 dark:text-slate-200">{lesson.summary}</p>
                </div>
                <div className="border-l-2 border-green-500 pl-3">
                  <p className="font-bold uppercase tracking-[0.14em] text-green-700 dark:text-green-400">What should I do now?</p>
                  <p className="mt-1 text-slate-700 dark:text-slate-200">{lesson.action}</p>
                </div>
                <div className="border-l-2 border-amber-500 pl-3">
                  <p className="font-bold uppercase tracking-[0.14em] text-amber-700 dark:text-amber-400">What should I avoid?</p>
                  <p className="mt-1 text-slate-700 dark:text-slate-200">{lesson.avoid}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="container pb-16">
        <div className="cta-banner">
          <div>
            <p className="eyebrow text-red-100">Need immediate help?</p>
            <h2 className="section-title small text-white">Contact local emergency services for life-threatening situations.</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/report" className="primary-btn white">Report emergency</Link>
            <Link to="/professionals" className="secondary-btn light">Meet the network</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
