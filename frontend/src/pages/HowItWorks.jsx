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
    <main className="page-shell py-12">
      <div className="container max-w-4xl">
        <p className="eyebrow">How it works</p>
        <h1 className="section-title">Make a report in under a minute.</h1>
        <p className="lead-text">
          Reporting an emergency takes less than a minute. Here is exactly what happens, step by step.
        </p>

        <ol className="mt-8 space-y-5">
          {STEPS.map((step) => (
            <li key={step.number} className="info-card flex gap-4 rounded-2xl p-5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-600 font-black text-white shadow-lg shadow-red-600/20">
                {step.number}
              </span>
              <div>
                <p className="text-xl font-bold text-slate-900 dark:text-white">{step.title}</p>
                <p className="mt-2 text-slate-600 dark:text-slate-300">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </main>
  )
}
