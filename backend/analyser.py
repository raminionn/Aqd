from __future__ import annotations

import io
import json
import os
import re
from pathlib import Path

from dotenv import load_dotenv
from groq import Groq
from prompts import CONTRACT_ANALYSIS_PROMPT, IMAGE_ANALYSIS_PROMPT
from rag.retriever import get_legal_context

load_dotenv(Path(__file__).parent / ".env")

groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))

REQUIRED_KEYS = {
    "summary",
    "contract_type",
    "clauses",
    "missing_clauses",
    "questions_to_ask",
}
VALID_RISKS = {"safe", "watch_out", "red_flag"}


def clean_json(text: str) -> str:
    text = text.strip()
    text = re.sub(r"^```json\s*", "", text, flags=re.IGNORECASE)
    text = re.sub(r"^```\s*", "", text)
    text = re.sub(r"\s*```$", "", text)
    return text.strip()


def validate_analysis(result: dict) -> dict:
    missing = REQUIRED_KEYS - result.keys()
    if missing:
        raise ValueError(f"Response missing keys: {', '.join(sorted(missing))}")

    if not isinstance(result["clauses"], list):
        raise ValueError("'clauses' must be an array.")

    for i, clause in enumerate(result["clauses"]):
        if not isinstance(clause, dict):
            raise ValueError(f"Clause {i} is not an object.")
        for field in ("clause", "plain_english", "risk", "reason"):
            if field not in clause:
                raise ValueError(f"Clause {i} missing '{field}'.")
        if clause["risk"] not in VALID_RISKS:
            clause["risk"] = "watch_out"

    for field in ("missing_clauses", "questions_to_ask"):
        if not isinstance(result[field], list):
            raise ValueError(f"'{field}' must be an array.")

    return result


def extract_text_from_image(image_bytes: bytes) -> str:
    import warnings
    try:
        import google.genai as genai
        if not hasattr(genai, "configure"):
            raise ImportError
    except Exception:
        import warnings
        warnings.filterwarnings("ignore", category=FutureWarning)
        import google.generativeai as genai

    import PIL.Image

    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
    vision_model = genai.GenerativeModel(
        "gemini-2.0-flash",
        generation_config={"temperature": 0.1}
    )
    image = PIL.Image.open(io.BytesIO(image_bytes))
    response = vision_model.generate_content([IMAGE_ANALYSIS_PROMPT, image])
    text = (response.text or "").strip()

    if not text:
        raise ValueError(
            "Could not extract text from this image. "
            "Try uploading a clearer photo."
        )
    return text


def analyse_contract(
    contract_text: str | None = None,
    image_bytes: bytes | None = None
) -> dict:
    if not contract_text and not image_bytes:
        raise ValueError("No contract input provided.")

    if image_bytes:
        contract_text = extract_text_from_image(image_bytes)

    if not contract_text or not contract_text.strip():
        raise ValueError("Contract text is empty.")

    legal_context = get_legal_context(contract_text)

    prompt = CONTRACT_ANALYSIS_PROMPT.format(
        legal_context=legal_context,
        contract_text=contract_text,
    )

    response = groq_client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are an expert contract lawyer specialising in Pakistani law. "
                    "You always respond with valid JSON only — no markdown, "
                    "no explanation, no backticks, just raw JSON."
                )
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.1,
        max_tokens=4000,
    )

    raw = response.choices[0].message.content or ""
    cleaned = clean_json(raw)

    try:
        result = json.loads(cleaned)
    except json.JSONDecodeError as e:
        raise ValueError(
            f"Model returned invalid JSON: {e}\nRaw: {cleaned[:500]}"
        ) from e

    return validate_analysis(result)