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
    <main className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="mb-2 text-2xl font-bold">Safety Tips</h1>
      <p className="mb-8 text-gray-600">
        Simple guidance for common emergencies. This does not replace professional help — always report the emergency and follow instructions from responders.
      </p>
      <div className="space-y-6">
        {Object.entries(TIPS).map(([type, tips]) => (
          <section key={type} className="rounded-lg border p-4">
            <h2 className="mb-2 font-semibold capitalize">{getEmergencyIcon(type)} {type}</h2>
            <ul className="list-inside list-disc space-y-1 text-gray-600">
              {tips.map((tip) => <li key={tip}>{tip}</li>)}
            </ul>
          </section>
        ))}
      </div>
    </main>
  )
}
