const STEPS = [
  {
    number: 1,
    title: 'Tell us what happened',
    text: "Tap 'Report an Emergency.' You do not need an account. Just describe what's happening and where.",
  },
  {
    number: 2,
    title: 'Share your location',
    text: "Tap 'Use my current location' so responders know exactly where to go, or type in the nearest landmark.",
  },
  {
    number: 3,
    title: 'Add a photo if you can',
    text: 'A photo helps responders understand the situation faster, but it is not required.',
  },
  {
    number: 4,
    title: 'Send your report',
    text: 'Press submit. Your report goes straight to volunteers and responders in the system.',
  },
  {
    number: 5,
    title: 'Get updates',
    text: 'If you have an account, you will see your report’s status change as help is on the way.',
  },
]

export default function HowItWorks() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="mb-2 text-2xl font-bold">How SafeSphere Works</h1>
      <p className="mb-8 text-gray-600">
        Reporting an emergency takes less than a minute. Here is exactly what happens, step by step.
      </p>
      <ol className="space-y-6">
        {STEPS.map((step) => (
          <li key={step.number} className="flex gap-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-700 font-bold text-white">
              {step.number}
            </span>
            <div>
              <p className="font-semibold">{step.title}</p>
              <p className="text-gray-600">{step.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </main>
  )
}
