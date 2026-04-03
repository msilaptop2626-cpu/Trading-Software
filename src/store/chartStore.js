/**
 * Global chart state — Zustand store.
 *
 * Holds user selections (ticker, interval, date range, active indicators)
 * plus the raw server data and derived loading/error state.
 */

import { create } from 'zustand';

const today = () => new Date().toISOString().slice(0, 10);
const daysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
};

export const useChartStore = create((set, get) => ({
  // ── User selections ──────────────────────────────────────────────
  ticker:   '^GSPC',
  interval: '5m',
  startDate: daysAgo(5),
  endDate:   today(),

  // Active overlays on the main price chart
  overlays: {
    ema9:   false,
    ema20:  true,
    ema50:  false,
    sma200: false,
    bbands: false,
    vwap:   false,
  },

  // Active sub-panels below the main chart
  panels: {
    volume: true,
    rsi:    false,
    macd:   false,
  },

  // RSI / MACD settings
  rsiPeriod:    14,
  macdFast:     12,
  macdSlow:     26,
  macdSignal:   9,
  bbandsStdDev: 2,
  bbandsPeriod: 20,

  // ── Server data ──────────────────────────────────────────────────
  candles:  [],   // [{ time, open, high, low, close }]
  volume:   [],   // [{ time, value, color }]
  meta:     null, // { ticker, interval, start, end, bars }

  loading: false,
  error:   null,

  // ── Actions ──────────────────────────────────────────────────────
  setTicker:    (ticker)    => set({ ticker }),
  setInterval:  (interval)  => set({ interval }),
  setStartDate: (startDate) => set({ startDate }),
  setEndDate:   (endDate)   => set({ endDate }),

  toggleOverlay: (key) =>
    set((s) => ({ overlays: { ...s.overlays, [key]: !s.overlays[key] } })),

  togglePanel: (key) =>
    set((s) => ({ panels: { ...s.panels, [key]: !s.panels[key] } })),

  setRsiPeriod:    (v) => set({ rsiPeriod: v }),
  setMacdParams:   (fast, slow, signal) => set({ macdFast: fast, macdSlow: slow, macdSignal: signal }),
  setBbandsParams: (period, stddev) => set({ bbandsPeriod: period, bbandsStdDev: stddev }),

  setData:    ({ candles, volume, meta }) => set({ candles, volume, meta, loading: false, error: null }),
  setLoading: (loading) => set({ loading }),
  setError:   (error)   => set({ error, loading: false }),
}));
