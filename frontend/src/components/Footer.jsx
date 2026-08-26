export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 pt-10 text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 pb-10 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div>
          <p className="text-lg font-black text-slate-900 dark:text-white">SafeSphere</p>
          <p className="mt-3 max-w-sm text-sm text-slate-600 dark:text-slate-300">Protecting communities through smart emergency response, trusted guidance, and rapid access to help.</p>
        </div>
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Quick access</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
            <li>Report emergency</li>
            <li>Emergency education</li>
            <li>Safety tips</li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Support</p>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">Use local emergency services immediately for life-threatening situations. SafeSphere is a guidance and coordination platform.</p>
        </div>
      </div>
      <div className="border-t border-slate-200 py-4 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
        &copy; {new Date().getFullYear()} SafeSphere. Protecting communities through smart emergency response.
      </div>
    </footer>
  )
}
