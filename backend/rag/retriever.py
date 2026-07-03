from __future__ import annotations

from rag.config import get_chroma_store

MAX_QUERY_CHARS = 8000


def get_legal_context(contract_text: str, *, k: int = 5) -> str:
    if not contract_text or not contract_text.strip():
        raise ValueError("Legal retrieval failed: contract_text is empty.")

    query = contract_text.strip()
    if len(query) > MAX_QUERY_CHARS:
        query = query[:MAX_QUERY_CHARS]

    vectorstore = get_chroma_store()

    try:
        docs = vectorstore.similarity_search(query, k=k)
    except Exception as e:  # noqa: BLE001
        raise ValueError(f"Legal retrieval failed: similarity search error ({e}).") from e

    if not docs:
        raise ValueError(
            "Legal retrieval failed: no relevant legal context found. "
            "Run: python -m rag.ingest"
        )

    parts: list[str] = []
    for idx, doc in enumerate(docs, start=1):
        meta = getattr(doc, "metadata", {}) or {}
        source = meta.get("source_file") or meta.get("source") or meta.get("source_path") or "unknown"
        chunk_index = meta.get("chunk_index", "?")
        text = (getattr(doc, "page_content", "") or "").strip()

        parts.append(
            "\n".join(
                [
                    f"=== Legal Chunk {idx} (source: {source}, chunk: {chunk_index}) ===",
                    text,
                ]
            ).strip()
        )

    return "\n\n".join(parts).strip()
