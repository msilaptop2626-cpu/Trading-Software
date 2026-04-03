"""
Market hours utilities — filter OHLCV data to regular session only.
NYSE/NASDAQ regular session: 09:30–16:00 ET (America/New_York).
"""

from datetime import time
import pandas as pd

MARKET_OPEN = time(9, 30)
MARKET_CLOSE = time(16, 0)
MARKET_TZ = "America/New_York"


def filter_market_hours(df: pd.DataFrame) -> pd.DataFrame:
    """
    Given a DataFrame with a DatetimeIndex (tz-aware or tz-naive),
    return only rows that fall within 09:30–16:00 ET.
    """
    if df.empty:
        return df

    # Localise to ET if not already tz-aware
    if df.index.tz is None:
        df = df.tz_localize("UTC").tz_convert(MARKET_TZ)
    else:
        df = df.tz_convert(MARKET_TZ)

    mask = (df.index.time >= MARKET_OPEN) & (df.index.time <= MARKET_CLOSE)
    return df[mask]


def to_epoch(dt_index: pd.DatetimeIndex) -> list[int]:
    """Convert a DatetimeIndex to a list of Unix timestamps (seconds)."""
    return (dt_index.astype("int64") // 10**9).tolist()
