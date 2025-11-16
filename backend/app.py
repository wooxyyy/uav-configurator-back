from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from backend.domain.entities import UAVInput, UAVResponse
from backend.services.uav_service import configure_uav
from backend.utils.exceptions import ValidationError

app = FastAPI(
    title="UAV Configurator API",
    version="1.0.0",
    description="API для розрахунку характеристик БПЛА (ГМГ, тяга, потужність, час польоту)",
)
origins = [
    "http://localhost:8000",
    "http://127.0.0.1:8000",
    "http://localhost",
    "http://0.0.0.0:8000",
    "https://streetless-heidy-folkish.ngrok-free.dev",
    "http://127.0.0.1:4040",
    "*",   # ← тимчасово, поки розробка (можемо забрати)
]

# CORS, щоб фронтенд міг стукатися з браузера
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,   # на проді краще обмежити доменом фронтенду
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(ValidationError)
async def validation_exception_handler(request: Request, exc: ValidationError):
    """
    Користувацька помилка валідації з наших validators.py
    """
    return JSONResponse(
        status_code=400,
        content={"error": "ValidationError", "message": exc.message},
    )


@app.post("/configure", response_model=UAVResponse)
async def configure(request: UAVInput):
    """
    Основний endpoint:
    приймає UAVInput, повертає UAVResponse з усіма розрахунками та поясненнями.
    """
    result_dict = configure_uav(request.dict())
    return result_dict
