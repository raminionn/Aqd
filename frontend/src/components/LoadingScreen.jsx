import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FileSearch, Scale, Brain, CheckCircle, Sparkles } from "lucide-react"

const steps = [
  { icon: FileSearch, label: "Reading your contract..." },
  { icon: Scale,      label: "Retrieving Pakistani legal context..." },
  { icon: Brain,      label: "Identifying clauses and risks..." },
  { icon: CheckCircle,label: "Grounding analysis in local law..." },
  { icon: Sparkles,   label: "Preparing your breakdown..." },
]

const STEP_INTERVAL = 900 // ms between each step appearing

export default function LoadingScreen() {
  const [visibleCount, setVisibleCount] = useState(1)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleCount((prev) => (prev >= steps.length ? 1 : prev + 1))
    }, STEP_INTERVAL)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center py-24">
      <motion.div
        className="w-20 h-20 bg-[#f5c842] border-2 border-black rounded-2xl shadow-brutal-lg flex items-center justify-center mb-8"
        animate={{ rotate: [0, -6, 6, -6, 0], scale: [1, 1.05, 1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <FileSearch size={36} strokeWidth={2} />
      </motion.div>

      <h3 className="font-display text-2xl font-extrabold mb-2">
        Analysing your contract
      </h3>
      <p className="text-gray-400 text-sm mb-10">
        Retrieving Pakistani legal context and reading every clause
      </p>

      {/* Looping animated bar */}
      <div className="w-full max-w-sm mb-8">
        <div className="h-2 bg-gray-100 border-2 border-black rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-[#f5c842] rounded-full"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            style={{ width: "50%" }}
          />
        </div>
      </div>

      <div className="w-full max-w-sm space-y-3">
        <AnimatePresence mode="popLayout">
          {steps.slice(0, visibleCount).map((step) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.label}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="flex items-center gap-3 bg-white border-2 border-black rounded-xl px-4 py-3 shadow-brutal"
              >
                <motion.div
                  initial={{ backgroundColor: "#f0f0f0" }}
                  animate={{ backgroundColor: "#c8f5a0" }}
                  transition={{ duration: 0.4, delay: 0.15 }}
                  className="w-8 h-8 border-2 border-black rounded-lg flex items-center justify-center shrink-0"
                >
                  <Icon size={14} strokeWidth={2.5} />
                </motion.div>
                <span className="text-sm font-semibold text-gray-700">{step.label}</span>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}