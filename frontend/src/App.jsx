import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import UploadZone from "./components/UploadZone"
import TextInput from "./components/TextInput"
import AnalyseButton from "./components/AnalyseButton"
import Summary from "./components/Summary"
import ClauseCard from "./components/ClauseCard"
import MissingClauses from "./components/MissingClauses"
import Questions from "./components/Questions"
import LoadingScreen from "./components/LoadingScreen"
import Header from "./components/Header"
import Footer from "./components/Footer"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000"

export default function App() {
  const [file, setFile] = useState(null)
  const [text, setText] = useState("")
  const [mode, setMode] = useState("upload")
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)

  const canAnalyse = mode === "upload" ? !!file : text.trim().length > 50

  async function handleAnalyse() {
    if (!canAnalyse) return
    setLoading(true)
    setError(null)
    setResults(null)

    try {
      let res

      if (mode === "upload") {
        const formData = new FormData()
        formData.append("file", file)
        res = await fetch(`${API_URL}/analyse`, { method: "POST", body: formData })
      } else {
        const formData = new FormData()
        formData.append("text", text)
        res = await fetch(`${API_URL}/analyse-text`, { method: "POST", body: formData })
      }

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail || "Analysis failed")
      }

      const data = await res.json()
      setResults(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function handleReset() {
    setFile(null)
    setText("")
    setResults(null)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-[#faf7f2] flex flex-col">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-12 w-full flex-1">
        <AnimatePresence mode="wait">

          {!results && !loading && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Hero section */}
              <div className="text-center mb-12">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  whileHover={{ y: -2, scale: 1.02 }}
                  transition={{ delay: 0.1, duration: 0.35, ease: "easeOut" }}
                  className="inline-block mb-5"
                >
                  <span className="px-4 py-2 bg-[#f5c842] border-2 border-black rounded-full text-sm font-bold shadow-brutal inline-flex items-center gap-2 transition-all duration-150 ease-out hover:-translate-y-0.5 hover:shadow-[0_8px_0_rgba(0,0,0,1)]">
                    <span className="w-2 h-2 bg-black rounded-full animate-pulse"></span>
                    Built for Pakistan — Powered by Gemini AI
                  </span>
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.015 }}
                  transition={{ delay: 0.2, duration: 0.16, ease: "easeOut" }}
                  className="group font-display text-5xl sm:text-6xl font-extrabold text-black leading-tight mb-5 cursor-default"
                >
                  Know what you're
                  <br />
                  <span className="relative inline-block mt-1">
                    <span className="absolute bottom-1 left-0 w-full h-4 bg-[#f5c842] -rotate-1" />
                    <span className="relative inline-block transition-colors duration-150 ease-out group-hover:text-[#b8860b]">
                      signing.
                    </span>
                  </span>
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.35 }}
                  className="text-gray-500 text-lg max-w-lg mx-auto leading-relaxed"
                >
                  Upload or paste any contract. Get a plain-English breakdown
                  of every clause, risk, and red flag — grounded in Pakistani law.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}
                  className="flex flex-wrap justify-center gap-2 mt-6"
                >
                  {[
                    { label: "Pakistani Law" },
                    { label: "Clause Breakdown" },
                    { label: "Risk Detection" },
                    { label: "Questions to Ask" },
                    { label: "Works on Photos" },
                  ].map((tag, i) => (
                    <motion.span
                      key={tag.label}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ y: -2, scale: 1.02 }}
                      transition={{
                        opacity: { delay: 0.5 + i * 0.04, duration: 0.16, ease: "easeOut" },
                        scale: { delay: 0.5 + i * 0.04, duration: 0.16, ease: "easeOut" },
                      }}
                      whileTap={{ scale: 0.98 }}
                      className="px-3 py-1.5 bg-white border-2 border-black rounded-lg text-sm font-semibold shadow-brutal cursor-default"
                    >
                      {tag.label}
                    </motion.span>
                  ))}
                </motion.div>
              </div>

              {/* Mode switcher */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex bg-white border-2 border-black rounded-xl p-1 mb-4 shadow-brutal"
              >
                {[
                  { id: "upload", label: "Upload File" },
                  { id: "text",   label: "Paste Text" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => { setMode(tab.id); setError(null) }}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-colors duration-150 ease-out relative ${
                      mode === tab.id
                        ? "bg-black text-white"
                        : "text-gray-500 hover:text-black"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </motion.div>

              <AnimatePresence mode="wait">
                {mode === "upload" ? (
                  <motion.div
                    key="upload-zone"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <UploadZone file={file} onFileSelect={setFile} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="text-zone"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <TextInput text={text} setText={setText} />
                  </motion.div>
                )}
              </AnimatePresence>

              {canAnalyse && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <AnalyseButton onClick={handleAnalyse} loading={loading} />
                </motion.div>
              )}

              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-4 p-4 bg-[#ffdddd] border-2 border-black rounded-xl shadow-brutal text-sm font-medium flex items-start gap-2"
                >
                  <span className="mt-0.5">⚠</span>
                  <span>{error}</span>
                </motion.div>
              )}

              {/* How it works */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="mt-16"
              >
                <p className="text-center text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">
                  How it works
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { step: "01", title: "Upload or paste", desc: "Drop a PDF, photo, or paste contract text directly" },
                    { step: "02", title: "AI reads Pakistani law", desc: "Retrieves relevant legal context from our knowledge base" },
                    { step: "03", title: "Get your breakdown", desc: "Every clause explained, risks flagged, questions suggested" },
                  ].map((item, i) => (
                    <motion.div
                      key={item.step}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ y: -3, scale: 1.015 }}
                      transition={{
                        opacity: { delay: 0.75 + i * 0.1, duration: 0.24, ease: "easeOut" },
                        y: { delay: 0.75 + i * 0.1, duration: 0.24, ease: "easeOut" },
                        scale: { duration: 0.15, ease: "easeOut" },
                      }}
                      className="bg-white border-2 border-black rounded-xl p-5 shadow-brutal"
                    >
                      <span className="text-3xl font-extrabold font-display text-[#f5c842]">{item.step}</span>
                      <p className="font-bold mt-2 mb-1">{item.title}</p>
                      <p className="text-gray-500 text-sm">{item.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}

          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <LoadingScreen />
            </motion.div>
          )}

          {results && !loading && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <motion.h2
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="font-display text-3xl font-extrabold"
                  >
                    Analysis Complete
                  </motion.h2>
                  <p className="text-gray-500 text-sm mt-1">
                    Here is what we found in your contract
                  </p>
                </div>
                <motion.button
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={handleReset}
                  whileHover={{ x: 2, y: 2, boxShadow: "2px 2px 0px 0px #000" }}
                  whileTap={{ x: 4, y: 4, boxShadow: "0px 0px 0px 0px #000" }}
                  transition={{ duration: 0.12, ease: "easeOut" }}
                  className="px-4 py-2 bg-white border-2 border-black rounded-xl font-bold text-sm shadow-brutal"
                >
                  ← New analysis
                </motion.button>
              </div>

              <div className="space-y-6">
                <Summary summary={results.summary} contractType={results.contract_type} />

                <div>
                  <h3 className="font-display text-xl font-bold mb-3">
                    Clause Breakdown
                    <span className="ml-2 px-2.5 py-0.5 bg-black text-white text-sm rounded-lg font-normal">
                      {results.clauses.length}
                    </span>
                  </h3>
                  <div className="space-y-3">
                    {results.clauses.map((clause, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.06 }}
                      >
                        <ClauseCard {...clause} />
                      </motion.div>
                    ))}
                  </div>
                </div>

                <MissingClauses items={results.missing_clauses} />
                <Questions items={results.questions_to_ask} />
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      <Footer />
    </div>
  )
}