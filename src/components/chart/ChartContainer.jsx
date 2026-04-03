/**
 * ChartContainer — orchestrates all chart panels.
 *
 * Layout (top → bottom):
 *   PriceChart  (main candlestick + overlays, flex-grows)
 *   VolumePanel (if panels.volume)
 *   RSIPanel    (if panels.rsi)
 *   MACDPanel   (if panels.macd)
 */

import { useChartStore } from '../../store/chartStore';
import PriceChart   from './PriceChart';
import VolumePanel  from './VolumePanel';
import RSIPanel     from './RSIPanel';
import MACDPanel    from './MACDPanel';
import './ChartContainer.css';

export default function ChartContainer() {
  const { loading, error, candles, panels } = useChartStore();

  if (loading) {
    return (
      <div className="chart-loading">
        <div className="spinner" />
        <span>Fetching market data…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="chart-error">
        <strong>Error:</strong> {error}
      </div>
    );
  }

  if (!candles.length) {
    return (
      <div className="chart-empty">
        Select a symbol and date range, then click <strong>Load Chart</strong>.
      </div>
    );
  }

  return (
    <div className="chart-container">
      <PriceChart />
      {panels.volume && <VolumePanel />}
      {panels.rsi    && <RSIPanel />}
      {panels.macd   && <MACDPanel />}
    </div>
  );
}
