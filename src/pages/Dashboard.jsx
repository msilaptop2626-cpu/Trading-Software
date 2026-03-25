import React from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LineChart, Line } from 'recharts'
import { mockTrades, mockStats, pnlHistoryData } from '../data/mockData.js'

function StatCard({ label, value, sub, positive }) {
  return (
    <div className="stat-card">
      <div className="stat-label">{label}</div>
      <div className={`stat-value${positive === true ? ' green' : positive === false ? ' red' : ''}`}>{value}</div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  )
}

export default function Dashboard() {
  const recentTrades = mockTrades.slice(0, 10)

  return (
    <div className="page-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 className="page-title" style={{ margin: 0 }}>Dashboard</h1>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span className="text-muted" style={{ fontSize: '13px' }}>March 2026</span>
          <button className="btn-outline" style={{ padding: '6px 12px', fontSize: '13px' }}>This Month</button>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', marginBottom: '20px' }}>
        <StatCard label="Total P/L" value={`$${mockStats.totalPnl.toFixed(2)}`} positive={mockStats.totalPnl >= 0} />
        <StatCard label="Gross P/L" value={`$${mockStats.grossPnl.toFixed(2)}`} positive={mockStats.grossPnl >= 0} />
        <StatCard label="Win Rate" value={`${mockStats.winRate}%`} sub={`${mockStats.profitTrades.count}W / ${mockStats.lossTrades.count}L`} />
        <StatCard label="Total Trades" value={mockStats.numTrades} sub={`${mockStats.numContracts} contracts`} />
        <StatCard label="Avg Trade" value={`$${mockStats.expectancy.toFixed(2)}`} positive={mockStats.expectancy >= 0} sub="expectancy" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '20px' }}>
        {/* P&L chart */}
        <div className="card" style={{ padding: '20px' }}>
          <h3 className="card-title">P&L History</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={pnlHistoryData} margin={{top:10,right:10,bottom:0,left:0}}>
              <XAxis dataKey="trade" tick={{fontSize:11,fill:'var(--text-muted)'}} axisLine={false} tickLine={false} label={{value:'Trade #',position:'insideBottom',offset:-2,fill:'var(--text-muted)',fontSize:11}}/>
              <YAxis tick={{fontSize:11,fill:'var(--text-muted)'}} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`}/>
              <Tooltip formatter={(v) => [v >= 0 ? `$${v.toFixed(2)}` : `$(${Math.abs(v).toFixed(2)})`, 'P&L']} contentStyle={{background:'#1c2128',border:'1px solid var(--border)',borderRadius:'6px',fontSize:'13px'}}/>
              <Bar dataKey="pnl" radius={[2,2,0,0]}>
                {pnlHistoryData.map((entry, i) => <Cell key={i} fill={entry.pnl >= 0 ? '#3fba50' : '#f85149'}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Win/Loss summary */}
        <div className="card" style={{ padding: '20px' }}>
          <h3 className="card-title">Performance Summary</h3>
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span className="text-muted" style={{ fontSize: '13px' }}>Win Rate</span>
              <span style={{ color: 'var(--accent-green)', fontSize: '13px' }}>{mockStats.winRate}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill green" style={{ width: `${mockStats.winRate}%` }} />
            </div>
          </div>
          {[
            ['Largest Win', `$${mockStats.profitTrades.largestWin.toFixed(2)}`, true],
            ['Avg Win', `$${mockStats.profitTrades.avgWin.toFixed(2)}`, true],
            ['Largest Loss', `$(${Math.abs(mockStats.lossTrades.largestLoss).toFixed(2)})`, false],
            ['Avg Loss', `$(${Math.abs(mockStats.lossTrades.avgLoss).toFixed(2)})`, false],
            ['Max Drawdown', `$(${Math.abs(mockStats.lossTrades.maxDrawdown).toFixed(2)})`, false],
            ['Trade Fees', `$(${Math.abs(mockStats.tradeFees).toFixed(2)})`, false],
          ].map(([k, v, pos]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
              <span className="text-muted" style={{ fontSize: '13px' }}>{k}</span>
              <span style={{ color: pos ? 'var(--accent-green)' : 'var(--accent-red)', fontSize: '13px' }}>{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent trades table */}
      <div className="card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 className="card-title" style={{ margin: 0 }}>Recent Trades</h3>
          <a href="/trades" className="link-green" style={{ fontSize: '13px' }}>View all →</a>
        </div>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                {['Date', 'Symbol', 'Side', 'Qty', 'Entry', 'Exit', 'Duration', 'P&L'].map(h => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentTrades.map(trade => (
                <tr key={trade.id}>
                  <td className="text-muted">{trade.date}</td>
                  <td><span className="badge badge-symbol">{trade.symbol}</span></td>
                  <td><span className={`badge ${trade.side === 'Long' ? 'badge-long' : 'badge-short'}`}>{trade.side}</span></td>
                  <td>{trade.qty}</td>
                  <td>{trade.entry.toFixed(2)}</td>
                  <td>{trade.exit.toFixed(2)}</td>
                  <td className="text-muted">{trade.duration}</td>
                  <td className={trade.pnl >= 0 ? 'text-green' : 'text-red'}>
                    {trade.pnl >= 0 ? `$${trade.pnl.toFixed(2)}` : `$(${Math.abs(trade.pnl).toFixed(2)})`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
