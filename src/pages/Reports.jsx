import React, { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import { mockStats, pnlHistoryData, cumulativePnlData, pnlByTimeOfDay } from '../data/mockData.js'
import { getDaysInMonth, getFirstDayOfMonth, MONTH_NAMES, DAY_NAMES } from '../utils/formatters.js'
import Dropdown from '../components/ui/Dropdown.jsx'

const TABS = ['Overview', 'Detailed', 'Win vs Loss Days', 'Drawdown', 'Compare', 'Tag Breakdown', 'Advanced']
const VIEW_MODES = ['Recent', 'Year/Month/Day', 'Calendar']

function MonthCalendar({ year, month }) {
  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)
  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  return (
    <div className="month-calendar">
      <div className="month-calendar-header">
        <span>{MONTH_NAMES[month]}, {year}</span>
        <button className="btn-open">Open</button>
      </div>
      <div className="month-calendar-grid">
        {DAY_NAMES.map(d => <div key={d} className="cal-day-name">{d}</div>)}
        {cells.map((day, i) => (
          <div key={i} className={`cal-day${day ? '' : ' empty'}`}>
            {day && <span>{day}</span>}
          </div>
        ))}
      </div>
    </div>
  )
}

function CalendarView({ year }) {
  return (
    <div className="calendar-year-grid">
      {Array.from({ length: 12 }, (_, m) => (
        <MonthCalendar key={m} year={year} month={m} />
      ))}
    </div>
  )
}

const CUSTOM_TOOLTIP = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const val = payload[0].value
    return (
      <div style={{ background: '#1c2128', border: '1px solid var(--border)', borderRadius: '6px', padding: '8px 12px', fontSize: '13px' }}>
        <span style={{ color: val >= 0 ? 'var(--accent-green)' : 'var(--accent-red)' }}>
          {val >= 0 ? `$${val.toFixed(2)}` : `$(${Math.abs(val).toFixed(2)})`}
        </span>
      </div>
    )
  }
  return null
}

function OverviewContent() {
  const s = mockStats
  const winningPct = (s.profitTrades.count / s.numTrades * 100).toFixed(0)
  const losingPct = (s.lossTrades.count / s.numTrades * 100).toFixed(0)

  return (
    <div>
      {/* Stats tables */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '12px', marginBottom: '20px' }}>
        {/* All trades */}
        <div className="stats-table">
          <div className="stats-table-header">ALL TRADES</div>
          {[
            ['Gross P&L', `$${s.grossPnl.toFixed(2)}`],
            ['# of Trades', s.numTrades],
            ['# of Contracts', s.numContracts],
            ['Avg. Trade Time', s.avgTradeTime],
            ['Longest Trade Time', s.longestTradeTime],
            ['% Profitable Trades', `${s.winRate}%`],
            ['Expectancy', `$${s.expectancy.toFixed(2)}`],
            ['Trade Fees & Comm.', `$(${Math.abs(s.tradeFees).toFixed(2)})`],
            ['Total P/L', `$${s.totalPnl.toFixed(2)}`],
          ].map(([k, v]) => (
            <div key={k} className="stats-row">
              <span className="stats-key">{k}</span>
              <span className="stats-val">{v}</span>
            </div>
          ))}
        </div>
        {/* Profit trades */}
        <div className="stats-table">
          <div className="stats-table-header">PROFIT TRADES</div>
          {[
            ['Total Profit', `$${s.profitTrades.totalProfit.toFixed(2)}`],
            ['# of Winning Trades', s.profitTrades.count],
            ['# of Winning Contracts', s.profitTrades.contracts],
            ['Largest Winning Trade', `$${s.profitTrades.largestWin.toFixed(2)}`],
            ['Avg. Winning Trade', `$${s.profitTrades.avgWin.toFixed(2)}`],
            ['Std. Dev. Winning Trade', `$${s.profitTrades.stdDevWin.toFixed(2)}`],
            ['Avg. Winning Trade Time', s.profitTrades.avgWinTime],
            ['Longest Winning Trade Time', s.profitTrades.longestWinTime],
            ['Max Run-up', `$${s.profitTrades.maxRunUp.toFixed(2)}`],
            ['Max Run-up, from', s.profitTrades.maxRunUpFrom],
            ['Max Run-up, to', s.profitTrades.maxRunUpTo],
          ].map(([k, v]) => (
            <div key={k} className="stats-row">
              <span className="stats-key">{k}</span>
              <span className="stats-val green">{v}</span>
            </div>
          ))}
        </div>
        {/* Loss trades */}
        <div className="stats-table">
          <div className="stats-table-header">LOSING TRADES</div>
          {[
            ['Total Loss', `$(${Math.abs(s.lossTrades.totalLoss).toFixed(2)})`],
            ['# of Losing Trades', s.lossTrades.count],
            ['# of Losing Contracts', s.lossTrades.contracts],
            ['Largest Losing Trade', `$(${Math.abs(s.lossTrades.largestLoss).toFixed(2)})`],
            ['Avg. Losing Trade', `$(${Math.abs(s.lossTrades.avgLoss).toFixed(2)})`],
            ['Std. Dev. Losing Trade', `$${s.lossTrades.stdDevLoss.toFixed(2)}`],
            ['Avg. Losing Trade Time', s.lossTrades.avgLossTime],
            ['Longest Losing Trade Time', s.lossTrades.longestLossTime],
            ['Max Drawdown', `$(${Math.abs(s.lossTrades.maxDrawdown).toFixed(2)})`],
            ['Max Drawdown, from', s.lossTrades.maxDrawdownFrom],
            ['Max Drawdown, to', s.lossTrades.maxDrawdownTo],
          ].map(([k, v]) => (
            <div key={k} className="stats-row">
              <span className="stats-key">{k}</span>
              <span className="stats-val red">{v}</span>
            </div>
          ))}
        </div>
        {/* Pie chart */}
        <div className="stats-table" style={{ minWidth: '180px' }}>
          <div className="stats-table-header">WINNING VS LOSING TRADES</div>
          <div style={{ padding: '8px', textAlign: 'center' }}>
            <PieChart width={160} height={160}>
              <Pie data={[{value: s.profitTrades.count},{value: s.lossTrades.count}]} cx={75} cy={75} innerRadius={40} outerRadius={70} dataKey="value" startAngle={90} endAngle={-270}>
                <Cell fill="#3fba50"/>
                <Cell fill="#f85149"/>
              </Pie>
            </PieChart>
            <div style={{ fontSize: '12px', marginTop: '4px' }}>
              <span style={{ color: 'var(--accent-green)' }}>WINNING TRADES: {s.profitTrades.count}</span><br/>
              <span style={{ color: 'var(--accent-red)' }}>LOSING TRADES: {s.lossTrades.count}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts row 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '12px' }}>
        <div className="stats-table">
          <div className="stats-table-header">P&L HISTORY</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={pnlHistoryData} margin={{top:10,right:10,bottom:0,left:0}}>
              <XAxis hide/><YAxis hide/>
              <Tooltip content={<CUSTOM_TOOLTIP/>}/>
              <Bar dataKey="pnl" radius={[2,2,0,0]}>
                {pnlHistoryData.map((entry, i) => <Cell key={i} fill={entry.pnl >= 0 ? '#3fba50' : '#f85149'}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="stats-table">
          <div className="stats-table-header">P&L HISTORY (CUMULATIVE WITHOUT FEES)</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={cumulativePnlData} margin={{top:10,right:10,bottom:0,left:0}}>
              <XAxis hide/><YAxis hide/>
              <Tooltip content={({active,payload}) => active && payload?.length ? (
                <div style={{background:'#1c2128',border:'1px solid var(--border)',borderRadius:'6px',padding:'8px 12px',fontSize:'13px'}}>
                  <span style={{color: payload[0].value >= 0 ? 'var(--accent-green)' : 'var(--accent-red)'}}>
                    ${Math.abs(payload[0].value).toFixed(2)}
                  </span>
                </div>
              ) : null}/>
              <Bar dataKey="cumulative" radius={[2,2,0,0]}>
                {cumulativePnlData.map((entry, i) => <Cell key={i} fill={entry.cumulative >= 0 ? '#3fba50' : '#f85149'}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="stats-table">
          <div className="stats-table-header">P&L HISTORY (CUMULATIVE WITH FEES)</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={cumulativePnlData.map(d => ({...d, cumulative: d.cumulative - 110.68 / cumulativePnlData.length * (d.trade)}))} margin={{top:10,right:10,bottom:0,left:0}}>
              <XAxis hide/><YAxis hide/>
              <Tooltip content={<CUSTOM_TOOLTIP/>}/>
              <Bar dataKey="cumulative" radius={[2,2,0,0]}>
                {cumulativePnlData.map((entry, i) => <Cell key={i} fill={entry.cumulative >= 0 ? '#3fba50' : '#f85149'}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts row 2 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
        <div className="stats-table">
          <div className="stats-table-header">P&L DISTRIBUTION</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={pnlHistoryData} margin={{top:10,right:10,bottom:0,left:0}}>
              <XAxis hide/><YAxis hide/>
              <Tooltip content={<CUSTOM_TOOLTIP/>}/>
              <Bar dataKey="pnl" radius={[2,2,0,0]}>
                {pnlHistoryData.map((entry, i) => <Cell key={i} fill={entry.pnl >= 0 ? '#3fba50' : '#f85149'}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="stats-table">
          <div className="stats-table-header">P/L PER TIME OF DAY</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={pnlByTimeOfDay} margin={{top:10,right:10,bottom:0,left:0}}>
              <XAxis dataKey="hour" tick={{fontSize:10,fill:'var(--text-muted)'}} axisLine={false} tickLine={false}/>
              <YAxis hide/>
              <Tooltip content={<CUSTOM_TOOLTIP/>}/>
              <Bar dataKey="pnl" radius={[2,2,0,0]}>
                {pnlByTimeOfDay.map((entry, i) => <Cell key={i} fill={entry.pnl >= 0 ? '#3fba50' : '#f85149'}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="stats-table">
          <div className="stats-table-header">GROSS LOSS BREAKDOWN (LOSS TRADES, TRADE FEES &amp; COMM.)</div>
          <div style={{ padding: '12px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <PieChart width={140} height={140}>
              <Pie data={[{name:'Trade',value:92.43},{name:'Exchange',value:3.05},{name:'Commission',value:2.83},{name:'Clearing',value:1.53},{name:'NFA',value:0.16}]}
                cx={65} cy={65} outerRadius={60} dataKey="value" startAngle={90} endAngle={-270}>
                <Cell fill="#f85149"/>
                <Cell fill="#1f6feb"/>
                <Cell fill="#8957e5"/>
                <Cell fill="#db6d28"/>
                <Cell fill="#3fba50"/>
              </Pie>
            </PieChart>
            <div style={{ fontSize: '11px', lineHeight: '1.8' }}>
              <div style={{ color: '#f85149' }}>TRADE: 92.43%</div>
              <div style={{ color: '#1f6feb' }}>EXCHANGE: 3.05%</div>
              <div style={{ color: '#8957e5' }}>COMMISSION: 2.83%</div>
              <div style={{ color: '#db6d28' }}>CLEARING: 1.53%</div>
              <div style={{ color: '#3fba50' }}>NFA: 0.16%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Reports() {
  const [activeTab, setActiveTab] = useState('Overview')
  const [viewMode, setViewMode] = useState('Calendar')
  const [year, setYear] = useState(2026)
  const [symbol, setSymbol] = useState('')
  const [side, setSide] = useState('All')
  const [duration, setDuration] = useState('All')
  const [plType, setPlType] = useState('Gross')
  const [viewModeOption, setViewModeOption] = useState('$ Value')
  const [reportType, setReportType] = useState('Aggregate P&L')

  return (
    <div className="page-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 className="page-title" style={{ margin: 0 }}>Reports</h1>
        <button className="btn-outline">Custom Filters <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg></button>
      </div>

      {/* Filter bar */}
      <div className="filter-bar">
        <div className="filter-group">
          <label className="filter-label">Symbol</label>
          <input className="filter-input" placeholder="Symbol" value={symbol} onChange={e => setSymbol(e.target.value)} />
        </div>
        <div className="filter-group">
          <label className="filter-label">Tags</label>
          <button className="filter-dropdown-btn">Select <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg></button>
        </div>
        <div className="filter-group">
          <label className="filter-label">Side</label>
          <Dropdown value={side} options={['All', 'Long', 'Short']} onChange={setSide} className="filter-dropdown" />
        </div>
        <div className="filter-group">
          <label className="filter-label">Duration</label>
          <Dropdown value={duration} options={['All', '< 1 min', '1-5 min', '5-30 min', '30 min - 2 hr', '> 2 hr']} onChange={setDuration} className="filter-dropdown" />
        </div>
        <div className="filter-group">
          <button className="filter-date-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            From - To
          </button>
        </div>
        <button className="filter-advanced-btn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
          Advanced
        </button>
        <button className="filter-clear-btn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
        </button>
        <button className="filter-apply-btn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </button>
      </div>

      {/* Tabs */}
      <div className="tab-bar reports-tabs" style={{ marginBottom: '16px' }}>
        {TABS.map(tab => (
          <button key={tab} className={`tab-btn${activeTab === tab ? ' active' : ''}`} onClick={() => setActiveTab(tab)}>{tab}</button>
        ))}
      </div>

      {/* Sub controls */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="text-muted" style={{ fontSize: '13px' }}>P&L Type</span>
          <Dropdown value={plType} options={['Gross', 'Net']} onChange={setPlType} className="sub-dropdown" />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="text-muted" style={{ fontSize: '13px' }}>View mode</span>
          <Dropdown value={viewModeOption} options={['$ Value', '% Value', 'R Multiple']} onChange={setViewModeOption} className="sub-dropdown" />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="text-muted" style={{ fontSize: '13px' }}>Report type</span>
          <Dropdown value={reportType} options={['Aggregate P&L', 'Per Symbol', 'Per Tag']} onChange={setReportType} className="sub-dropdown" />
        </div>
      </div>

      {/* View toggle + year */}
      {activeTab === 'Overview' && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', gap: '4px' }}>
            {VIEW_MODES.map(mode => (
              <button key={mode} className={`view-toggle-btn${viewMode === mode ? ' active' : ''}`} onClick={() => setViewMode(mode)}>{mode}</button>
            ))}
          </div>
          {viewMode === 'Calendar' && (
            <button className="year-btn">{year}</button>
          )}
        </div>
      )}

      {/* Content */}
      {activeTab === 'Overview' && viewMode === 'Calendar' && <CalendarView year={year} />}
      {activeTab === 'Overview' && viewMode !== 'Calendar' && <OverviewContent />}
      {activeTab !== 'Overview' && (
        <div className="card" style={{ padding: '48px', textAlign: 'center' }}>
          <p className="text-muted">{activeTab} view - coming soon</p>
        </div>
      )}
    </div>
  )
}
