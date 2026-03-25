export const formatCurrency = (value, showSign = false) => {
  const abs = Math.abs(value)
  const formatted = abs.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  if (value < 0) return `$(${formatted})`
  if (showSign && value > 0) return `+$${formatted}`
  return `$${formatted}`
}

export const formatPnl = (value) => {
  const abs = Math.abs(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  if (value < 0) return { text: `$(${abs})`, positive: false }
  return { text: `$${abs}`, positive: true }
}

export const formatPercent = (value) => `${value.toFixed(2)}%`

export const formatDate = (dateStr) => {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })
}

export const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate()

export const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay()

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
