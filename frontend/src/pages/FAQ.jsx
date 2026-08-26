import { useState } from 'react'

const FAQS = [
  { q: 'Do I need to create an account to report an emergency?', a: 'No. You can report an emergency right away without signing up. Creating a free account lets you track the status of your report afterward.' },
  { q: 'Is SafeSphere free to use?', a: 'Yes, SafeSphere is free for anyone to use.' },
  { q: 'What happens after I submit a report?', a: 'Your report is sent to available volunteers and responders. If you have an account, you will see its status update as it is picked up and worked on.' },
  { q: "What if I don't know the exact address?", a: "That's okay. You can describe a nearby landmark, or tap 'Use my current location' and we will capture your coordinates automatically." },
  { q: 'Can I use SafeSphere on my phone?', a: 'Yes. SafeSphere works in any phone or computer web browser — no app download is required.' },
  { q: 'What if I made a mistake in my report?', a: 'If you are logged in, you can go to your Dashboard and edit the details of your report.' },
]

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="info-card rounded-2xl p-0 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex w-full items-center justify-between px-5 py-4 text-left text-base font-semibold text-slate-900 dark:text-white"
      >
        {q}
        <span aria-hidden="true" className="ml-4 text-xl text-red-600">{open ? '−' : '+'}</span>
      </button>
      {open && <p className="border-t border-slate-200 px-5 py-4 text-sm leading-6 text-slate-600 dark:border-slate-700 dark:text-slate-300">{a}</p>}
    </div>
  )
}

export default function FAQ() {
  return (
    <main className="page-shell py-12">
      <div className="container max-w-3xl">
        <p className="eyebrow">FAQ</p>
        <h1 className="section-title">Frequently asked questions</h1>
        <div className="mt-8 space-y-3">
          {FAQS.map((item) => <FAQItem key={item.q} {...item} />)}
        </div>
      </div>
    </main>
  )
}
