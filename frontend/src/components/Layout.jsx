import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { Home, FileText, Activity, Landmark, Menu, X, HelpCircle } from 'lucide-react'

const navItems = [
  {
    label: 'Home',
    path: '/',
    icon: Home
  },
  {
    label: 'How It Works',
    path: '/how-it-works',
    icon: HelpCircle
  },
  {
    label: 'Generate Complaint',
    path: '/submit',
    icon: FileText
  },
  {
    label: 'Track Complaint',
    path: '/track',
    icon: Activity
  },
  {
    label: 'Department Queue',
    path: '/department',
    icon: Landmark
  },
]

function Layout() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)

  return (
    <div className="app-shell">
      {/* SIDEBAR */}
      <aside className={`sidebar ${isMobileNavOpen ? 'mobile-open' : ''}`}>
        <div className="brand-block" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '14px' }}>
          <div className="flex items-center gap-3">
            <div className="brand-mark" style={{ backgroundColor: 'var(--color-primary)' }}>
              <span>RA</span>
            </div>
            <div>
              <h1 className="text-base font-bold text-white leading-none">Raabta AI</h1>
              <span className="inline-flex items-center gap-1 rounded bg-[#006c35]/25 border border-[#10b981]/20 px-1.5 py-0.5 text-[9px] font-bold text-[#10b981] uppercase tracking-wider mt-1">
                🇵🇰 Official Portal
              </span>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 leading-tight">
              Pakistan AI Civic Complaint System
            </p>
            <p className="text-[9px] text-[#0b8f4d] font-semibold leading-tight">
              Powered by Google Gemma
            </p>
          </div>
        </div>

        <button
          className="mobile-nav-close"
          type="button"
          onClick={() => setIsMobileNavOpen(false)}
          aria-label="Close menu"
        >
          <X size={20} />
        </button>

        <nav className="sidebar-nav" aria-label="Primary">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/' || item.path === '/app'}
                className={({ isActive }) =>
                  `nav-link${isActive ? ' active' : ''}`
                }
                onClick={() => setIsMobileNavOpen(false)}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            )
          })}
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <div className="main-panel">
        <header className="topbar">
          <div className="topbar-title-block">
            <button
              className="mobile-nav-toggle"
              type="button"
              onClick={() => setIsMobileNavOpen((current) => !current)}
              aria-label="Toggle navigation"
            >
              <Menu size={20} />
            </button>

            <div>
              <h2>Citizen Dashboard</h2>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-900/60 px-3 py-1 text-xs font-medium text-slate-300">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
              <span>Gemma AI Connected</span>
            </div>
            <div className="inline-flex items-center gap-1 rounded-full border border-slate-800 bg-slate-900/60 px-3 py-1 text-xs font-semibold text-slate-300">
              <span>🇵🇰</span>
              <span>Pakistan</span>
            </div>
          </div>
        </header>

        <main className="content-area">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout