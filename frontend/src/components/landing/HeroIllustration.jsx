import { motion } from 'framer-motion'

const nodes = [
  {
    id: 'camera',
    icon: '📷',
    label: 'Capture',
    description: 'Photo or voice',
    position: 'top-[8%] left-[6%]',
    delay: 0.1,
  },
  {
    id: 'location',
    icon: '📍',
    label: 'Location',
    description: 'GPS detected',
    position: 'top-[8%] right-[6%]',
    delay: 0.2,
  },
  {
    id: 'ai',
    icon: '🤖',
    label: 'Gemma AI',
    description: 'Issue analysis',
    position: 'top-[42%] left-1/2 -translate-x-1/2',
    delay: 0.35,
    highlight: true,
  },
  {
    id: 'complaint',
    icon: '📝',
    label: 'Complaint',
    description: 'Auto-generated',
    position: 'bottom-[8%] left-[6%]',
    delay: 0.5,
  },
  {
    id: 'department',
    icon: '🏛',
    label: 'Department',
    description: 'Smart routing',
    position: 'bottom-[8%] right-[6%]',
    delay: 0.65,
  },
]

const connections = [
  { from: 'camera', to: 'ai', path: 'M 80 70 Q 160 120 200 180' },
  { from: 'location', to: 'ai', path: 'M 320 70 Q 240 120 200 180' },
  { from: 'ai', to: 'complaint', path: 'M 180 220 Q 120 280 80 330' },
  { from: 'ai', to: 'department', path: 'M 220 220 Q 280 280 320 330' },
]

function HeroIllustration() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-lg">
      {/* Ambient glow */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#2563EB]/20 via-transparent to-cyan-500/20 blur-3xl" />

      <div className="relative h-full w-full rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
        {/* SVG connection lines */}
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 400 400"
          fill="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2563EB" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#22D3EE" stopOpacity="0.6" />
            </linearGradient>
          </defs>

          {connections.map((conn, index) => (
            <motion.path
              key={conn.from + conn.to}
              d={conn.path}
              stroke="url(#lineGrad)"
              strokeWidth="2"
              strokeDasharray="6 4"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.3 + index * 0.15, ease: 'easeInOut' }}
            />
          ))}

          {/* Animated pulse dots along paths */}
          {[0, 1, 2, 3].map((i) => (
            <motion.circle
              key={i}
              r="3"
              fill="#22D3EE"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 1, 0],
                offsetDistance: ['0%', '100%'],
              }}
              transition={{
                duration: 2.5,
                delay: i * 0.6,
                repeat: Infinity,
                ease: 'linear',
              }}
              style={{ offsetPath: `path('${connections[i % connections.length].path}')` }}
            />
          ))}
        </svg>

        {/* Workflow nodes */}
        {nodes.map((node) => (
          <motion.div
            key={node.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: node.delay, type: 'spring', stiffness: 200 }}
            whileHover={{ scale: 1.08, y: -4 }}
            className={`absolute ${node.position} z-10`}
          >
            <div
              className={`flex w-[7.5rem] flex-col items-center rounded-2xl border px-3 py-3 text-center shadow-xl transition sm:w-32 ${
                node.highlight
                  ? 'border-cyan-400/40 bg-gradient-to-br from-[#2563EB]/30 to-cyan-500/20 shadow-cyan-500/20'
                  : 'border-white/15 bg-white/[0.06] backdrop-blur-md hover:border-cyan-400/30 hover:bg-white/[0.09]'
              }`}
            >
              <motion.span
                animate={node.highlight ? { y: [0, -3, 0] } : {}}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                className="text-2xl"
              >
                {node.icon}
              </motion.span>
              <p className="mt-1.5 text-xs font-semibold text-white">{node.label}</p>
              <p className="mt-0.5 text-[10px] text-slate-400">{node.description}</p>
            </div>
          </motion.div>
        ))}

        {/* Center badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="absolute left-1/2 top-1/2 z-0 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-500/20 bg-cyan-500/5"
        />
      </div>
    </div>
  )
}

export default HeroIllustration
