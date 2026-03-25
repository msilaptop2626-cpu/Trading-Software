import React, { useState } from 'react'
import { mockTrades } from '../data/mockData.js'
import Dropdown from '../components/ui/Dropdown.jsx'

export default function Trades() {
  const [symbol, setSymbol] = useState('')
  const [side, setSide] = useState('All')
  const [sortBy, setSortBy] = useState('date')
  const [sortDir, setSortDir] = useState('desc')
  const [selectedTrade, setSelectedTrade] = useState(null)

  const filtered = mockTrades
    .filter(t => (!symbol || t.symbol.toLowerCase().includes(symbol.toLowerCase())))
    .filter(t => side === 'All' || t.side === side)
    .sort((a, b) => {
      let cmp = 0
      if (sortBy === 'date') cmp = a.date.localeCompare(b.date)
      else if (sortBy === 'pnl') cmp = a.pnl - b.pnl
      else if (sortBy === 'symbol') cmp = a.symbol.localeCompare(b.symbol)
      return sortDir === 'desc' ? -cmp : cmp
    })

  const totalPnl = filtered.reduce((sum, t) => sum + t.pnl, 0)

  const handleSort = (col) => {
    if (sortBy === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortBy(col); setSortDir('desc') }
  }

  const SortIcon = ({ col }) => (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{marginLeft:'4px',opacity: sortBy === col ? 1 : 0.3}}>
      {sortBy === col && sortDir === 'asc' ? <polyline points="18 15 12 9 6 15"/> : <polyline points="6 9 12 15 18 9"/>}
    </svg>
  )

  return (
    <div className="page-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 className="page-title" style={{ margin: 0 }}>Trades</h1>
        <a href="/new-trade" className="btn-primary" style={{ textDecoration: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '14px' }}>+ New Trade</a>
      </div>

      {/* Filters */}
      <div className="filter-bar" style={{ marginBottom: '16px' }}>
        <input className="filter-input" placeholder="Symbol" value={symbol} onChange={e => setSymbol(e.target.value)} />
        <Dropdown value={side} options={['All', 'Long', 'Short']} onChange={setSide} className="filter-dropdown" />
        <span className="text-muted" style={{ fontSize: '13px', marginLeft: '8px' }}>{filtered.length} trades</span>
        <span className={`${totalPnl >= 0 ? 'text-green' : 'text-red'}`} style={{ fontSize: '13px', marginLeft: 'auto' }}>
          Total: {totalPnl >= 0 ? `$${totalPnl.toFixed(2)}` : `$(${Math.abs(totalPnl).toFixed(2)})`}
        </span>
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('date')} style={{ cursor: 'pointer' }}>Date <SortIcon col="date"/></th>
                <th>Time</th>
                <th onClick={() => handleSort('symbol')} style={{ cursor: 'pointer' }}>Symbol <SortIcon col="symbol"/></th>
                <th>Side</th>
                <th>Qty</th>
                <th>Entry</th>
                <th>Exit</th>
                <th>Duration</th>
                <th>Fees</th>
                <th onClick={() => handleSort('pnl')} style={{ cursor: 'pointer' }}>P&L <SortIcon col="pnl"/></th>
                <th>Tags</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(trade => (
                <tr key={trade.id} onClick={() => setSelectedTrade(selectedTrade?.id === trade.id ? null : trade)} style={{ cursor: 'pointer' }} className={selectedTrade?.id === trade.id ? 'row-selected' : ''}>
                  <td className="text-muted">{trade.date}</td>
                  <td className="text-muted">{trade.time}</td>
                  <td><span className="badge badge-symbol">{trade.symbol}</span></td>
                  <td><span className={`badge ${trade.side === 'Long' ? 'badge-long' : 'badge-short'}`}>{trade.side}</span></td>
                  <td>{trade.qty}</td>
                  <td>{trade.entry.toFixed(2)}</td>
                  <td>{trade.exit.toFixed(2)}</td>
                  <td className="text-muted">{trade.duration}</td>
                  <td className="text-red">{trade.fees > 0 ? `$(${trade.fees.toFixed(2)})` : '-'}</td>
                  <td className={trade.pnl >= 0 ? 'text-green' : 'text-red'}>
                    {trade.pnl >= 0 ? `$${trade.pnl.toFixed(2)}` : `$(${Math.abs(trade.pnl).toFixed(2)})`}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {trade.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedTrade && (
        <div className="card" style={{ marginTop: '16px', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <h3 className="card-title" style={{ margin: 0 }}>{selectedTrade.symbol} — {selectedTrade.date} {selectedTrade.time}</h3>
            <button className="modal-close" onClick={() => setSelectedTrade(null)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            {[
              ['Symbol', selectedTrade.symbol],
              ['Side', selectedTrade.side],
              ['Quantity', selectedTrade.qty],
              ['Entry', selectedTrade.entry.toFixed(2)],
              ['Exit', selectedTrade.exit.toFixed(2)],
              ['Duration', selectedTrade.duration],
              ['Fees', `$(${selectedTrade.fees.toFixed(2)})`],
              ['P&L', selectedTrade.pnl >= 0 ? `$${selectedTrade.pnl.toFixed(2)}` : `$(${Math.abs(selectedTrade.pnl).toFixed(2)})`],
            ].map(([k, v]) => (
              <div key={k}>
                <div className="stat-label">{k}</div>
                <div className="text-primary" style={{ fontWeight: 500 }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
