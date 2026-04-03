/**
 * RSIPanel — RSI line chart with overbought/oversold reference lines.
 * Rendered only when panels.rsi is true.
 */

import { useEffect, useRef } from 'react';
import { createChart, LineStyle } from 'lightweight-charts';
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
    scaleMargins: { top: 0.1, bottom: 0.1 },
    autoScale: false,
  },
  timeScale: {
    borderColor:    '#2a2d3e',
    timeVisible:    true,
    secondsVisible: false,
  },
  handleScale:  false,
  handleScroll: false,
};

export default function RSIPanel({ height = 100 }) {
  const containerRef = useRef(null);
  const chartRef     = useRef(null);
  const rsiSeriesRef = useRef(null);

  const { rsiData } = useIndicators();

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      ...CHART_OPTS,
      width:  containerRef.current.clientWidth,
      height,
    });

    // RSI line
    rsiSeriesRef.current = chart.addLineSeries({
      color:            '#b388ff',
      lineWidth:        2,
      priceLineVisible: false,
      lastValueVisible: true,
    });

    // Fix scale 0–100
    rsiSeriesRef.current.applyOptions({
      autoscaleInfoProvider: () => ({
        priceRange: { minValue: 0, maxValue: 100 },
        margins: { above: 0.1, below: 0.1 },
      }),
    });

    // Overbought (70) / oversold (30) reference lines
    rsiSeriesRef.current.createPriceLine({ price: 70, color: '#ef5350', lineWidth: 1, lineStyle: LineStyle.Dashed, axisLabelVisible: true, title: '70' });
    rsiSeriesRef.current.createPriceLine({ price: 50, color: '#555e72', lineWidth: 1, lineStyle: LineStyle.Dotted,  axisLabelVisible: false });
    rsiSeriesRef.current.createPriceLine({ price: 30, color: '#26a69a', lineWidth: 1, lineStyle: LineStyle.Dashed, axisLabelVisible: true, title: '30' });

    chartRef.current = chart;

    const ro = new ResizeObserver(() => {
      chart.applyOptions({ width: containerRef.current.clientWidth });
    });
    ro.observe(containerRef.current);

    return () => {
      ro.disconnect();
      chart.remove();
      chartRef.current = null;
      rsiSeriesRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!rsiSeriesRef.current || !rsiData.length) return;
    rsiSeriesRef.current.setData(rsiData);
    chartRef.current?.timeScale().fitContent();
  }, [rsiData]);

  return (
    <div className="sub-panel">
      <span className="sub-panel-label">RSI</span>
      <div ref={containerRef} style={{ width: '100%', height }} />
    </div>
  );
}
