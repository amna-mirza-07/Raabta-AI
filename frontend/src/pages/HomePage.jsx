import { useNavigate } from 'react-router-dom'
import { Sparkles, MapPin, ArrowRight, Brain, Shield, FileText, HelpCircle, Activity } from 'lucide-react'

function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="space-y-12">
      {/* HERO SECTION WITH BACKGROUND IMAGE */}
      <section className="glass-panel relative overflow-hidden p-8 md:p-12 lg:p-16 border border-emerald-950/20 bg-slate-950/50">
        {/* Faisal Mosque background with dark overlay and soft blur */}
        <div 
          className="absolute inset-0 z-0 pointer-events-none opacity-[0.22] filter blur-[1.5px]"
          style={{
            backgroundImage: 'url("/faisal_mosque_bg.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-br from-[#0b0f19]/70 via-[#0b0f19]/90 to-[#070a12]/98" />

        <div className="relative z-10 max-w-4xl space-y-6">
          {/* Logo & Badges Section */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="badge badge-green flex items-center gap-1.5 bg-[#0b6b3a]/15 border-[#0b6b3a]/30 text-emerald-400 text-[10px]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              🟢 portal active
            </span>
            <span className="badge badge-blue flex items-center gap-1 bg-slate-900/60 border-slate-800 text-slate-300 text-[10px]">
              <Brain size={12} className="text-emerald-500" />
              🧠 Google Gemma
            </span>
            <span className="badge badge-purple flex items-center gap-1 bg-slate-900/60 border-slate-800 text-slate-300 text-[10px]">
              🇵🇰 Pakistan Civic Portal
            </span>
            <span className="badge badge-blue flex items-center gap-1 bg-slate-900/60 border-slate-800 text-slate-300 text-[10px]">
              <MapPin size={12} className="text-emerald-500" />
              📍 Location Audit Active
            </span>
          </div>

          <div className="mt-4 flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#0B6B3A] to-[#10b981] text-white font-extrabold text-2xl shadow-lg border border-emerald-500/20">
              🇵🇰
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl leading-tight">
                Pakistan AI Civic Complaint Platform
              </h1>
              <p className="mt-1 text-sm font-semibold text-[#10b981] uppercase tracking-widest flex items-center gap-1.5">
                <Shield size={14} />
                <span>Raabta AI • National Civic Dispatch System</span>
              </p>
            </div>
          </div>

          <p className="text-sm md:text-base leading-relaxed text-slate-300 max-w-3xl font-medium">
            Welcome to the official civic grievance registration platform. Powered by Google Gemma AI, we automatically classify, map, and dispatch municipal complaints like damaged roads, sewerage blockages, or solid waste directly to the responsible public administrative authorities.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <button
              type="button"
              onClick={() => navigate('/submit')}
              className="btn-primary py-3.5 px-6 text-sm"
            >
              <Sparkles size={18} />
              <span>Start New Complaint</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/how-it-works')}
              className="btn-secondary py-3.5 px-6 text-sm"
            >
              <HelpCircle size={18} className="text-[#10b981]" />
              <span>How It Works</span>
            </button>
          </div>
        </div>
      </section>

      {/* TWO PRIMARY ACTIONS GRID */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Sparkles size={18} className="text-[#10b981]" />
            <span>Select Action</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Create a formal AI-categorized complaint dossier or learn how the platform routes reports.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Card 1: Start New Complaint */}
          <article
            onClick={() => navigate('/submit')}
            className="feature-card border border-slate-900 bg-slate-950/20 hover:border-[#0B6B3A]/30 p-8 cursor-pointer rounded-2xl flex flex-col justify-between transition-all duration-300 group"
          >
            <div className="space-y-4">
              <div className="feature-card-icon text-emerald-400 bg-[#0B6B3A]/10 border border-[#0B6B3A]/20 p-4 rounded-xl w-fit">
                <FileText size={28} />
              </div>
              <h3 className="text-xl font-bold text-white">🟢 Start New Complaint</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Launch the Grievance Studio to record a civic issue. Supports camera snapshots, Urdu or English voice notes, and direct text descriptions.
              </p>
            </div>
            <div className="mt-8 flex items-center gap-2 text-[#10b981] font-semibold text-sm group-hover:gap-4 transition-all">
              <span>Open Complaint Studio</span>
              <ArrowRight size={16} />
            </div>
          </article>

          {/* Card 2: How It Works */}
          <article
            onClick={() => navigate('/how-it-works')}
            className="feature-card border border-slate-900 bg-slate-950/20 hover:border-[#10b981]/30 p-8 cursor-pointer rounded-2xl flex flex-col justify-between transition-all duration-300 group"
          >
            <div className="space-y-4">
              <div className="feature-card-icon text-blue-400 bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl w-fit">
                <HelpCircle size={28} />
              </div>
              <h3 className="text-xl font-bold text-white">🔵 How It Works</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Read our simple step-by-step onboarding guide. Learn how Google Gemma AI captures location coordinates, audits image/voice data, and dispatches files.
              </p>
            </div>
            <div className="mt-8 flex items-center gap-2 text-emerald-400 font-semibold text-sm group-hover:gap-4 transition-all">
              <span>View Onboarding Guide</span>
              <ArrowRight size={16} />
            </div>
          </article>
        </div>
      </section>

      {/* DISPATCH LIFECYCLE TIMELINE */}
      <section className="glass-panel p-6 border border-slate-900 bg-slate-950/20">
        <h3 className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-wider">National Dispatch Lifecycle</h3>
        <div className="grid gap-4 md:grid-cols-5 text-center">
          {[
            { step: '1', title: 'Citizen Reports', desc: 'Inputs image, voice note, or text' },
            { step: '2', title: 'Gemma Extraction', desc: 'Identifies category and damage details' },
            { step: '3', title: 'National Route', desc: 'Assigned to WASA, TEPA, or Solid Waste' },
            { step: '4', title: 'Official Handoff', desc: 'Formal case dossier prepared' },
            { step: '5', title: 'Urdu Playout', desc: 'Audio receipt read out in Urdu' },
          ].map((item, index) => (
            <div key={index} className="relative p-4 rounded-xl bg-slate-900/10 border border-slate-900/60 flex flex-col items-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0B6B3A]/10 border border-[#0B6B3A]/30 text-[#10b981] text-xs font-bold mb-3">
                {item.step}
              </div>
              <h4 className="text-xs font-bold text-slate-200">{item.title}</h4>
              <p className="text-[10px] text-slate-400 mt-1 leading-tight">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default HomePage
