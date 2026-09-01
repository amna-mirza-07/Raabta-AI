import { motion } from 'framer-motion'

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'How It Works', href: '#workflow' },
  { label: 'Features', href: '#features' },
]

function Navbar() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="sticky top-0 z-50 border-b border-white/10 bg-[#0F172A]/80 backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <a href="#home" className="group flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#2563EB] to-cyan-500 text-sm font-black tracking-wider text-white shadow-lg shadow-blue-500/25 transition group-hover:shadow-blue-500/40">
            R
          </div>
          <div>
            <p className="text-lg font-bold tracking-tight text-white">
              Raabta <span className="text-cyan-400">AI</span>
            </p>
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-400">
              Civic Intelligence
            </p>
          </div>
        </a>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <span className="hidden items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-300 sm:inline-flex">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Powered by Google Gemma 4
          </span>

          <a
            href="#cta"
            className="rounded-xl bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-500 hover:shadow-blue-500/40 md:hidden"
          >
            Start
          </a>
        </div>
      </div>
    </motion.header>
  )
}

export default Navbar
