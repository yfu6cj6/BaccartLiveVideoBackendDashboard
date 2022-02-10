export function getFullDate(targetDate) {
  const D = new Date(targetDate)
  const y = D.getFullYear()
  let m = D.getMonth() + 1
  let d = D.getDate()

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

export function transTimeModel(time) {
  const index = time.indexOf('T')
  time = time.split('')
  time.splice(index, 1, ' ')
  time = time.join('')
  return time
}
