import { motion } from "framer-motion"
import { FileSearch } from "lucide-react"

export default function Header() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="border-b-2 border-black bg-white px-6 py-4 sticky top-0 z-50"
    >
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ rotate: -8, scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="w-10 h-10 bg-[#f5c842] border-2 border-black rounded-xl shadow-brutal flex items-center justify-center cursor-pointer"
          >
            <FileSearch size={20} strokeWidth={2.5} />
          </motion.div>
          <div>
            <h1 className="font-display font-extrabold text-2xl tracking-tight leading-none">
              <motion.span
                whileHover={{ scale: 1.05, color: "#b8860b" }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="inline-block transition-colors duration-150"
              >
                AQD
              </motion.span>{" "}
              <span className="text-gray-400 font-normal text-xl">عقد</span>
            </h1>
            <p className="text-xs text-gray-400 font-medium">
              Contract Intelligence · Pakistan
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <motion.span
            whileHover={{ y: -2, boxShadow: "4px 4px 0px 0px #000" }}
            transition={{ type: "spring", stiffness: 400 }}
            className="hidden sm:flex px-3 py-1.5 bg-[#c8f5a0] border-2 border-black rounded-lg text-xs font-bold shadow-brutal items-center gap-1.5 cursor-default"
          >
            <motion.span
              animate={{ scale: [1, 1.4, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-green-600 rounded-full inline-block"
            />
            Free to use
          </motion.span>
          <motion.span
            whileHover={{ y: -2, boxShadow: "4px 4px 0px 0px #000" }}
            transition={{ type: "spring", stiffness: 400 }}
            className="hidden sm:flex px-3 py-1.5 bg-[#a0d4f5] border-2 border-black rounded-lg text-xs font-bold shadow-brutal cursor-default"
          >
            RAG + Groq AI
          </motion.span>
        </div>
      </div>
    </motion.header>
  )
}