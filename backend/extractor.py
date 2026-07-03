from __future__ import annotations

import io

import fitz
from PIL import Image, UnidentifiedImageError


def extract_pdf(file_bytes: bytes) -> str:
    if not file_bytes:
        raise ValueError("PDF extraction failed: file is empty.")

    try:
        pdf = fitz.open(stream=file_bytes, filetype="pdf")
    except Exception as e:
        raise ValueError(f"PDF extraction failed: could not open file ({e}).") from e

    try:
        if pdf.page_count == 0:
            raise ValueError("PDF extraction failed: PDF has no pages.")

        text_parts: list[str] = []
        for i, page in enumerate(pdf):
            text = (page.get_text("text") or "").strip()
            if text:
                text_parts.append(f"--- Page {i + 1} ---\n{text}")

        if not text_parts:
            raise ValueError(
                "No text found in this PDF. It may be scanned — "
                "try uploading it as a JPG or PNG photo instead."
            )
        return "\n\n".join(text_parts)
    finally:
        pdf.close()


def extract_image(file_bytes: bytes) -> bytes:
    if not file_bytes:
        raise ValueError("Image validation failed: file is empty.")

    try:
        img = Image.open(io.BytesIO(file_bytes))
        img.verify()
    except UnidentifiedImageError as e:
        raise ValueError(
            "Could not read image. Upload a clear JPG or PNG."
        ) from e
    except Exception as e:
        raise ValueError(f"Could not read image ({e}).") from e

    return file_bytes
