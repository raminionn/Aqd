import { motion } from "framer-motion"
import { Code2 } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t-2 border-black bg-white mt-20">
      <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">

        <motion.div
          whileHover={{ x: 2 }}
          className="flex items-center gap-2 text-sm text-gray-500"
        >
          <div className="w-6 h-6 bg-[#f5c842] border-2 border-black rounded flex items-center justify-center">
            <Code2 size={12} strokeWidth={2.5} />
          </div>
          <span>Built by</span>
          <span className="font-bold text-black font-display">Rameen Arshad</span>
        </motion.div>

        <div className="flex items-center gap-3">
          <motion.a
            href="https://github.com/raminionn/Aqd"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ x: 2, y: 2, boxShadow: "2px 2px 0px 0px #000" }}
            whileTap={{ x: 4, y: 4, boxShadow: "0px 0px 0px 0px #000" }}
            initial={{ boxShadow: "4px 4px 0px 0px #000" }}
            className="flex items-center gap-2 px-3 py-1.5 bg-black text-white border-2 border-black rounded-lg text-xs font-bold transition-colors"
          >
            {/* simple inline GitHub icon SVG, no package dependency */}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            View on GitHub
          </motion.a>
          <span className="text-xs text-gray-400">
            Not a substitute for legal advice
          </span>
        </div>

      </div>
    </footer>
  )
}