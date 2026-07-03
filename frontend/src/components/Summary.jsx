import { motion } from "framer-motion"
import { Briefcase, Home, Code2, Lock, FileText } from "lucide-react"

const typeConfig = {
  Employment: { bg: "bg-[#a0d4f5]", Icon: Briefcase },
  Rental:     { bg: "bg-[#c8b5f5]", Icon: Home },
  Freelance:  { bg: "bg-[#f5c842]", Icon: Code2 },
  NDA:        { bg: "bg-[#f5a0c8]", Icon: Lock },
  Other:      { bg: "bg-[#d0d0d0]", Icon: FileText },
}

export default function Summary({ summary, contractType }) {
  const config = typeConfig[contractType] || typeConfig.Other
  const Icon = config.Icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border-2 border-black rounded-2xl shadow-brutal-lg overflow-hidden"
    >
      <div className={`${config.bg} border-b-2 border-black px-6 py-4 flex items-center gap-3`}>
        <motion.div
          whileHover={{ rotate: -8, scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="w-10 h-10 bg-white border-2 border-black rounded-xl flex items-center justify-center shadow-brutal cursor-default"
        >
          <Icon size={18} strokeWidth={2.5} />
        </motion.div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-black/50">
            Contract Type
          </p>
          <p className="font-display font-extrabold text-xl">{contractType}</p>
        </div>
      </div>

      <div className="px-6 py-5">
        <p className="text-gray-700 leading-relaxed">{summary}</p>

        <div className="flex gap-5 mt-5 pt-5 border-t-2 border-dashed border-gray-200">
          {[
            { color: "bg-[#c8f5a0]", label: "Safe" },
            { color: "bg-[#f5e842]", label: "Watch out" },
            { color: "bg-[#f5a0a0]", label: "Red flag" },
          ].map(({ color, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -2 }}
              className="flex items-center gap-2 text-sm font-semibold cursor-default"
            >
              <span className={`w-4 h-4 ${color} border-2 border-black rounded`} />
              {label}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}