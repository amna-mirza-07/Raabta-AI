import { Landmark, GitBranch } from 'lucide-react'

const routingExamples = [
  {
    issue: 'Waste accumulation',
    analysis: 'Garbage blockage and sanitation concern detected via image processing.',
    department: 'Waste Management Company',
    priority: 'High',
  },
  {
    issue: 'Pothole on arterial road',
    analysis: 'Dangerous surface damage affecting traffic safety detected via image analysis.',
    department: 'Traffic Engineering & Planning Agency (TEPA)',
    priority: 'High',
  },
  {
    issue: 'Water leakage in residential lane',
    analysis: 'Water pressure loss and pipeline leakage reported via voice transcript.',
    department: 'Water Board / WASA',
    priority: 'Medium',
  },
]

function DepartmentPage() {
  return (
    <div className="space-y-8">
      {/* HEADER */}
      <section className="glass-panel border-slate-800 bg-slate-950/20">
        <span className="badge badge-purple flex items-center gap-1.5 w-fit">
          <Landmark size={12} />
          AI Routing Hub
        </span>
        <h2 className="mt-3 text-3xl font-extrabold text-white tracking-tight">AI Agency Routing Dispatch</h2>
        <p className="mt-1 text-sm text-slate-400">
          How Google Gemma AI processes civic complaints and automatically assigns them to the correct government department.
        </p>
      </section>

      {/* TWO COLUMN WORKFLOW & SAMPLES */}
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        
        {/* LEFT COLUMN: ACTIVE DISPATCH SAMPLES */}
        <section className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            Routing Audits & Classifications
          </h3>

          <div className="space-y-4">
            {routingExamples.map((item) => (
              <article key={item.issue} className="glass-panel border-slate-800 bg-slate-900/10 p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-2 flex-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Issue Class</span>
                    <h4 className="text-lg font-bold text-white mt-0.5">{item.issue}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">{item.analysis}</p>
                  </div>
                  
                  <div className="grid gap-3 sm:grid-cols-2 lg:flex lg:flex-col gap-2 min-w-[200px]">
                    <div className="rounded-xl border border-slate-900 bg-slate-950/50 px-4 py-2.5">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 block">Assigned Agency</span>
                      <p className="mt-0.5 text-xs font-semibold text-slate-200">{item.department}</p>
                    </div>
                    <div className="rounded-xl border border-slate-900 bg-slate-950/50 px-4 py-2.5">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 block">Priority Grade</span>
                      <p className="mt-0.5">
                        <span className={`badge ${item.priority.toLowerCase() === 'high' ? 'badge-red' : 'badge-amber'}`}>
                          {item.priority}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* RIGHT COLUMN: WORKFLOW DIAGRAM */}
        <section className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            AI Classification Pipeline
          </h3>

          <div className="glass-panel border-slate-800 bg-gradient-to-b from-slate-900/60 to-slate-950/30 p-6 space-y-6">
            <div className="flex items-center gap-2 text-blue-400">
              <GitBranch size={20} />
              <h4 className="font-bold text-white text-sm">Citizen-to-Agency Dispatch Flow</h4>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Our backend translates raw multimodal feedback (photos, recordings, text) into structured civic handoffs. By classifying severity and intent first, Gemma ensures high precision routing.
            </p>

            <div className="space-y-4 pt-2">
              {[
                { title: 'Data Ingestion', desc: 'Raw voice, image, or text captured with geolocation headers.' },
                { title: 'Multimodal Classification', desc: 'Gemma Vision / Voice parsing extracts the specific category.' },
                { title: 'Severity Estimation', desc: 'Urgency metrics computed to grade priority as High, Medium, or Low.' },
                { title: 'Agency Dispatch', desc: 'Official case sheet formatted and assigned directly to WASA, TEPA, or Waste Management.' },
              ].map((step, idx) => (
                <div key={idx} className="flex gap-4 items-start">
                  <div className="flex-shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold mt-0.5">
                    {idx + 1}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-200">{step.title}</h5>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}

export default DepartmentPage
