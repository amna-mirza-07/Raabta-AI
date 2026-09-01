import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import HeroIllustration from './HeroIllustration'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

function Hero() {
  const navigate = useNavigate()

  const handleStartReporting = () => {
    navigate('/app/submit')
  }

  const scrollToWorkflow = () => {
    document
      .getElementById('workflow')
      ?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="home"
      className="relative overflow-hidden px-4 pb-20 pt-12 sm:px-6 lg:px-8 lg:pb-28 lg:pt-20"
    >
      <div className="pointer-events-none absolute inset-0">

        <div className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-[#2563EB]/15 blur-[100px]" />

        <div className="absolute -right-32 top-40 h-80 w-80 rounded-full bg-cyan-500/10 blur-[100px]" />

        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />

      </div>


      <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-16">


        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center lg:text-left"
        >


          <motion.div variants={itemVariants}>
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-cyan-300">
              ✨ Powered by Google Gemma 4
            </span>
          </motion.div>


          <motion.h1
            variants={itemVariants}
            className="mt-6 bg-gradient-to-br from-white via-white to-slate-400 bg-clip-text text-5xl font-bold tracking-tight text-transparent sm:text-6xl lg:text-7xl"
          >
            Raabta AI
          </motion.h1>


          <motion.p
            variants={itemVariants}
            className="mt-4 text-xl font-medium text-slate-200 sm:text-2xl"
          >
            AI-Powered Civic Complaint Assistant for Pakistan
          </motion.p>


          <motion.p
            variants={itemVariants}
            className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-slate-400 lg:mx-0 lg:text-lg"
          >
            Report potholes, broken streetlights, garbage, water leaks and other
            civic issues using AI image analysis and voice reporting powered by
            Google Gemma 4.
          </motion.p>


          <motion.div
            variants={itemVariants}
            className="mt-8 flex flex-wrap justify-center gap-4 lg:justify-start"
          >


            <motion.button
              type="button"
              onClick={handleStartReporting}
              whileHover={{
                scale: 1.03,
                boxShadow:
                  '0 20px 40px rgba(37,99,235,0.35)',
              }}
              whileTap={{ scale: 0.98 }}
              className="rounded-2xl bg-gradient-to-r from-[#2563EB] to-blue-600 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-blue-600/30 transition"
            >
              🚀 Start Reporting
            </motion.button>


            <motion.button
              type="button"
              onClick={scrollToWorkflow}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="rounded-2xl border border-white/15 bg-white/5 px-8 py-4 text-base font-semibold text-white backdrop-blur-lg transition hover:border-cyan-400/40 hover:bg-white/10"
            >
              Learn More
            </motion.button>


          </motion.div>


          <motion.div
            variants={itemVariants}
            className="mt-10 flex flex-wrap justify-center gap-6 lg:justify-start"
          >

            {[
              ['Image Analysis', 'Gemma Vision'],
              ['Voice Reports', 'Urdu Support'],
              ['Smart Routing', 'WASA · TEPA · PHA'],
            ].map(([label, value]) => (

              <div key={label} className="text-center lg:text-left">

                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  {label}
                </p>

                <p className="mt-0.5 text-sm font-semibold text-slate-300">
                  {value}
                </p>

              </div>

            ))}

          </motion.div>


        </motion.div>



        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.8,
            delay: 0.3,
          }}
          className="flex justify-center lg:justify-end"
        >

          <HeroIllustration />

        </motion.div>


      </div>


    </section>
  )
}

export default Hero