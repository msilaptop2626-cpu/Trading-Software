/**
 * useMarketData — fetches OHLCV data from the FastAPI backend.
 *
 * Reads selections from chartStore and writes results back.
 * Call `refresh()` to trigger a new fetch.
 */

import { useCallback } from 'react';
import { useChartStore } from '../store/chartStore';

const BASE = '/api/market-data';

export function useMarketData() {
  const { ticker, interval, startDate, endDate, setData, setLoading, setError } =
    useChartStore();

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams({
      ticker,
      interval,
      start: startDate,
      end:   endDate,
    });

    try {
      const res = await fetch(`${BASE}/ohlcv?${params}`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.detail ?? `HTTP ${res.status}`);
      }
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err.message);
    }
  }, [ticker, interval, startDate, endDate, setData, setLoading, setError]);

  return { refresh };
}
