import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Dropdown from '../components/ui/Dropdown.jsx'

export default function NewTrade() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    symbol: '', date: new Date().toISOString().slice(0, 10), time: '09:30',
    side: 'Long', qty: '', entry: '', exit: '', fees: '', notes: '', tags: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value || e }))

  const pnl = form.entry && form.exit && form.qty
    ? ((parseFloat(form.exit) - parseFloat(form.entry)) * parseFloat(form.qty) * (form.side === 'Long' ? 1 : -1)).toFixed(2)
    : null

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => navigate('/trades'), 1500)
  }

  if (submitted) {
    return (
      <div className="page-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" style={{marginBottom:'16px'}}>
          <circle cx="12" cy="12" r="11" stroke="var(--accent-green)" strokeWidth="2"/>
          <polyline points="7 12 10 15 17 9" stroke="var(--accent-green)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <h2 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>Trade Added!</h2>
        <p className="text-muted">Redirecting to trades...</p>
      </div>
    )
  }

  return (
    <div className="page-content">
      <h1 className="page-title">New Trade</h1>
      <div style={{ maxWidth: '640px' }}>
        <form className="card" style={{ padding: '28px' }} onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div className="form-group">
              <label className="form-label">Symbol *</label>
              <input className="form-input" placeholder="e.g. NQ, ES, AAPL" value={form.symbol} onChange={set('symbol')} required />
            </div>
            <div className="form-group">
              <label className="form-label">Side *</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {['Long', 'Short'].map(s => (
                  <button key={s} type="button"
                    className={`side-btn${form.side === s ? ' active-' + s.toLowerCase() : ''}`}
                    onClick={() => setForm(f => ({...f, side: s}))}
                  >{s}</button>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div className="form-group">
              <label className="form-label">Date *</label>
              <input className="form-input" type="date" value={form.date} onChange={set('date')} required />
            </div>
            <div className="form-group">
              <label className="form-label">Time</label>
              <input className="form-input" type="time" value={form.time} onChange={set('time')} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div className="form-group">
              <label className="form-label">Quantity *</label>
              <input className="form-input" type="number" placeholder="0" min="1" value={form.qty} onChange={set('qty')} required />
            </div>
            <div className="form-group">
              <label className="form-label">Entry Price *</label>
              <input className="form-input" type="number" step="0.01" placeholder="0.00" value={form.entry} onChange={set('entry')} required />
            </div>
            <div className="form-group">
              <label className="form-label">Exit Price *</label>
              <input className="form-input" type="number" step="0.01" placeholder="0.00" value={form.exit} onChange={set('exit')} required />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div className="form-group">
              <label className="form-label">Fees / Commission</label>
              <input className="form-input" type="number" step="0.01" placeholder="0.00" value={form.fees} onChange={set('fees')} />
            </div>
            <div className="form-group">
              <label className="form-label">Tags</label>
              <input className="form-input" placeholder="breakout, trend, ..." value={form.tags} onChange={set('tags')} />
            </div>
          </div>

          {pnl !== null && (
            <div className="card" style={{ padding: '12px 16px', marginBottom: '16px', background: parseFloat(pnl) >= 0 ? 'rgba(63,186,80,0.1)' : 'rgba(248,81,73,0.1)', border: `1px solid ${parseFloat(pnl) >= 0 ? 'rgba(63,186,80,0.3)' : 'rgba(248,81,73,0.3)'}` }}>
              <span className="text-muted" style={{ fontSize: '13px' }}>Estimated P&L: </span>
              <span className={parseFloat(pnl) >= 0 ? 'text-green' : 'text-red'} style={{ fontWeight: 600 }}>
                {parseFloat(pnl) >= 0 ? `$${pnl}` : `$(${Math.abs(parseFloat(pnl)).toFixed(2)})`}
              </span>
            </div>
          )}

          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label className="form-label">Notes</label>
            <textarea className="form-textarea" placeholder="Trade notes, setup description, lessons learned..." value={form.notes} onChange={set('notes')} rows={4} />
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="submit" className="btn-primary">Add Trade</button>
            <button type="button" className="btn-outline" onClick={() => navigate('/trades')}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}
