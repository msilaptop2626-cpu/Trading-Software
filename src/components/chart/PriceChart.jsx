/**
 * PriceChart — candlestick chart with overlay series.
 *
 * Uses @tradingview/lightweight-charts v4 IChartApi.
 *
 * Overlay colours:
 *   EMA 9   → #f0c35a  (gold)
 *   EMA 20  → #4e9ff2  (blue)
 *   EMA 50  → #e05fac  (pink)
 *   SMA 200 → #9b59b6  (purple)
 *   BB upper/lower → #3d8ebb dashed
 *   VWAP    → #26c2a4  (teal)
 */

import { useEffect, useRef } from 'react';
import { createChart, CrosshairMode, LineStyle } from 'lightweight-charts';
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
    borderColor:     '#2a2d3e',
    timeVisible:     true,
    secondsVisible:  false,
  },
};

const CANDLE_OPTS = {
  upColor:          '#26a69a',
  downColor:        '#ef5350',
  borderUpColor:    '#26a69a',
  borderDownColor:  '#ef5350',
  wickUpColor:      '#26a69a',
  wickDownColor:    '#ef5350',
};

export default function PriceChart({ height = 420 }) {
  const containerRef = useRef(null);
  const chartRef     = useRef(null);
  const seriesRef    = useRef({});   // named series refs for update-in-place

  const { candles, overlays } = useChartStore();
  const indicators = useIndicators();

  // ── Create chart once ────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      ...CHART_OPTS,
      width:  containerRef.current.clientWidth,
      height,
    });

    // Candlestick
    seriesRef.current.candles = chart.addCandlestickSeries(CANDLE_OPTS);

    // Overlays (created once, data set later)
    seriesRef.current.ema9   = chart.addLineSeries({ color: '#f0c35a', lineWidth: 1, lastValueVisible: false, priceLineVisible: false });
    seriesRef.current.ema20  = chart.addLineSeries({ color: '#4e9ff2', lineWidth: 1, lastValueVisible: false, priceLineVisible: false });
    seriesRef.current.ema50  = chart.addLineSeries({ color: '#e05fac', lineWidth: 1, lastValueVisible: false, priceLineVisible: false });
    seriesRef.current.sma200 = chart.addLineSeries({ color: '#9b59b6', lineWidth: 1, lastValueVisible: false, priceLineVisible: false });
    seriesRef.current.bbUpper  = chart.addLineSeries({ color: '#3d8ebb', lineWidth: 1, lineStyle: LineStyle.Dashed, lastValueVisible: false, priceLineVisible: false });
    seriesRef.current.bbMiddle = chart.addLineSeries({ color: '#3d8ebb', lineWidth: 1, lineStyle: LineStyle.Dotted, lastValueVisible: false, priceLineVisible: false });
    seriesRef.current.bbLower  = chart.addLineSeries({ color: '#3d8ebb', lineWidth: 1, lineStyle: LineStyle.Dashed, lastValueVisible: false, priceLineVisible: false });
    seriesRef.current.vwap   = chart.addLineSeries({ color: '#26c2a4', lineWidth: 1, lineStyle: LineStyle.Dotted, lastValueVisible: false, priceLineVisible: false });

    chartRef.current = chart;

    // Responsive resize
    const ro = new ResizeObserver(() => {
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
