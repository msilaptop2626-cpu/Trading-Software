import React, { useState, useRef } from 'react'
import { brokerOptions, timezones } from '../data/mockData.js'
import Dropdown from '../components/ui/Dropdown.jsx'

const brokerInfo = {
  'Tradovate': {
    logo: 'tradovate',
    assetTypes: ['Stocks', 'Futures', 'Options', 'Forex'],
    activeAssets: ['Futures'],
    warning: 'This importer is being tested; please report any unexpected behavior.',
    steps: [
      'On the left side of this page, select the time zone your Tradovate data is in.',
      'In Tradovate, click on the Account tab, then choose the account to export.',
      'Click the settings icon next to the account to open the settings for that account.',
      'Click the Orders tab, enter the dates you wish to export, and click Go.',
      'Click Download Report to download the file. Save the file to your desktop (or anywhere else - just remember where you put it).',
      'Here on the import page, click "Choose file", choose the file you created above, and click "Upload".',
    ],
  },
  'TD Ameritrade / thinkorswim': {
    logo: 'tda',
    assetTypes: ['Stocks', 'Options', 'Forex', 'Futures'],
    activeAssets: ['Stocks', 'Options'],
    warning: null,
    steps: [
      'Log in to thinkorswim and go to the Monitor tab.',
      'Click on Account Statement.',
      'Set the date range and click the export button.',
      'Save the CSV file and upload it here.',
    ],
  },
}

export default function ImportTrades() {
  const [activeTab, setActiveTab] = useState('standard')
  const [broker, setBroker] = useState('Tradovate')
  const [timezone, setTimezone] = useState('(GMT-05:00) Eastern Time (US & Canada)')
  const [pasteData, setPasteData] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const [uploadedFile, setUploadedFile] = useState(null)
  const [requireAccount, setRequireAccount] = useState(false)
  const fileRef = useRef(null)

  const info = brokerInfo[broker] || brokerInfo['Tradovate']

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) setUploadedFile(file)
  }

  return (
    <div className="page-content">
      <h1 className="page-title">Import trades</h1>
      <div className="tab-bar" style={{ marginBottom: '24px' }}>
        <button className={`tab-btn${activeTab === 'broker' ? ' active' : ''}`} onClick={() => setActiveTab('broker')}>Broker Sync</button>
        <button className={`tab-btn${activeTab === 'standard' ? ' active' : ''}`} onClick={() => setActiveTab('standard')}>Standard Import</button>
      </div>

      {activeTab === 'standard' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px', alignItems: 'start' }}>
          {/* Left panel */}
          <div className="card" style={{ padding: '28px' }}>
            <div className="form-group">
              <label className="form-label">Select broker / trading</label>
              <Dropdown value={broker} options={brokerOptions} onChange={setBroker} />
            </div>

            <div className="form-group">
              <label className="form-label">
                Account Tag: <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>(what's this?)</span>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginLeft:'4px',verticalAlign:'middle'}}>
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </label>
              <input className="form-input" placeholder="Default" />
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input type="checkbox" checked={requireAccount} onChange={e => setRequireAccount(e.target.checked)} />
                <span>Always require me to select a Trading Account</span>
              </label>
            </div>

            <div className="form-group">
              <label className="form-label">Tags</label>
              <button className="btn-tag-add">Add tags +</button>
            </div>

            <div className="form-group">
              <label className="form-label">Local time zone</label>
              <Dropdown value={timezone} options={timezones} onChange={setTimezone} />
            </div>

            <div className="form-group">
              <label className="form-label">Option 1: Import from a File</label>
              <div
                className={`file-upload-area${dragOver ? ' drag-over' : ''}`}
                onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
              >
                <input ref={fileRef} type="file" accept=".csv" style={{ display: 'none' }} onChange={e => setUploadedFile(e.target.files[0])} />
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{marginBottom:'8px'}}>
                  <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/>
                  <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
                </svg>
                {uploadedFile ? (
                  <p style={{ color: 'var(--accent-green)', margin: 0 }}>{uploadedFile.name}</p>
                ) : (
                  <>
                    <p style={{ margin: '0 0 4px', color: 'var(--text-primary)', fontWeight: 500 }}>Upload file</p>
                    <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>
                      Drag and drop the .csv file here or <span style={{ color: 'var(--accent-green)', cursor: 'pointer' }}>click to upload</span>
                    </p>
                  </>
                )}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Option 2: Paste Data Here</label>
              <textarea
                className="form-textarea"
                placeholder="Paste data"
                value={pasteData}
                onChange={e => setPasteData(e.target.value)}
                rows={4}
              />
            </div>

            <button className="btn-primary btn-full">Import trades</button>
          </div>

          {/* Right info panel */}
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ background: 'var(--bg-tertiary)', borderRadius: '8px', padding: '12px 16px', display: 'inline-block', marginBottom: '16px' }}>
                <span style={{ fontWeight: 700, fontSize: '18px', color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
                  {broker}
                </span>
              </div>
            </div>

            <p className="form-label" style={{ marginBottom: '10px' }}>Supported Asset Types:</p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
              {info.assetTypes.map(type => (
                <span key={type} className={`asset-badge${info.activeAssets.includes(type) ? ' active' : ''}`}>{type}</span>
              ))}
            </div>

            {info.warning && (
              <p style={{ color: '#f0a500', fontSize: '13px', fontStyle: 'italic', marginBottom: '16px' }}>
                {info.warning}
              </p>
            )}

            <p style={{ fontSize: '13px', color: 'var(--text-primary)', marginBottom: '12px' }}>
              To import data from {broker}, follow these steps:
            </p>
            <ol style={{ paddingLeft: '20px', margin: 0 }}>
              {info.steps.map((step, i) => (
                <li key={i} style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '10px', lineHeight: '1.5' }}>{step}</li>
              ))}
            </ol>
          </div>
        </div>
      )}

      {activeTab === 'broker' && (
        <div className="card" style={{ padding: '32px', textAlign: 'center' }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{margin:'0 auto 16px'}}>
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          <h3 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>Broker Sync</h3>
          <p className="text-muted">Automatic broker sync is available on paid plans.</p>
          <button className="btn-primary" style={{ marginTop: '16px' }}>Start Free Trial</button>
        </div>
      )}
    </div>
  )
}
