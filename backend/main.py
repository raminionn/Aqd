from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from extractor import extract_pdf, extract_image
from analyser import analyse_contract

app = FastAPI(title="Aqd API", description="Contract analysis for Pakistan")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"status": "Aqd backend running"}


@app.post("/analyse")
async def analyse(file: UploadFile = File(...)):
    try:
        file_bytes = await file.read()
        filename = file.filename.lower()

        if filename.endswith(".pdf"):
            contract_text = extract_pdf(file_bytes)
            result = analyse_contract(contract_text=contract_text)

        elif filename.endswith((".jpg", ".jpeg", ".png")):
            image_bytes = extract_image(file_bytes)
            result = analyse_contract(image_bytes=image_bytes)

        else:
            raise HTTPException(
                status_code=400,
                detail="Unsupported file type. Upload a PDF, JPG, or PNG."
            )

        return JSONResponse(content=result)

    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


@app.post("/analyse-text")
async def analyse_text(text: str = Form(...)):
    try:
        if len(text.split()) > 8000:
            raise HTTPException(
                status_code=400,
                detail="Text exceeds 8000 word limit. Please upload a PDF instead."
            )
        if len(text.strip()) < 50:
            raise HTTPException(
                status_code=400,
                detail="Text is too short to analyse."
            )
        result = analyse_contract(contract_text=text)
        return JSONResponse(content=result)

    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")