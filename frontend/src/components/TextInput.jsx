import { motion } from "framer-motion"
import { FileText, X } from "lucide-react"

const MAX_WORDS = 8000

export default function TextInput({ text, setText }) {
  const wordCount = text.trim() === "" ? 0 : text.trim().split(/\s+/).length
  const isOverLimit = wordCount > MAX_WORDS
  const percentage = Math.min((wordCount / MAX_WORDS) * 100, 100)

  return (
    <div className="bg-white border-2 border-black rounded-2xl shadow-brutal-lg overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b-2 border-black bg-[#faf7f2]">
        <div className="flex items-center gap-2">
          <FileText size={16} strokeWidth={2.5} />
          <span className="text-sm font-bold">Paste contract text</span>
        </div>
        {text && (
          <button
            onClick={() => setText("")}
            className="flex items-center gap-1 px-2 py-1 bg-white border-2 border-black rounded-lg text-xs font-medium shadow-brutal hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
          >
            <X size={12} /> Clear
          </button>
        )}
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste your contract text here... Job offers, rental agreements, NDAs, freelance contracts — any contract text works."
        rows={12}
        className="w-full px-5 py-4 text-sm text-gray-700 leading-relaxed resize-none outline-none placeholder:text-gray-400"
      />

      <div className="px-5 py-3 border-t-2 border-black bg-[#faf7f2] flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1 mr-4">
          <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              animate={{ width: `${percentage}%` }}
              className={`h-full rounded-full transition-colors ${
                isOverLimit ? "bg-red-500" : percentage > 75 ? "bg-[#f5c842]" : "bg-[#22c55e]"
              }`}
            />
          </div>
        </div>
        <span className={`text-xs font-bold ${isOverLimit ? "text-red-500" : "text-gray-400"}`}>
          {wordCount.toLocaleString()} / {MAX_WORDS.toLocaleString()} words
          {isOverLimit && " — too long"}
        </span>
      </div>
    </div>
  )
}