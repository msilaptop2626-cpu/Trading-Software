/**
 * VolumePanel — volume histogram sub-chart.
 * lightweight-charts v4: addSeries(HistogramSeries, opts)
 */

import { useEffect, useRef } from 'react';
import { createChart, HistogramSeries } from 'lightweight-charts';
import { useChartStore } from '../../store/chartStore';

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
    scaleMargins: { top: 0.1, bottom: 0 },
  },
  timeScale: {
    borderColor:    '#2a2d3e',
    timeVisible:    true,
    secondsVisible: false,
  },
  handleScale:  false,
  handleScroll: false,
};

export default function VolumePanel({ height = 100 }) {
  const containerRef = useRef(null);
  const chartRef     = useRef(null);
  const seriesRef    = useRef(null);

  const { volume } = useChartStore();

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      ...CHART_OPTS,
      width:  containerRef.current.clientWidth,
      height,
    });

    // v4: addSeries(HistogramSeries, opts)
    seriesRef.current = chart.addSeries(HistogramSeries, {
      priceFormat:  { type: 'volume' },
      priceScaleId: '',
    });

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
      seriesRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!seriesRef.current || !volume.length) return;
    seriesRef.current.setData(volume);
    chartRef.current?.timeScale().fitContent();
  }, [volume]);

  return (
    <div className="sub-panel">
      <span className="sub-panel-label">VOLUME</span>
      <div ref={containerRef} style={{ width: '100%', height }} />
    </div>
  );
}
