from __future__ import annotations

from pathlib import Path

try:
    from langchain_text_splitters import RecursiveCharacterTextSplitter
except ImportError:
    from langchain.text_splitter import RecursiveCharacterTextSplitter  # type: ignore

from rag.config import (
    CHROMA_DIR,
    CHUNK_OVERLAP,
    CHUNK_SIZE,
    COLLECTION_NAME,
    get_embeddings,
    load_api_key,
    resolve_legal_docs_dir,
)


def ingest() -> None:
    api_key = load_api_key()
    legal_docs_dir = resolve_legal_docs_dir()
    txt_files = sorted(legal_docs_dir.glob("*.txt"))

    if not txt_files:
        raise ValueError(f"No .txt files found in {legal_docs_dir}.")

    CHROMA_DIR.mkdir(parents=True, exist_ok=True)

    # Clear stale vectors so re-ingest does not mix old and new metadata.
    import shutil

    if any(CHROMA_DIR.iterdir()):
        shutil.rmtree(CHROMA_DIR)
        CHROMA_DIR.mkdir(parents=True, exist_ok=True)
        print("Cleared existing ChromaDB for fresh ingest.")

    try:
        from langchain_chroma import Chroma
    except Exception:  # noqa: BLE001
        from langchain_community.vectorstores import Chroma  # type: ignore

    embeddings, model_name = get_embeddings(api_key)
    print(f"Using embedding model: {model_name}")

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=CHUNK_SIZE,
        chunk_overlap=CHUNK_OVERLAP,
    )

    documents: list[str] = []
    metadatas: list[dict] = []

    for filepath in txt_files:
        print(f"Loading {filepath.name}...")
        text = filepath.read_text(encoding="utf-8").strip()
        if not text:
            print(f"  -> skipped (empty file)")
            continue

        chunks = splitter.split_text(text)
        documents.extend(chunks)
        metadatas.extend(
            [
                {
                    "source_file": filepath.name,
                    "source_path": str(filepath),
                    "chunk_index": i,
                }
                for i in range(len(chunks))
            ]
        )
        print(f"  -> {len(chunks)} chunks created")

    if not documents:
        raise ValueError("No text chunks were produced from the legal docs.")

    print(f"\nEmbedding {len(documents)} total chunks into ChromaDB...")
    Chroma.from_texts(
        texts=documents,
        embedding=embeddings,
        metadatas=metadatas,
        persist_directory=str(CHROMA_DIR),
        collection_name=COLLECTION_NAME,
    )
    print(f"Done. ChromaDB saved to {CHROMA_DIR}")


if __name__ == "__main__":
    ingest()
