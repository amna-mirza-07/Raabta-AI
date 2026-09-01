import { useNavigate } from 'react-router-dom'
import { Camera, Mic, FileText, Brain, Building, CheckCircle, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
}

function HowItWorksPage() {
  const navigate = useNavigate()

  const steps = [
    {
      step: "01",
      title: "Submit Grievance Details",
      icon: (
        <div className="flex gap-3 justify-center text-emerald-400">
          <Camera size={28} className="animate-pulse" />
          <span className="text-slate-600 text-lg">/</span>
          <Mic size={28} className="animate-pulse" />
          <span className="text-slate-600 text-lg">/</span>
          <FileText size={28} className="animate-pulse" />
        </div>
      ),
      desc: "Citizen uploads/snaps a photo of the issue, records a voice note (in Urdu or English), or describes the problem in text.",
      badge: "Citizen Action"
    },
    {
      step: "02",
      title: "Gemma AI Analysis",
      icon: <Brain size={40} className="text-[#10b981]" />,
      desc: "Google Gemma AI parses the text, transcribes the voice note, or audits the uploaded image using visual intelligence to understand details.",
      badge: "AI Classification"
    },
    {
      step: "03",
      title: "Smart Department Routing",
      icon: <Building size={40} className="text-[#0B6B3A]" />,
      desc: "The system automatically selects the correct administrative department (WASA, TEPA, PHA, Solid Waste) based on categorization.",
      badge: "National Routing"
    },
    {
      step: "04",
      title: "Complaint Dossier Ready",
      icon: <CheckCircle size={40} className="text-emerald-500" />,
      desc: "A formal, legally formatted grievance dossier is compiled as a PDF. An Urdu voice notification confirms the successful dispatch.",
      badge: "Final Handoff"
    }
  ]

  return (
    <div className="space-y-12 max-w-5xl mx-auto py-4">
      {/* HEADER */}
      <section className="text-center space-y-4">
        <span className="badge badge-purple bg-emerald-950/20 border-emerald-900/35 text-emerald-400 text-xs py-1.5 px-4">
          🇵🇰 CITIZEN ONBOARDING GUIDE
        </span>
        <h1 className="text-3xl font-extrabold sm:text-4xl lg:text-5xl text-white tracking-tight">
          How Raabta AI Works
        </h1>
        <p className="text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Our platform simplifies reporting civic breakdowns for ordinary citizens. 
          Get your complaints resolved in four simple stages powered by Google Gemma.
        </p>
      </section>

      {/* STEPS GRID */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-6 md:grid-cols-2"
      >
        {steps.map((item, index) => (
          <motion.div
            key={item.step}
            variants={cardVariants}
            className="glass-panel relative flex flex-col justify-between overflow-hidden border border-slate-800/80 bg-slate-900/10 hover:border-[#0B6B3A]/30 transition-all duration-300"
          >
            {/* Step Number Badge */}
            <div className="absolute top-0 right-0 bg-[#0B6B3A] text-white font-extrabold px-4 py-2 rounded-bl-2xl text-sm tracking-wider">
              STEP {item.step}
            </div>

            <div className="space-y-6 mt-4">
              <div className="inline-flex p-4 rounded-2xl bg-slate-950/50 border border-slate-900 w-fit">
                {item.icon}
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#10b981]">
                  {item.badge}
                </span>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
            
            <div className="mt-8 pt-4 border-t border-slate-900/50 text-xs font-semibold text-slate-500 flex items-center justify-between">
              <span>Raabta Dispatch System</span>
              {index < 3 && (
                <span className="flex items-center gap-1 text-[#10b981]">
                  Proceed to Step {index + 2} <ArrowRight size={12} />
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </motion.section>

      {/* CALL TO ACTION */}
      <section className="glass-panel text-center p-8 md:p-12 bg-gradient-to-br from-emerald-950/10 via-slate-900/50 to-slate-950/30 border border-[#0B6B3A]/20">
        <h2 className="text-2xl font-bold text-white">Ready to report a civic issue?</h2>
        <p className="mt-2 text-sm text-slate-400 max-w-xl mx-auto">
          Help improve your neighborhood. File a complaint using camera, microphone, or simple text description.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <button
            type="button"
            onClick={() => navigate('/submit')}
            className="btn-primary"
          >
            <span>Start New Complaint</span>
            <ArrowRight size={16} />
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="btn-secondary"
          >
            <span>Back to Home</span>
          </button>
        </div>

      </section>
    </div>
  )
}

export default HowItWorksPage
