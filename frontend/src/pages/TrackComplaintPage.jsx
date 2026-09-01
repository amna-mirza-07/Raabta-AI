import { useState } from 'react'
import { Search, MapPin, Building, AlertTriangle, Clock } from 'lucide-react'

const defaultTrackingData = [
  {
    id: "COMP-2026-8941",
    status: "In progress",
    title: "Deep pothole on main Boulevard",
    location: "Gulberg III, Lahore, Pakistan",
    department: "Traffic Engineering & Planning Agency (TEPA)",
    severity: "High",
    timeline: [
      "Complaint submitted via Raabta AI",
      "AI analyzed & categorized issue",
      "Assigned to TEPA (Traffic Engineering & Planning Agency)",
      "Team dispatched for road repair"
    ]
  },
  {
    id: "COMP-2026-3024",
    status: "Resolved",
    title: "Garbage accumulation near park entrance",
    location: "Sector F-10, Islamabad, Pakistan",
    department: "Waste Management Company",
    severity: "High",
    timeline: [
      "Complaint submitted via Raabta AI",
      "AI analyzed & categorized issue",
      "Assigned to Waste Management Company",
      "Garbage cleared and area cleaned"
    ]
  },
  {
    id: "COMP-2026-1049",
    status: "Submitted",
    title: "Water pipeline leakage",
    location: "DHA Phase 5, Karachi, Pakistan",
    department: "Water Board / WASA",
    severity: "Medium",
    timeline: [
      "Complaint submitted via Raabta AI",
      "AI analyzed & categorized issue",
      "Awaiting assignment to WASA field team"
    ]
  }
]

function TrackComplaintPage({ trackingData = defaultTrackingData }) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredData = trackingData.filter(item => 
    item.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.department.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'resolved':
        return <span className="badge badge-green">Resolved</span>
      case 'in progress':
        return <span className="badge badge-blue">In Progress</span>
      default:
        return <span className="badge badge-amber">Submitted</span>
    }
  }

  return (
    <div className="space-y-8">
      {/* HEADER SECTION */}
      <section className="glass-panel border-slate-800 bg-slate-950/20">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <span className="badge badge-purple flex items-center gap-1.5 w-fit">
              <Clock size={12} />
              Case Auditing
            </span>
            <h2 className="mt-3 text-3xl font-extrabold text-white tracking-tight">Track Your Civic Complaint</h2>
            <p className="mt-1 text-sm text-slate-400">
              Auditing system for submission lifecycle, automated Gemma AI categorization, and department handoffs.
            </p>
          </div>

          <div className="relative w-full max-w-sm">
            <span className="absolute left-3.5 top-3 text-slate-500">
              <Search size={18} />
            </span>
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950/50 text-slate-200 placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm transition-all" 
              placeholder="Filter by ID, issue or agency..." 
            />
          </div>
        </div>
      </section>

      {/* TRACKING LIST */}
      <section className="space-y-4">
        {filteredData.length > 0 ? (
          filteredData.map((item) => (
            <article key={item.id} className="glass-panel border-slate-800 bg-slate-900/10 p-6">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                
                {/* CASE SUMMARY */}
                <div className="space-y-4 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-sm font-bold text-blue-400">{item.id}</span>
                    {getStatusBadge(item.status)}
                    <span className={`badge ${item.severity.toLowerCase() === 'high' ? 'badge-red' : 'badge-blue'}`}>
                      {item.severity} Priority
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white">{item.title}</h3>
                    <p className="mt-1.5 text-xs text-slate-400 flex items-center gap-1">
                      <MapPin size={12} className="text-slate-500" />
                      <span>{item.location}</span>
                    </p>
                  </div>

                  <div className="pt-2 grid gap-4 sm:grid-cols-2 max-w-md">
                    <div className="rounded-xl border border-slate-900 bg-slate-950/40 p-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                        <Building size={10} />
                        <span>Responsible Agency</span>
                      </span>
                      <p className="mt-1 text-xs font-semibold text-slate-200">{item.department}</p>
                    </div>
                  </div>
                </div>

                {/* TIMELINE TRACKER */}
                <div className="w-full lg:max-w-md rounded-2xl border border-slate-900 bg-slate-950/50 p-5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-900 pb-3 mb-4">
                    Audit Timeline
                  </h4>
                  
                  <div className="tracking-timeline">
                    {item.timeline.map((step, index) => {
                      // Mark all steps as complete except the last step if not resolved
                      const isLastStep = index === item.timeline.length - 1
                      const isResolved = item.status.toLowerCase() === 'resolved'
                      const isStepDone = !isLastStep || isResolved
                      
                      return (
                        <div 
                          key={`${item.id}-${step}`} 
                          className={`tracking-step ${isStepDone ? 'done' : ''}`}
                        >
                          <div className="flex items-start gap-3">
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold text-slate-400 border border-slate-800">
                              {isStepDone ? '✓' : index + 1}
                            </span>
                            <div>
                              <span className={`text-xs font-semibold ${isStepDone ? 'text-slate-200' : 'text-slate-400'}`}>
                                {step}
                              </span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

              </div>
            </article>
          ))
        ) : (
          <div className="glass-panel p-12 text-center text-slate-500">
            <AlertTriangle size={32} className="mx-auto text-slate-700 mb-3" />
            <p className="font-bold text-slate-400 text-sm">No complaints found</p>
            <p className="text-xs text-slate-500 mt-1">Try searching for a different ID or keyword.</p>
          </div>
        )}
      </section>
    </div>
  )
}

export default TrackComplaintPage
