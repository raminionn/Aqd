from __future__ import annotations

import os
from pathlib import Path

from dotenv import load_dotenv

BACKEND_DIR = Path(__file__).resolve().parents[1]
RAG_DIR = Path(__file__).resolve().parent
CHROMA_DIR = BACKEND_DIR / "chroma_db"
COLLECTION_NAME = "pakistan_legal_docs"
CHUNK_SIZE = 500
CHUNK_OVERLAP = 50

EMBEDDING_MODEL_CANDIDATES = [
    "gemini-embedding-2",
    "models/gemini-embedding-2",
    "gemini-embedding-001",
    "models/gemini-embedding-001",
]


def load_api_key() -> str:
    load_dotenv(BACKEND_DIR / ".env")
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY is missing in backend/.env.")
    return api_key


def resolve_legal_docs_dir() -> Path:
    candidates = [
        RAG_DIR,
        RAG_DIR / "legal_docs",
        BACKEND_DIR / "context" / "legal_docs",
    ]
    for path in candidates:
        if path.is_dir() and any(path.glob("*.txt")):
            return path
    raise ValueError(
        "No legal docs found. Add .txt files under backend/rag/ or backend/context/legal_docs/."
    )


def get_embeddings(api_key: str | None = None):
    from langchain_google_genai import GoogleGenerativeAIEmbeddings

    key = api_key or load_api_key()
    last_err: Exception | None = None

    for candidate in EMBEDDING_MODEL_CANDIDATES:
        try:
            embeddings = GoogleGenerativeAIEmbeddings(model=candidate, google_api_key=key)
            embeddings.embed_query("ping")
            return embeddings, candidate
        except Exception as err:  # noqa: BLE001
            last_err = err

    raise RuntimeError(
        "Could not initialize Google embeddings with any supported model. "
        f"Last error: {last_err}"
    )


def get_chroma_store(*, api_key: str | None = None):
    try:
        from langchain_chroma import Chroma
    except Exception:  # noqa: BLE001
        from langchain_community.vectorstores import Chroma  # type: ignore

    if not CHROMA_DIR.exists():
        raise ValueError(
            "ChromaDB not found at backend/chroma_db/. Run: python -m rag.ingest"
        )

    embeddings, _ = get_embeddings(api_key)
    return Chroma(
        persist_directory=str(CHROMA_DIR),
        embedding_function=embeddings,
        collection_name=COLLECTION_NAME,
    )
