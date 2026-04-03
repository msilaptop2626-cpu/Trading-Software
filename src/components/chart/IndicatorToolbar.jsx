/**
 * IndicatorToolbar — toggle overlays (EMA/SMA/BB/VWAP) and sub-panels (Volume/RSI/MACD).
 */

import { useChartStore } from '../../store/chartStore';
import './IndicatorToolbar.css';

const OVERLAYS = [
  { key: 'ema9',   label: 'EMA 9' },
  { key: 'ema20',  label: 'EMA 20' },
  { key: 'ema50',  label: 'EMA 50' },
  { key: 'sma200', label: 'SMA 200' },
  { key: 'bbands', label: 'BB' },
  { key: 'vwap',   label: 'VWAP' },
];

const PANELS = [
  { key: 'volume', label: 'Vol' },
  { key: 'rsi',    label: 'RSI' },
  { key: 'macd',   label: 'MACD' },
];

export default function IndicatorToolbar() {
  const { overlays, toggleOverlay, panels, togglePanel } = useChartStore();

  return (
    <div className="indicator-toolbar">
      <span className="ind-section-label">Overlays</span>
      {OVERLAYS.map(({ key, label }) => (
        <button
          key={key}
          type="button"
          className={`ind-btn ${overlays[key] ? 'active' : ''}`}
          onClick={() => toggleOverlay(key)}
        >
          {label}
        </button>
      ))}

      <span className="ind-divider" />

      <span className="ind-section-label">Panels</span>
      {PANELS.map(({ key, label }) => (
        <button
          key={key}
          type="button"
          className={`ind-btn ${panels[key] ? 'active' : ''}`}
          onClick={() => togglePanel(key)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
