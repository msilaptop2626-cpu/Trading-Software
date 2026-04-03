"""
yfinance data service.

Fetches OHLCV data for any ticker, filters to market hours,
and serialises into the format expected by lightweight-charts.

lightweight-charts candlestick series expects:
  { time: <unix_timestamp_seconds>, open, high, low, close }

Volume series expects:
  { time: <unix_timestamp_seconds>, value: <volume>, color: <"#26a69a"|"#ef5350"> }
"""

import yfinance as yf
import pandas as pd
from datetime import date, timedelta
from typing import Optional

from utils.market_hours import filter_market_hours, to_epoch

# Map UI interval labels to yfinance interval strings
INTERVAL_MAP: dict[str, str] = {
    "1m":  "1m",
    "2m":  "2m",
    "5m":  "5m",
    "15m": "15m",
    "30m": "30m",
    "1h":  "1h",
    "1d":  "1d",
}

# yfinance imposes limits on how far back intraday data goes per interval
MAX_PERIOD_DAYS: dict[str, int] = {
    "1m":  7,
    "2m":  60,
    "5m":  60,
    "15m": 60,
    "30m": 60,
    "1h":  730,
    "1d":  3650,
}


def _clamp_start(interval: str, start: date) -> date:
    """Clamp start date so it doesn't exceed yfinance's historical limits."""
    max_days = MAX_PERIOD_DAYS.get(interval, 60)
    earliest = date.today() - timedelta(days=max_days)
    return max(start, earliest)


def fetch_ohlcv(
    ticker: str,
    interval: str,
    start: date,
    end: Optional[date] = None,
) -> dict:
    """
    Download OHLCV data and return a dict with:
      {
        "candles": [{ time, open, high, low, close }, ...],
        "volume":  [{ time, value, color }, ...],
        "meta":    { ticker, interval, start, end, bars }
      }
    """
    if interval not in INTERVAL_MAP:
        raise ValueError(f"Unsupported interval '{interval}'. Choose from {list(INTERVAL_MAP)}")

    end_date = end or date.today()
    start_date = _clamp_start(interval, start)

    yf_interval = INTERVAL_MAP[interval]

    df: pd.DataFrame = yf.download(
        tickers=ticker,
        start=start_date.isoformat(),
        end=(end_date + timedelta(days=1)).isoformat(),  # end is exclusive in yfinance
        interval=yf_interval,
        auto_adjust=True,
        progress=False,
    )

    if df.empty:
        return {"candles": [], "volume": [], "meta": {"ticker": ticker, "interval": interval, "bars": 0}}

    # Flatten MultiIndex columns if present (happens with single ticker)
    if isinstance(df.columns, pd.MultiIndex):
        df.columns = df.columns.get_level_values(0)

    df.columns = [c.lower() for c in df.columns]

    # Filter to regular session for intraday intervals
    if interval != "1d":
        df = filter_market_hours(df)

    if df.empty:
        return {"candles": [], "volume": [], "meta": {"ticker": ticker, "interval": interval, "bars": 0}}

    timestamps = to_epoch(df.index)

    candles = [
        {
            "time":  t,
            "open":  round(float(row["open"]), 4),
            "high":  round(float(row["high"]), 4),
            "low":   round(float(row["low"]), 4),
            "close": round(float(row["close"]), 4),
        }
        for t, (_, row) in zip(timestamps, df.iterrows())
    ]

    volume = [
        {
            "time":  t,
            "value": int(row["volume"]),
            "color": "#26a69a" if row["close"] >= row["open"] else "#ef5350",
        }
        for t, (_, row) in zip(timestamps, df.iterrows())
    ]

    return {
        "candles": candles,
        "volume":  volume,
        "meta": {
            "ticker":   ticker,
            "interval": interval,
            "start":    start_date.isoformat(),
            "end":      end_date.isoformat(),
            "bars":     len(candles),
        },
    }
