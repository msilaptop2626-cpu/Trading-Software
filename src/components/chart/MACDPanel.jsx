/**
 * MACDPanel — MACD line, signal line, and histogram sub-chart.
 * Rendered only when panels.macd is true.
 */

import { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';
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
  rightPriceScale: {
    borderColor:  '#2a2d3e',
    scaleMargins: { top: 0.15, bottom: 0.15 },
  },
  timeScale: {
    borderColor:    '#2a2d3e',
    timeVisible:    true,
    secondsVisible: false,
  },
  handleScale:  false,
  handleScroll: false,
};

export default function MACDPanel({ height = 110 }) {
  const containerRef   = useRef(null);
  const chartRef       = useRef(null);
  const histRef        = useRef(null);
  const macdLineRef    = useRef(null);
  const signalLineRef  = useRef(null);

  const { macdData } = useIndicators();

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      ...CHART_OPTS,
      width:  containerRef.current.clientWidth,
      height,
    });

    // Histogram (behind lines)
    histRef.current = chart.addHistogramSeries({
      priceLineVisible: false,
      lastValueVisible: false,
    });

    // MACD line
    macdLineRef.current = chart.addLineSeries({
      color:            '#4e9ff2',
      lineWidth:        2,
      priceLineVisible: false,
      lastValueVisible: true,
    });

    // Signal line
    signalLineRef.current = chart.addLineSeries({
      color:            '#f06292',
      lineWidth:        2,
      priceLineVisible: false,
      lastValueVisible: true,
    });

    chartRef.current = chart;

    const ro = new ResizeObserver(() => {
      chart.applyOptions({ width: containerRef.current.clientWidth });
    });
    ro.observe(containerRef.current);

    return () => {
      ro.disconnect();
      chart.remove();
      chartRef.current = null;
      histRef.current = macdLineRef.current = signalLineRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!macdData || !histRef.current) return;
    histRef.current.setData(macdData.histogram);
    macdLineRef.current.setData(macdData.macdLine);
    signalLineRef.current.setData(macdData.signalLine);
    chartRef.current?.timeScale().fitContent();
  }, [macdData]);

  return (
    <div className="sub-panel">
      <span className="sub-panel-label">MACD</span>
      <div ref={containerRef} style={{ width: '100%', height }} />
    </div>
  );
}
