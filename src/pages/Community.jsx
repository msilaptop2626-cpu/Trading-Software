import React, { useState } from 'react'
import { communityPosts } from '../data/mockData.js'

export default function Community() {
  const [liked, setLiked] = useState({})
  const [filter, setFilter] = useState('recent')

  const toggleLike = (id) => setLiked(prev => ({ ...prev, [id]: !prev[id] }))

  return (
    <div className="page-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 className="page-title" style={{ margin: 0 }}>Community</h1>
        <div style={{ display: 'flex', gap: '4px' }}>
          {['recent', 'top', 'following'].map(f => (
            <button key={f} className={`view-toggle-btn${filter === f ? ' active' : ''}`} onClick={() => setFilter(f)} style={{ textTransform: 'capitalize' }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '20px' }}>
        <div>
          {communityPosts.map(post => (
            <div key={post.id} className="card" style={{ padding: '20px', marginBottom: '12px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--accent-green)', flexShrink: 0 }}>
                  {post.avatar}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div>
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{post.user}</span>
                      <span className="text-muted" style={{ fontSize: '12px', marginLeft: '8px' }}>{post.date}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <span className="badge badge-symbol">{post.symbol}</span>
                      <span className={post.pnl >= 0 ? 'text-green' : 'text-red'} style={{ fontWeight: 600 }}>
                        {post.pnl >= 0 ? `+$${post.pnl.toFixed(2)}` : `$(${Math.abs(post.pnl).toFixed(2)})`}
                      </span>
                    </div>
                  </div>
                  <p style={{ color: 'var(--text-primary)', margin: '0 0 12px', lineHeight: '1.6' }}>{post.content}</p>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {post.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
                    </div>
                    <div style={{ display: 'flex', gap: '16px', marginLeft: 'auto', alignItems: 'center' }}>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        {post.numTrades} trades · {post.winRate}% win rate
                      </div>
                      <button
                        onClick={() => toggleLike(post.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', color: liked[post.id] ? 'var(--accent-green)' : 'var(--text-muted)', fontSize: '13px' }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill={liked[post.id] ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                        </svg>
                        {post.likes + (liked[post.id] ? 1 : 0)}
                      </button>
                      <button style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '13px' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                        </svg>
                        {post.comments}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar */}
        <div>
          <div className="card" style={{ padding: '20px', marginBottom: '16px' }}>
            <h3 className="card-title">Top Traders This Week</h3>
            {[
              { name: 'FuturesKing', pnl: 1245.50, avatar: 'F' },
              { name: 'NQTrader_Pro', pnl: 872.25, avatar: 'N' },
              { name: 'MorningGapper', pnl: 534.00, avatar: 'M' },
              { name: 'ES_Scalper', pnl: 298.75, avatar: 'E' },
            ].map((trader, i) => (
              <div key={trader.name} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '13px', width: '16px' }}>#{i+1}</span>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--accent-green)', fontSize: '13px' }}>
                  {trader.avatar}
                </div>
                <span style={{ flex: 1, color: 'var(--text-primary)', fontSize: '13px' }}>{trader.name}</span>
                <span className="text-green" style={{ fontSize: '13px' }}>+${trader.pnl.toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="card" style={{ padding: '20px' }}>
            <h3 className="card-title">Trending Tags</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {['breakout', 'NQ', 'ES', 'trend', 'morning', 'scalp', 'reversal', 'support', 'resistance', 'runner'].map(tag => (
                <span key={tag} className="tag" style={{ cursor: 'pointer' }}>{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
