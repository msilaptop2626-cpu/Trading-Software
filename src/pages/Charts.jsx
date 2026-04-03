/**
 * Charts page — main S&P 500 / intraday study workspace.
 *
 * Route: /charts
 *
 * Layout:
 *   ┌─────────────────────────────────────────┐
 *   │  ChartControls  (ticker / interval / dates) │
 *   │  IndicatorToolbar  (overlay + panel toggles) │
 *   ├─────────────────────────────────────────┤
 *   │  ChartContainer                         │
 *   │    PriceChart  (candlestick + overlays) │
 *   │    VolumePanel?                         │
 *   │    RSIPanel?                            │
 *   │    MACDPanel?                           │
 *   └─────────────────────────────────────────┘
 */

import ChartControls    from '../components/chart/ChartControls';
import IndicatorToolbar from '../components/chart/IndicatorToolbar';
import ChartContainer   from '../components/chart/ChartContainer';
import './Charts.css';

export default function Charts() {
  return (
    <div className="charts-page">
      <div className="charts-header">
        <h2 className="charts-title">Market Chart</h2>
        <p className="charts-subtitle">
          NYSE regular session · 09:30–16:00 ET · powered by yfinance
        </p>
      </div>

      <div className="charts-workspace">
        <ChartControls />
        <IndicatorToolbar />
        <ChartContainer />
      </div>
    </div>
  );
}
