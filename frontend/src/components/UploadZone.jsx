import { useRef, useState } from "react"
import { motion } from "framer-motion"
import { Upload, FileText, X, Image } from "lucide-react"

export default function UploadZone({ file, onFileSelect }) {
  const inputRef = useRef()
  const [dragging, setDragging] = useState(false)

  function handleDrop(e) {
    e.preventDefault()
    setDragging(false)
    const dropped = e.dataTransfer.files[0]
    if (dropped) onFileSelect(dropped)
  }

  const isImage = file && file.type.startsWith("image/")

  return (
    <motion.div
      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => !file && inputRef.current.click()}
      animate={{
        scale: dragging ? 1.01 : 1,
        borderColor: dragging ? "#f5c842" : file ? "#22c55e" : "#000000",
        backgroundColor: dragging ? "#fffde0" : file ? "#f0fff4" : "#ffffff",
      }}
      whileHover={!file ? { boxShadow: "8px 8px 0px 0px #000" } : {}}
      className="border-2 border-black rounded-2xl p-12 text-center cursor-pointer shadow-brutal-lg transition-shadow"
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        className="hidden"
        onChange={(e) => onFileSelect(e.target.files[0])}
      />

      {file ? (
        <div className="flex flex-col items-center gap-4">
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="w-16 h-16 bg-[#c8f5a0] border-2 border-black rounded-xl shadow-brutal flex items-center justify-center"
          >
            {isImage
              ? <Image size={28} strokeWidth={2} />
              : <FileText size={28} strokeWidth={2} />
            }
          </motion.div>
          <div>
            <p className="font-display font-bold text-lg">{file.name}</p>
            <p className="text-gray-400 text-sm mt-0.5">
              {(file.size / 1024 / 1024).toFixed(2)} MB · Ready to analyse
            </p>
          </div>
          <motion.button
            onClick={(e) => { e.stopPropagation(); onFileSelect(null) }}
            whileHover={{ x: 2, y: 2, boxShadow: "2px 2px 0px 0px #000" }}
            whileTap={{ x: 3, y: 3, boxShadow: "0px 0px 0px 0px #000" }}
            initial={{ boxShadow: "4px 4px 0px 0px #000" }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border-2 border-black rounded-lg text-sm font-semibold transition-all"
          >
            <X size={14} /> Remove file
          </motion.button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-16 h-16 bg-[#f5c842] border-2 border-black rounded-xl shadow-brutal flex items-center justify-center"
          >
            <Upload size={28} strokeWidth={2.5} />
          </motion.div>
          <div>
            <p className="font-display font-bold text-xl">Drop your contract here</p>
            <p className="text-gray-400 mt-1 text-sm">or click to browse your files</p>
          </div>
          <div className="flex gap-2">
            {["PDF", "JPG", "PNG"].map((fmt, i) => (
              <motion.span
                key={fmt}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -2, boxShadow: "3px 3px 0px 0px #000" }}
                className="px-3 py-1 bg-[#f0f0f0] border-2 border-black rounded-lg text-xs font-extrabold shadow-brutal cursor-default transition-all"
              >
                {fmt}
              </motion.span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}