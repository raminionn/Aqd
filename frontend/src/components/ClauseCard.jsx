import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ShieldCheck, AlertTriangle, XCircle } from "lucide-react"

const riskConfig = {
  safe: {
    bg: "bg-[#c8f5a0]", border: "border-[#22c55e]",
    label: "Safe", Icon: ShieldCheck, iconColor: "text-green-700",
  },
  watch_out: {
    bg: "bg-[#f5e842]", border: "border-[#ca8a04]",
    label: "Watch out", Icon: AlertTriangle, iconColor: "text-yellow-700",
  },
  red_flag: {
    bg: "bg-[#f5a0a0]", border: "border-[#ef4444]",
    label: "Red flag", Icon: XCircle, iconColor: "text-red-700",
  },
}

export default function ClauseCard({ clause, plain_english, risk, reason }) {
  const [open, setOpen] = useState(false)
  const config = riskConfig[risk] || riskConfig.safe
  const Icon = config.Icon

  return (
    <motion.div
      whileHover={!open ? {
        x: 2, y: 2,
        boxShadow: "2px 2px 0px 0px #000",
        transition: { duration: 0.1 }
      } : {}}
      onClick={() => setOpen(!open)}
      className={`bg-white border-2 ${config.border} rounded-xl shadow-brutal cursor-pointer`}
    >
      <div className="px-5 py-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ rotate: 10, scale: 1.1 }}
            className={`w-8 h-8 ${config.bg} border-2 border-black rounded-lg flex items-center justify-center shrink-0`}
          >
            <Icon size={14} strokeWidth={2.5} className={config.iconColor} />
          </motion.div>
          <span className="font-display font-bold">{clause}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`${config.bg} border-2 border-black px-2.5 py-0.5 rounded-lg text-xs font-bold hidden sm:block`}>
            {config.label}
          </span>
          <motion.div
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown size={16} strokeWidth={2.5} />
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className={`px-5 pb-5 pt-4 border-t-2 ${config.border} space-y-3`}>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                  What this means
                </p>
                <p className="text-gray-800 text-sm leading-relaxed">{plain_english}</p>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className={`${config.bg} border-2 border-black rounded-xl p-4`}
              >
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                  Why this risk level
                </p>
                <p className="text-gray-700 text-sm leading-relaxed">{reason}</p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}