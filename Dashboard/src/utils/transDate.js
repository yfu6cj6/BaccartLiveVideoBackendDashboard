export function getFullDate(targetDate) {
  let D, y, m, d
  if (targetDate) {
    D = new Date(targetDate)
    y = D.getFullYear()
    m = D.getMonth() + 1
    d = D.getDate()
  } else {
    // y = fullYear
    // m = month
    // d = date
    D = new Date()
    y = D.getFullYear()
    m = D.getMonth() + 1
    d = D.getDate()
  }
  m = m > 9 ? m : `0${m}`
  d = d > 9 ? d : `0${d}`
  return `${y}-${m}-${d}`
}
export function initDatePickerRange() {
  const start = new Date()
  start.setHours(0, 0, 0, 0)
  const end = new Date()
  end.setHours(24, 0, 0, 0)
  return [start, end]
}
