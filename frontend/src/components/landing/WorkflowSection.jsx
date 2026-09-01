import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const steps = [
  {
    icon: '📷',
    title: 'Capture or Upload',
    description: 'Snap a photo of the civic issue or record a voice complaint in Urdu.',
  },
  {
    icon: '📍',
    title: 'Detect Location',
    description: 'GPS coordinates are captured and converted to a readable address.',
  },
  {
    icon: '🤖',
    title: 'Gemma AI Analysis',
    description: 'Google Gemma 4 identifies the issue, severity, and responsible department.',
  },
  {
    icon: '📝',
    title: 'Complaint Generation',
    description: 'A formal, citizen-ready complaint letter is drafted automatically.',
  },
  {
    icon: '🏛',
    title: 'Department Selection',
    description: 'Routes to WASA, TEPA, Municipal Corporation, PHA, and more.',
  },
  {
    icon: '🔊',
    title: 'Voice Confirmation',
    description: 'Receive an AI voice summary confirming your report was processed.',
  },
]

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      delay: index * 0.1,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
}

function WorkflowSection() {
  const navigate = useNavigate()

  return (
    <section id="workflow" className="relative px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-400">
            How It Works
          </p>
          <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
            From report to resolution in six steps
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            Raabta AI guides citizens through a seamless workflow — powered entirely by
            Google Gemma 4 at every stage.
          </p>
        </motion.div>

        {/* Desktop: horizontal flow with arrows */}
        <div id="features" className="mt-14 hidden lg:block">
          <div className="grid grid-cols-6 gap-3">
            {steps.map((step, index) => (
              <div key={step.title} className="relative flex flex-col items-center">
                <motion.article
                  custom={index}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-40px' }}
                  variants={cardVariants}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  className="group h-full w-full rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl transition hover:border-cyan-400/30 hover:bg-white/[0.07] hover:shadow-lg hover:shadow-cyan-500/10"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#2563EB]/20 to-cyan-500/20 text-2xl transition group-hover:scale-110">
                    {step.icon}
                  </div>
                  <h3 className="mt-4 text-sm font-semibold text-white">{step.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-400">
                    {step.description}
                  </p>
                </motion.article>

                {index < steps.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0, scaleX: 0 }}
                    whileInView={{ opacity: 1, scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
                    className="absolute -right-3 top-1/2 z-10 -translate-y-1/2 text-cyan-400"
                  >
                    →
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Mobile / tablet: vertical flow */}
        <div className="mt-14 flex flex-col items-center gap-0 lg:hidden">
          {steps.map((step, index) => (
            <div key={step.title} className="flex w-full max-w-md flex-col items-center">
              <motion.article
                custom={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                variants={cardVariants}
                whileHover={{ scale: 1.02 }}
                className="group w-full rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl transition hover:border-cyan-400/30 hover:bg-white/[0.07]"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#2563EB]/20 to-cyan-500/20 text-2xl">
                    {step.icon}
                  </div>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                      Step {index + 1}
                    </span>
                    <h3 className="mt-1 text-lg font-semibold text-white">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-400">
                      {step.description}
                    </p>
                  </div>
                </div>
              </motion.article>

              {index < steps.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, scaleY: 0 }}
                  whileInView={{ opacity: 1, scaleY: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + index * 0.08, duration: 0.3 }}
                  className="flex h-10 items-center justify-center text-xl text-cyan-400"
                >
                  ↓
                </motion.div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom CTA repeat */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 flex justify-center"
        >
          <motion.button
            type="button"
            onClick={() => navigate('/app/submit')}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="rounded-2xl border border-white/10 bg-white/[0.04] px-8 py-4 text-base font-semibold text-white backdrop-blur-xl transition hover:border-cyan-400/30 hover:bg-white/[0.08]"
          >
            Start Reporting
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}

export default WorkflowSection
