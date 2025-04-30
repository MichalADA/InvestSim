# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

from app.core.config import settings
from app.core.db import init_mongodb
from app.api import auth, portfolio, transactions, market_data

# Konfiguracja loggera
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# Inicjalizacja aplikacji FastAPI
app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Konfiguracja CORS
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Event przy starcie aplikacji
@app.on_event("startup")
async def startup_db_client():
    logger.info("Inicjalizacja aplikacji...")
    await init_mongodb()

# Rejestracja routerów API
app.include_router(
    auth.router,
    prefix=f"{settings.API_V1_STR}/auth",
    tags=["auth"]
)

app.include_router(
    portfolio.router,
    prefix=f"{settings.API_V1_STR}/portfolios",
    tags=["portfolios"]
)

app.include_router(
    transactions.router,
    prefix=f"{settings.API_V1_STR}/transactions",
    tags=["transactions"]
)

app.include_router(
    market_data.router,
    prefix=f"{settings.API_V1_STR}/market",
    tags=["market_data"]
)

@app.get("/")
async def root():
    """
    Endpoint powitalny
    """
    return {
        "message": "Witaj w API InvestSim!",
        "version": "0.1.0",
        "docs": f"{settings.API_V1_STR}/docs"
    }

@app.get("/health")
async def health_check():
    """
    Endpoint do sprawdzania stanu aplikacji
    """
    return {
        "status": "ok",
        "api_version": "0.1.0"
    }

# Uruchomienie aplikacji (w przypadku bezpośredniego wywołania pliku)
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)