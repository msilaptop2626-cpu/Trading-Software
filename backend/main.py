"""
FastAPI entry point.

Run locally:
  uvicorn main:app --reload --port 8000

The Vite dev server proxies /api/* to http://localhost:8000,
so the frontend never has to worry about CORS in dev.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.market_data import router as market_data_router

app = FastAPI(
    title="SP500 Chart API",
    description="Serves yfinance OHLCV data filtered to 09:30–16:00 ET market session.",
    version="1.0.0",
)

# Allow requests from the Vite dev server and any production origin.
# In production lock this down to your actual domain.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_methods=["GET"],
    allow_headers=["*"],
)

app.include_router(market_data_router)


@app.get("/health")
async def health():
    return {"status": "ok"}
