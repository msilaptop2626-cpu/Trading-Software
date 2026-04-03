/**
 * PriceChart — candlestick chart with overlay series.
 *
 * lightweight-charts v4 API:
 *   chart.addSeries(CandlestickSeries, opts)  ← NOT addCandlestickSeries()
 *   chart.addSeries(LineSeries, opts)          ← NOT addLineSeries()
 *
 * Overlay colours:
 *   EMA 9   → #f0c35a  (gold)
 *   EMA 20  → #4e9ff2  (blue)
 *   EMA 50  → #e05fac  (pink)
 *   SMA 200 → #9b59b6  (purple)
 *   BB bands → #3d8ebb dashed
 *   VWAP    → #26c2a4  (teal)
 */

import { useEffect, useRef } from 'react';
import {
  createChart,
  CrosshairMode,
  LineStyle,
  CandlestickSeries,
  LineSeries,
} from 'lightweight-charts';
import { useChartStore } from '../../store/chartStore';
import { useIndicators } from '../../hooks/useIndicators';

const CHART_OPTS = {
  layout: {
    background: { color: '#0d0f1a' },
    textColor:  '#8892a4',
  },
  grid: {
    vertLines: { color: '#1a1d2e' },
    horzLines: { color: '#1a1d2e' },
  },
  crosshair: { mode: CrosshairMode.Normal },
  rightPriceScale: { borderColor: '#2a2d3e' },
  timeScale: {
    borderColor:    '#2a2d3e',
    timeVisible:    true,
    secondsVisible: false,
  },
};

const CANDLE_OPTS = {
  upColor:         '#26a69a',
  downColor:       '#ef5350',
  borderUpColor:   '#26a69a',
  borderDownColor: '#ef5350',
  wickUpColor:     '#26a69a',
  wickDownColor:   '#ef5350',
};

const LINE_BASE = { lineWidth: 1, lastValueVisible: false, priceLineVisible: false };

export default function PriceChart({ height = 420 }) {
  const containerRef = useRef(null);
  const chartRef     = useRef(null);
  const seriesRef    = useRef({});

  const { candles } = useChartStore();
  const indicators  = useIndicators();

  // ── Create chart once ────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      ...CHART_OPTS,
      width:  containerRef.current.clientWidth,
      height,
    });

    // v4: addSeries(SeriesTypeConstructor, options)
    seriesRef.current.candles  = chart.addSeries(CandlestickSeries, CANDLE_OPTS);

    seriesRef.current.ema9     = chart.addSeries(LineSeries, { ...LINE_BASE, color: '#f0c35a' });
    seriesRef.current.ema20    = chart.addSeries(LineSeries, { ...LINE_BASE, color: '#4e9ff2' });
    seriesRef.current.ema50    = chart.addSeries(LineSeries, { ...LINE_BASE, color: '#e05fac' });
    seriesRef.current.sma200   = chart.addSeries(LineSeries, { ...LINE_BASE, color: '#9b59b6' });
    seriesRef.current.bbUpper  = chart.addSeries(LineSeries, { ...LINE_BASE, color: '#3d8ebb', lineStyle: LineStyle.Dashed });
    seriesRef.current.bbMiddle = chart.addSeries(LineSeries, { ...LINE_BASE, color: '#3d8ebb', lineStyle: LineStyle.Dotted });
    seriesRef.current.bbLower  = chart.addSeries(LineSeries, { ...LINE_BASE, color: '#3d8ebb', lineStyle: LineStyle.Dashed });
    seriesRef.current.vwap     = chart.addSeries(LineSeries, { ...LINE_BASE, color: '#26c2a4', lineStyle: LineStyle.Dotted });

    chartRef.current = chart;

    const ro = new ResizeObserver(() => {
      if (containerRef.current)
        chart.applyOptions({ width: containerRef.current.clientWidth });
    });
    ro.observe(containerRef.current);

    return () => {
      ro.disconnect();
      chart.remove();
      chartRef.current = null;
      seriesRef.current = {};
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Push candle data ──────────────────────────────────────────────
  useEffect(() => {
    const s = seriesRef.current;
    if (!s.candles || !candles.length) return;
    s.candles.setData(candles);
    chartRef.current?.timeScale().fitContent();
  }, [candles]);

  // ── Push overlay data ─────────────────────────────────────────────
  useEffect(() => {
    const s = seriesRef.current;
    if (!s.ema9) return;

    s.ema9.setData(indicators.ema9);
    s.ema20.setData(indicators.ema20);
    s.ema50.setData(indicators.ema50);
    s.sma200.setData(indicators.sma200);
    s.vwap.setData(indicators.vwapLine);

    if (indicators.bbands) {
      s.bbUpper.setData(indicators.bbands.upper);
      s.bbMiddle.setData(indicators.bbands.middle);
      s.bbLower.setData(indicators.bbands.lower);
    } else {
      s.bbUpper.setData([]);
      s.bbMiddle.setData([]);
      s.bbLower.setData([]);
    }
  }, [indicators]);

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height }}
      className="price-chart-canvas"
    />
  );
}
