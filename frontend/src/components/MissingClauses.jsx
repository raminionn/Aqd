import { motion } from "framer-motion"
import { AlertTriangle } from "lucide-react"

export default function MissingClauses({ items }) {
  if (!items || items.length === 0) return null

  return (
    <div>
      <h3 className="font-display text-xl font-bold mb-3">
        Missing Clauses
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="ml-2 px-2.5 py-0.5 bg-[#f5a0a0] border-2 border-black text-sm rounded-lg font-normal inline-block"
        >
          {items.length}
        </motion.span>
      </h3>
      <div className="space-y-2">
        {items.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            whileHover={{ x: 4, boxShadow: "4px 4px 0px 0px #000" }}
            className="flex gap-3 bg-white border-2 border-black rounded-xl p-4 shadow-brutal transition-shadow cursor-default"
          >
            <motion.div
              whileHover={{ rotate: 10 }}
              className="w-7 h-7 bg-[#f5e842] border-2 border-black rounded-lg flex items-center justify-center shrink-0"
            >
              <AlertTriangle size={13} strokeWidth={2.5} />
            </motion.div>
            <span className="text-sm text-gray-700 font-medium pt-0.5">{item}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}