import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Calendar from './pages/Calendar.jsx'
import Reports from './pages/Reports.jsx'
import Trades from './pages/Trades.jsx'
import Journal from './pages/Journal.jsx'
import NewTrade from './pages/NewTrade.jsx'
import Community from './pages/Community.jsx'
import Search from './pages/Search.jsx'
import ImportTrades from './pages/ImportTrades.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="reports" element={<Reports />} />
          <Route path="trades" element={<Trades />} />
          <Route path="journal" element={<Journal />} />
          <Route path="new-trade" element={<NewTrade />} />
          <Route path="community" element={<Community />} />
          <Route path="search" element={<Search />} />
          <Route path="import" element={<ImportTrades />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
