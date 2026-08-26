import { getEmergencyIcon } from '../utils/emergencyIcons'

const TIPS = {
  fire: ['Get out immediately — do not stop to collect belongings.', 'Stay low to the ground to avoid smoke.', 'Never go back inside a burning building.'],
  flood: ['Move to higher ground as soon as possible.', 'Avoid walking or driving through moving water.', 'Turn off electricity at the main switch if it is safe to do so.'],
  accident: ['Move to a safe area away from traffic if you are able to.', 'Do not move a seriously injured person unless there is immediate danger.', 'Keep the injured person calm and warm while waiting for help.'],
  medical: ['Stay with the person and keep them calm.', 'Do not give food or water to someone who is unconscious.', 'Note the time symptoms started — responders will ask.'],
  earthquake: ['Drop, cover, and hold on until the shaking stops.', 'Stay away from windows and heavy furniture.', 'Once shaking stops, check for injuries and hazards before moving.'],
}

export default function SafetyTips() {
  return (
    <main className="page-shell py-12">
      <div className="container max-w-4xl">
        <p className="eyebrow">Safety guidance</p>
        <h1 className="section-title">Simple safety steps for common emergencies.</h1>
        <p className="lead-text">
          Simple guidance for common emergencies. This does not replace professional help — always report the emergency and follow instructions from responders.
        </p>

        <div className="mt-8 space-y-5">
          {Object.entries(TIPS).map(([type, tips]) => (
            <section key={type} className="info-card">
              <h2 className="text-xl font-bold capitalize text-slate-900 dark:text-white">{getEmergencyIcon(type)} {type}</h2>
              <ul className="mt-4 list-inside list-disc space-y-2 text-slate-600 dark:text-slate-300">
                {tips.map((tip) => <li key={tip}>{tip}</li>)}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </main>
  )
}
