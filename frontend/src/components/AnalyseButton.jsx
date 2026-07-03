import { motion } from "framer-motion"
import { Zap, Loader2 } from "lucide-react"

export default function AnalyseButton({ onClick, loading }) {
  return (
    <motion.button
      onClick={onClick}
      disabled={loading}
      whileHover={!loading ? {
        x: 3, y: 3,
        boxShadow: "3px 3px 0px 0px #000",
        backgroundColor: "#f0bc30",
      } : {}}
      whileTap={!loading ? { x: 6, y: 6, boxShadow: "0px 0px 0px 0px #000" } : {}}
      initial={{ boxShadow: "6px 6px 0px 0px #000" }}
      className="mt-4 w-full py-4 px-6 bg-[#f5c842] border-2 border-black rounded-xl
                 font-display font-extrabold text-lg text-black
                 flex items-center justify-center gap-2
                 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
    >
      {loading
        ? <><Loader2 size={20} className="animate-spin" /> Analysing...</>
        : <><Zap size={20} strokeWidth={2.5} fill="black" /> Analyse Contract</>
      }
    </motion.button>
  )
}