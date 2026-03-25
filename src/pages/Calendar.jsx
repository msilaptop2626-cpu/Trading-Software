import React, { useState } from 'react'
import { mockTrades } from '../data/mockData.js'
import { getDaysInMonth, getFirstDayOfMonth, MONTH_NAMES, DAY_NAMES } from '../utils/formatters.js'

function getDayPnl(year, month, day) {
  const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  const dayTrades = mockTrades.filter(t => t.date === dateStr)
  if (dayTrades.length === 0) return null
  return dayTrades.reduce((sum, t) => sum + t.pnl, 0)
}

export default function Calendar() {
  const [year, setYear] = useState(2026)
  const [month, setMonth] = useState(2) // March

  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)
  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1) } else setMonth(m => m - 1) }
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y + 1) } else setMonth(m => m + 1) }

  return (
    <div className="page-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 className="page-title" style={{ margin: 0 }}>Calendar</h1>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button className="btn-outline" style={{ padding: '6px 10px' }} onClick={prevMonth}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <span style={{ color: 'var(--text-primary)', fontWeight: 600, minWidth: '160px', textAlign: 'center' }}>
            {MONTH_NAMES[month]} {year}
          </span>
          <button className="btn-outline" style={{ padding: '6px 10px' }} onClick={nextMonth}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      </div>

      <div className="card" style={{ padding: '20px' }}>
        <div className="full-calendar-grid">
          {DAY_NAMES.map(d => <div key={d} className="full-cal-day-name">{d}</div>)}
          {cells.map((day, i) => {
            const pnl = day ? getDayPnl(year, month, day) : null
            const isWeekend = day ? (getFirstDayOfMonth(year, month) + day - 1) % 7 === 0 || (getFirstDayOfMonth(year, month) + day - 1) % 7 === 6 : false
            return (
              <div key={i} className={`full-cal-day${!day ? ' empty' : ''}${isWeekend ? ' weekend' : ''}`}>
                {day && (
                  <>
                    <span className="full-cal-day-num">{day}</span>
                    {pnl !== null && (
                      <span className={`full-cal-pnl ${pnl >= 0 ? 'green' : 'red'}`}>
                        {pnl >= 0 ? `$${pnl.toFixed(2)}` : `$(${Math.abs(pnl).toFixed(2)})`}
                      </span>
                    )}
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Monthly summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginTop: '20px' }}>
        {[
          { label: 'Monthly P/L', value: '$175.25', positive: true },
          { label: 'Trading Days', value: '15', positive: null },
          { label: 'Win Days', value: '8 / 15', positive: null },
        ].map(({ label, value, positive }) => (
          <div key={label} className="stat-card">
            <div className="stat-label">{label}</div>
            <div className={`stat-value${positive === true ? ' green' : positive === false ? ' red' : ''}`}>{value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
