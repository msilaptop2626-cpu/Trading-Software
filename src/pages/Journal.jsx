import React, { useState } from 'react'
import { mockJournalEntries } from '../data/mockData.js'

export default function Journal() {
  const [selected, setSelected] = useState(null)
  const [newEntry, setNewEntry] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newContent, setNewContent] = useState('')
  const [entries, setEntries] = useState(mockJournalEntries)

  const handleSave = () => {
    if (!newTitle.trim()) return
    const entry = {
      id: entries.length + 1,
      date: new Date().toISOString().slice(0, 10),
      title: newTitle,
      content: newContent,
      tags: [],
      trades: [],
    }
    setEntries(prev => [entry, ...prev])
    setNewEntry(false)
    setNewTitle('')
    setNewContent('')
    setSelected(entry)
  }

  return (
    <div className="page-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 className="page-title" style={{ margin: 0 }}>Journal</h1>
        <button className="btn-primary" onClick={() => { setNewEntry(true); setSelected(null) }}>+ New Entry</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '20px' }}>
        {/* Entry list */}
        <div>
          {newEntry && (
            <div className="journal-entry-card active" style={{ marginBottom: '8px' }}>
              <div className="journal-entry-title">New Entry</div>
              <div className="journal-entry-date">{new Date().toLocaleDateString()}</div>
            </div>
          )}
          {entries.map(entry => (
            <div
              key={entry.id}
              className={`journal-entry-card${selected?.id === entry.id ? ' active' : ''}`}
              onClick={() => { setSelected(entry); setNewEntry(false) }}
            >
              <div className="journal-entry-title">{entry.title}</div>
              <div className="journal-entry-date">{entry.date}</div>
              <p className="journal-entry-preview">{entry.content.slice(0, 80)}...</p>
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '6px' }}>
                {entry.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
              </div>
            </div>
          ))}
        </div>

        {/* Entry detail / editor */}
        <div className="card" style={{ padding: '24px', minHeight: '400px' }}>
          {newEntry ? (
            <div>
              <input
                className="form-input"
                placeholder="Entry title..."
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                style={{ marginBottom: '16px', fontSize: '18px', fontWeight: 600 }}
              />
              <textarea
                className="form-textarea"
                placeholder="Write your journal entry here..."
                value={newContent}
                onChange={e => setNewContent(e.target.value)}
                rows={14}
                style={{ marginBottom: '16px' }}
              />
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn-primary" onClick={handleSave}>Save Entry</button>
                <button className="btn-outline" onClick={() => { setNewEntry(false); setNewTitle(''); setNewContent('') }}>Cancel</button>
              </div>
            </div>
          ) : selected ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <h2 style={{ color: 'var(--text-primary)', margin: '0 0 4px', fontSize: '20px' }}>{selected.title}</h2>
                  <span className="text-muted" style={{ fontSize: '13px' }}>{selected.date}</span>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {selected.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
                </div>
              </div>
              <p style={{ color: 'var(--text-primary)', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>{selected.content}</p>
              {selected.trades.length > 0 && (
                <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                  <p className="text-muted" style={{ fontSize: '13px', marginBottom: '8px' }}>Linked trades: {selected.trades.join(', ')}</p>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{marginBottom:'16px'}}>
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
              <p className="text-muted">Select a journal entry or create a new one</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
