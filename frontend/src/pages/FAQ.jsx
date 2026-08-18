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
    <div className="rounded-lg border">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex w-full items-center justify-between px-4 py-3 text-left font-medium"
      >
        {q}
        <span aria-hidden="true" className="ml-4 text-gray-400">{open ? '−' : '+'}</span>
      </button>
      {open && <p className="px-4 pb-3 text-gray-600">{a}</p>}
    </div>
  )
}

export default function FAQ() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="mb-6 text-2xl font-bold">Frequently Asked Questions</h1>
      <div className="space-y-3">
        {FAQS.map((item) => <FAQItem key={item.q} {...item} />)}
      </div>
    </main>
  )
}
