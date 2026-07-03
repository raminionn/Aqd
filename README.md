
**Project Overview**

- **Name:** Aqd — Contract analysis assistant for Pakistan.
- **Purpose:** Help users quickly understand and assess contract text (PDF or images) with plain-English summaries, clause-level explanations, flagged risks, and suggested questions to ask before signing.
- **Stack:** Python FastAPI backend (analysis + RAG), a small React + Vite frontend, and a Chroma vector store for legal context retrieval.

**Quick Links**

- **Backend entrypoint:** [backend/main.py](backend/main.py)
- **Contract analysis logic:** `analyse_contract()` in [backend/analyser.py](backend/analyser.py)
- **Text/image extraction:** [backend/extractor.py](backend/extractor.py)
- **RAG ingestion & retrieval:** [backend/rag/ingest.py](backend/rag/ingest.py) and [backend/rag/retriever.py](backend/rag/retriever.py)
- **Frontend app:** [frontend](frontend)

**Why this project exists**

Contracts and agreements can be dense and full of legalese. Aqd is built to:

- Surface the key clauses and explain their meaning in simple English.
- Flag clauses that may be risky or require attention for people signing contracts in Pakistan.
- Provide relevant Pakistani legal context (from curated reference texts) when available.

This is informational only — not legal advice. Always consult a lawyer for binding decisions.

**Features**

- Upload a PDF or a contract photo (JPG/PNG) and receive:
	- A concise summary and disclaimer.
	- Clause-by-clause plain-English explanations.
	- Per-clause risk labels (`safe`, `watch_out`, `red_flag`) and reasons.
	- A short list of commonly missing clauses relevant to the document.
	- Practical questions to ask the other party or a lawyer.
- Uses a retrieval-augmented approach to ground assessments in curated Pakistani legal documents stored in `backend/chroma_db`.

**Quick Start (development)**

1. Backend (Python)

	 - Create a virtual environment and install dependencies:

	 ```bash
	 python -m venv .venv
	 .venv\Scripts\activate    # Windows
	 pip install -r backend/requirements.txt
	 ```

	 - Create a `.env` file in `backend/` with the following keys (you must provide these keys yourself):

		 - `GEMINI_API_KEY` — used for embeddings / image-text extraction in the RAG pipeline.
		 - `GROQ_API_KEY` — used by the Groq chat model client in `analyser.py`.

	 - Ingest the legal reference texts into ChromaDB (this will create/overwrite `backend/chroma_db`):

	 ```bash
	 python -m backend.rag.ingest
	 ```

	 - Run the FastAPI backend (from repository root):

	 ```bash
	 uvicorn backend.main:app --reload --port 8000
	 ```

	 - API endpoints:
		 - `GET /` — health/status.
		 - `POST /analyse` — upload a file (`multipart/form-data`) to analyse (PDF, JPG, PNG).
		 - `POST /analyse-text` — submit raw contract text via form field `text`.

	 - Example curl (text):

	 ```bash
	 curl -X POST http://localhost:8000/analyse-text -F "text=@contract.txt"
	 ```

2. Frontend (React + Vite)

	 - Install and run:

	 ```bash
	 cd frontend
	 npm install
	 npm run dev
	 ```

	 - The frontend talks to the backend API to upload files and show the analysis results.

**Where the pieces live**

- Backend API: [backend/main.py](backend/main.py) — FastAPI app with upload and analysis routes.
- Contract analysis orchestration: [backend/analyser.py](backend/analyser.py) — turns contract text into a grounded prompt, calls the model, and validates JSON output.
- PDF / image handling: [backend/extractor.py](backend/extractor.py) — extracts text from PDFs and validates images.
- RAG code & ingestion:
	- [backend/rag/config.py](backend/rag/config.py) — Chroma and embedding helper logic.
	- [backend/rag/ingest.py](backend/rag/ingest.py) — creates chunks and saves them to `backend/chroma_db`.
	- [backend/rag/retriever.py](backend/rag/retriever.py) — finds relevant legal chunks for a given contract.
- Prompts and rules: [backend/prompts.py](backend/prompts.py) — the human-facing prompt templates and output rules used to get structured JSON back from the model.

**Design notes & important behaviours**

- The analysis pipeline enforces strict anti-hallucination rules via the prompt in `prompts.py` and by combining retrieved legal context with the uploaded contract text.
- The model client in `analyser.py` expects the model to return strict JSON. The code performs cleaning and strict validation before returning results.
- The RAG pipeline relies on ChromaDB files under `backend/chroma_db`; if no DB is present, ingestion is required.
- Image OCR uses a cloud model (Gemini) to extract contract text. If extraction fails the API returns a helpful error.

**Environment & secrets**

- Required environment variables (backend/.env):
	- `GEMINI_API_KEY` — for Google GenAI embeddings and image extraction.
	- `GROQ_API_KEY` — for the Groq chat completion client used in `analyser.py`.

Keep these values secret. Do not commit `.env` to source control.

**Troubleshooting**

- ChromaDB missing or empty: run `python -m backend.rag.ingest` and ensure `backend/context/legal_docs` or `backend/rag/legal_docs` contains `.txt` reference files.
- Model returns invalid JSON: the backend will raise a validation error showing the raw model output. Check `backend/prompts.py` for the expected JSON shape.
- PDF text missing: scanned PDFs often contain no embedded text — try uploading a photo (JPG/PNG) or run OCR first.

**Extending the project**

- Add more Pakistani legal reference documents as `.txt` files under `backend/context/legal_docs` or `backend/rag/legal_docs` and re-run the ingest step.
- Swap or add embedding models in `backend/rag/config.py` by updating `EMBEDDING_MODEL_CANDIDATES`.
- Replace or extend the frontend UI in `frontend/src/components` to improve presentation and add export/printing features.

**Limitations & disclaimers**

- Aqd provides informational summaries and risk flags — it is NOT legal advice. Always consult a licensed lawyer for legal decisions.
- The system depends on third-party models and embeddings. Model outputs must be validated before relying on them for critical decisions.

**License & attribution**

This repository does not include a license file. If you plan to publish or reuse this code, add a `LICENSE` that fits your needs.



