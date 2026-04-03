/**
 * Pure indicator calculations.
 * All functions accept an array of candle objects:
 *   { time, open, high, low, close }
 * and return an array of { time, value } or structured objects
 * ready for lightweight-charts series.
 */

// ── Helpers ────────────────────────────────────────────────────────────────

function closes(candles) {
  return candles.map((c) => c.close);
}

function avg(arr) {
  return arr.reduce((s, v) => s + v, 0) / arr.length;
}

// ── Simple / Exponential Moving Average ───────────────────────────────────

export function sma(candles, period) {
  const out = [];
  const cls = closes(candles);
  for (let i = period - 1; i < cls.length; i++) {
    out.push({
      time:  candles[i].time,
      value: round(avg(cls.slice(i - period + 1, i + 1))),
    });
  }
  return out;
}

export function ema(candles, period) {
  const out = [];
  const cls = closes(candles);
  const k = 2 / (period + 1);
  let prev = avg(cls.slice(0, period));

  out.push({ time: candles[period - 1].time, value: round(prev) });

  for (let i = period; i < cls.length; i++) {
    prev = cls[i] * k + prev * (1 - k);
    out.push({ time: candles[i].time, value: round(prev) });
  }
  return out;
}

// ── Bollinger Bands ───────────────────────────────────────────────────────

export function bollingerBands(candles, period = 20, stdDevMult = 2) {
  const upper = [], middle = [], lower = [];
  const cls = closes(candles);

  for (let i = period - 1; i < cls.length; i++) {
    const slice = cls.slice(i - period + 1, i + 1);
    const mean = avg(slice);
    const variance = slice.reduce((s, v) => s + (v - mean) ** 2, 0) / period;
    const sd = Math.sqrt(variance);
    const t = candles[i].time;
    upper.push({ time: t, value: round(mean + stdDevMult * sd) });
    middle.push({ time: t, value: round(mean) });
    lower.push({ time: t, value: round(mean - stdDevMult * sd) });
  }
  return { upper, middle, lower };
}

// ── VWAP (intraday, resets each day) ─────────────────────────────────────

export function vwap(candles) {
  const out = [];
  let cumVolume = 0;
  let cumTypPriceVol = 0;
  let lastDay = null;

  for (const c of candles) {
    // Reset at start of each new day (time is unix seconds)
    const day = Math.floor(c.time / 86400);
    if (day !== lastDay) {
      cumVolume = 0;
      cumTypPriceVol = 0;
      lastDay = day;
    }
    const typPrice = (c.high + c.low + c.close) / 3;
    cumVolume += c.volume ?? 0;
    cumTypPriceVol += typPrice * (c.volume ?? 0);
    out.push({
      time:  c.time,
      value: cumVolume > 0 ? round(cumTypPriceVol / cumVolume) : round(typPrice),
    });
  }
  return out;
}

// ── RSI ───────────────────────────────────────────────────────────────────

export function rsi(candles, period = 14) {
  const out = [];
  const cls = closes(candles);

  if (cls.length <= period) return out;

  let gains = 0, losses = 0;
  for (let i = 1; i <= period; i++) {
    const diff = cls[i] - cls[i - 1];
    if (diff > 0) gains += diff;
    else losses += Math.abs(diff);
  }

  let avgGain = gains / period;
  let avgLoss = losses / period;
  let rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
  out.push({ time: candles[period].time, value: round(100 - 100 / (1 + rs)) });

  for (let i = period + 1; i < cls.length; i++) {
    const diff = cls[i] - cls[i - 1];
    const gain = diff > 0 ? diff : 0;
    const loss = diff < 0 ? Math.abs(diff) : 0;
    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;
    rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    out.push({ time: candles[i].time, value: round(100 - 100 / (1 + rs)) });
  }
  return out;
}

// ── MACD ──────────────────────────────────────────────────────────────────

export function macd(candles, fast = 12, slow = 26, signal = 9) {
  const fastEma  = ema(candles, fast);
  const slowEma  = ema(candles, slow);

  // Align on time
  const slowMap = new Map(slowEma.map((p) => [p.time, p.value]));
  const macdLine = fastEma
    .filter((p) => slowMap.has(p.time))
    .map((p) => ({ time: p.time, value: round(p.value - slowMap.get(p.time)) }));

  // Signal line = EMA of MACD line
  const k = 2 / (signal + 1);
  let prev = avg(macdLine.slice(0, signal).map((p) => p.value));
  const signalLine = [{ time: macdLine[signal - 1].time, value: round(prev) }];

  for (let i = signal; i < macdLine.length; i++) {
    prev = macdLine[i].value * k + prev * (1 - k);
    signalLine.push({ time: macdLine[i].time, value: round(prev) });
  }

  // Histogram: MACD - Signal (align by time)
  const sigMap = new Map(signalLine.map((p) => [p.time, p.value]));
  const histogram = macdLine
    .filter((p) => sigMap.has(p.time))
    .map((p) => ({
      time:  p.time,
      value: round(p.value - sigMap.get(p.time)),
      color: p.value - sigMap.get(p.time) >= 0 ? '#26a69a' : '#ef5350',
    }));

  return { macdLine, signalLine, histogram };
}

// ── Util ──────────────────────────────────────────────────────────────────

function round(v, decimals = 4) {
  return Math.round(v * 10 ** decimals) / 10 ** decimals;
}
