export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 pt-12 text-slate-300 dark:border-slate-800 dark:bg-black">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 pb-10 sm:px-6 lg:grid-cols-[1.3fr_0.8fr_1fr] lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-600 font-black text-white shadow-lg shadow-red-600/25">S</span>
            <div>
              <p className="text-lg font-black text-white">SafeSphere</p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Emergency ready</p>
            </div>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-6 text-slate-400">Protecting communities through smart emergency response, trusted guidance, and rapid access to help.</p>
        </div>
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-red-400">Quick access</p>
          <ul className="mt-4 space-y-3 text-sm text-slate-400">
            <li><a href="/report" className="transition hover:text-white">Report emergency</a></li>
            <li><a href="/education" className="transition hover:text-white">Emergency education</a></li>
            <li><a href="/safety-tips" className="transition hover:text-white">Safety tips</a></li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-red-400">Contact SafeSphere</p>
          <div className="mt-4 space-y-3 text-sm">
            <a href="tel:0741672799" className="block text-white transition hover:text-red-300">0741672799</a>
            <a href="https://instagram.com/nate.afterhrz" target="_blank" rel="noreferrer" className="block text-slate-400 transition hover:text-white">Instagram: @nate.afterhrz</a>
            <a href="https://github.com/nathankb89-arch" target="_blank" rel="noreferrer" className="block text-slate-400 transition hover:text-white">GitHub: @nathankb89-arch</a>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-800 px-4 py-5 text-center text-xs leading-5 text-slate-500 sm:px-6">
        <p>Use local emergency services immediately for life-threatening situations.</p>
        <p className="mt-1">&copy; {new Date().getFullYear()} SafeSphere. Protecting communities through smart emergency response.</p>
      </div>
    </footer>
  )
}
