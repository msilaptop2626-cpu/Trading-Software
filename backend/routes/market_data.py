"""
/api/market-data routes.

GET /api/market-data/ohlcv
  Query params:
    ticker   (str)  default="^GSPC"   — yfinance symbol (^GSPC = S&P 500)
    interval (str)  default="5m"      — 1m | 2m | 5m | 15m | 30m | 1h | 1d
    start    (date) default=today-5d  — YYYY-MM-DD
    end      (date) default=today     — YYYY-MM-DD

GET /api/market-data/tickers
  Returns a hard-coded list of popular tickers for the search UI.
"""

from datetime import date, timedelta
from typing import Optional

from fastapi import APIRouter, HTTPException, Query

from services.yfinance_service import fetch_ohlcv, INTERVAL_MAP

router = APIRouter(prefix="/api/market-data", tags=["market-data"])

POPULAR_TICKERS = [
    {"symbol": "^GSPC",  "name": "S&P 500"},
    {"symbol": "^NDX",   "name": "Nasdaq-100"},
    {"symbol": "^DJI",   "name": "Dow Jones"},
    {"symbol": "^RUT",   "name": "Russell 2000"},
    {"symbol": "SPY",    "name": "SPDR S&P 500 ETF"},
    {"symbol": "QQQ",    "name": "Invesco QQQ ETF"},
    {"symbol": "IWM",    "name": "iShares Russell 2000 ETF"},
    {"symbol": "AAPL",   "name": "Apple"},
    {"symbol": "MSFT",   "name": "Microsoft"},
    {"symbol": "NVDA",   "name": "NVIDIA"},
    {"symbol": "TSLA",   "name": "Tesla"},
    {"symbol": "AMZN",   "name": "Amazon"},
]


@router.get("/ohlcv")
async def get_ohlcv(
    ticker: str = Query("^GSPC", description="yfinance symbol"),
    interval: str = Query("5m", description=f"One of: {', '.join(INTERVAL_MAP)}"),
    start: Optional[date] = Query(None, description="Start date YYYY-MM-DD"),
    end: Optional[date] = Query(None, description="End date YYYY-MM-DD"),
):
    """Download OHLCV bars filtered to 09:30–16:00 ET market session."""
    if start is None:
        start = date.today() - timedelta(days=5)
    if end is None:
        end = date.today()

    if start > end:
        raise HTTPException(status_code=400, detail="start must be before end")

    try:
        data = fetch_ohlcv(ticker=ticker, interval=interval, start=start, end=end)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Data fetch failed: {exc}")

    return data


@router.get("/tickers")
async def get_tickers():
    """Return popular ticker list for the search/autocomplete UI."""
    return {"tickers": POPULAR_TICKERS}


@router.get("/intervals")
async def get_intervals():
    """Return supported interval options."""
    return {
        "intervals": [
            {"value": "1m",  "label": "1 min"},
            {"value": "2m",  "label": "2 min"},
            {"value": "5m",  "label": "5 min"},
            {"value": "15m", "label": "15 min"},
            {"value": "30m", "label": "30 min"},
            {"value": "1h",  "label": "1 hour"},
            {"value": "1d",  "label": "Daily"},
        ]
    }
