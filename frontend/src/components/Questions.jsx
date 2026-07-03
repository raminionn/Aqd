import { motion } from "framer-motion"
import { MessageCircle } from "lucide-react"

export default function Questions({ items }) {
  if (!items || items.length === 0) return null

  return (
    <div className="mb-10">
      <h3 className="font-display text-xl font-bold mb-1">
        Questions to Ask
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="ml-2 px-2.5 py-0.5 bg-[#a0d4f5] border-2 border-black text-sm rounded-lg font-normal inline-block"
        >
          {items.length}
        </motion.span>
      </h3>
      <p className="text-gray-400 text-sm mb-3 font-medium">
        Ask these before you sign anything.
      </p>
      <div className="space-y-2">
        {items.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            whileHover={{ x: 4, boxShadow: "4px 4px 0px 0px #000" }}
            className="flex gap-4 bg-white border-2 border-black rounded-xl p-4 shadow-brutal transition-shadow cursor-default"
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="w-7 h-7 bg-[#a0d4f5] border-2 border-black rounded-lg flex items-center justify-center shrink-0"
            >
              <MessageCircle size={13} strokeWidth={2.5} />
            </motion.div>
            <span className="text-sm text-gray-700 leading-relaxed pt-0.5">{item}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}