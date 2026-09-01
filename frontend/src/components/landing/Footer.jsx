import { motion } from 'framer-motion'

function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="border-t border-white/10 bg-[#0B1120]/80 px-4 py-10 sm:px-6 lg:px-8"
    >
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left">
        <div>
          <p className="text-sm font-semibold text-white">
            Built for Google Build with Gemma Hackathon
          </p>
          <p className="mt-1 text-sm text-slate-400">
            Made with <span className="text-red-400">❤️</span> for Pakistan
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#2563EB] to-cyan-500 text-xs font-black text-white">
            R
          </div>
          <div className="text-left">
            <p className="text-sm font-bold text-white">Raabta AI</p>
            <p className="text-xs text-slate-500">Powered by Google Gemma 4</p>
          </div>
        </div>
      </div>
    </motion.footer>
  )
}

export default Footer
