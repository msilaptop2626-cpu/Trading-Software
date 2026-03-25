import React, { useState } from 'react'
import { mockTrades, mockJournalEntries } from '../data/mockData.js'

export default function Search() {
  const [query, setQuery] = useState('')
  const [searchType, setSearchType] = useState('trades')
  const [results, setResults] = useState(null)

  const handleSearch = () => {
    if (!query.trim()) { setResults([]); return }
    const q = query.toLowerCase()
    if (searchType === 'trades') {
      setResults(mockTrades.filter(t => t.symbol.toLowerCase().includes(q) || t.tags.some(tag => tag.toLowerCase().includes(q))))
    } else if (searchType === 'journal') {
      setResults(mockJournalEntries.filter(j => j.title.toLowerCase().includes(q) || j.content.toLowerCase().includes(q) || j.tags.some(tag => tag.toLowerCase().includes(q))))
    } else {
      setResults([])
    }
  }

  return (
    <div className="page-content">
      <h1 className="page-title">Search</h1>
      <div className="card" style={{ padding: '32px', textAlign: 'center' }}>
        <p className="text-muted" style={{ marginBottom: '24px' }}>
          Search your trade notes, journal notes, and comments made on your trades/notes:
        </p>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '16px' }}>
          <input
            className="form-input"
            style={{ width: '420px', textAlign: 'left' }}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder=""
          />
          <button className="btn-primary" onClick={handleSearch}>Search</button>
        </div>
        <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', marginBottom: '24px' }}>
          {[{val:'trades',label:'Trades'},{val:'journal',label:'Journal entries'},{val:'comments',label:'Comments'}].map(({val,label}) => (
            <label key={val} className="radio-label">
              <input type="radio" name="searchType" value={val} checked={searchType === val} onChange={() => setSearchType(val)} />
              <span>{label}</span>
            </label>
          ))}
        </div>
        <p className="text-note">
          <em>Note: the global trade filter is ignored when searching trade notes, journal notes, and comments made on your trades/notes.</em>
        </p>
      </div>

      {results !== null && (
        <div style={{ marginTop: '24px' }}>
          {results.length === 0 ? (
            <div className="card" style={{ padding: '32px', textAlign: 'center' }}>
              <p className="text-muted">No results found for "{query}"</p>
            </div>
          ) : (
            <div>
              <p className="text-muted" style={{ marginBottom: '12px' }}>{results.length} result(s) found</p>
              {searchType === 'trades' && results.map(trade => (
                <div key={trade.id} className="card" style={{ padding: '16px', marginBottom: '8px', display: 'flex', gap: '24px', alignItems: 'center' }}>
                  <span className="badge badge-symbol">{trade.symbol}</span>
                  <span className={`badge ${trade.side === 'Long' ? 'badge-long' : 'badge-short'}`}>{trade.side}</span>
                  <span className="text-muted">{trade.date}</span>
                  <span className={trade.pnl >= 0 ? 'text-green' : 'text-red'}>
                    {trade.pnl >= 0 ? `$${trade.pnl.toFixed(2)}` : `$(${Math.abs(trade.pnl).toFixed(2)})`}
                  </span>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {trade.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
                  </div>
                </div>
              ))}
              {searchType === 'journal' && results.map(entry => (
                <div key={entry.id} className="card" style={{ padding: '16px', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <strong className="text-primary">{entry.title}</strong>
                    <span className="text-muted">{entry.date}</span>
                  </div>
                  <p className="text-muted" style={{ margin: 0 }}>{entry.content.slice(0, 150)}...</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
