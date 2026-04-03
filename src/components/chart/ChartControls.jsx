/**
 * ChartControls — top toolbar: ticker, interval selector, date pickers, fetch button.
 */

import { useChartStore } from '../../store/chartStore';
import { useMarketData } from '../../hooks/useMarketData';
import './ChartControls.css';

const INTERVALS = [
  { value: '1m',  label: '1m'  },
  { value: '2m',  label: '2m'  },
  { value: '5m',  label: '5m'  },
  { value: '15m', label: '15m' },
  { value: '30m', label: '30m' },
  { value: '1h',  label: '1h'  },
  { value: '1d',  label: '1D'  },
];

export default function ChartControls() {
  const {
    ticker, setTicker,
    interval, setInterval,
    startDate, setStartDate,
    endDate, setEndDate,
    loading, meta,
  } = useChartStore();

  const { refresh } = useMarketData();

  const handleSubmit = (e) => {
    e.preventDefault();
    refresh();
  };

  return (
    <form className="chart-controls" onSubmit={handleSubmit}>
      {/* Ticker */}
      <div className="ctrl-group">
        <label htmlFor="ticker-input">Symbol</label>
        <input
          id="ticker-input"
          type="text"
          value={ticker}
          onChange={(e) => setTicker(e.target.value.toUpperCase())}
          placeholder="^GSPC"
          className="ctrl-input ticker-input"
        />
      </div>

      {/* Interval pills */}
      <div className="ctrl-group">
        <label>Interval</label>
        <div className="interval-pills">
          {INTERVALS.map((iv) => (
            <button
              key={iv.value}
              type="button"
              className={`pill ${interval === iv.value ? 'active' : ''}`}
              onClick={() => setInterval(iv.value)}
            >
              {iv.label}
            </button>
          ))}
        </div>
      </div>

      {/* Date range */}
      <div className="ctrl-group">
        <label htmlFor="start-date">From</label>
        <input
          id="start-date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="ctrl-input"
        />
      </div>
      <div className="ctrl-group">
        <label htmlFor="end-date">To</label>
        <input
          id="end-date"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="ctrl-input"
        />
      </div>

      {/* Fetch */}
      <button type="submit" className="btn-fetch" disabled={loading}>
        {loading ? 'Loading…' : 'Load Chart'}
      </button>

      {/* Bar count */}
      {meta && (
        <span className="bar-count">{meta.bars.toLocaleString()} bars</span>
      )}
    </form>
  );
}
