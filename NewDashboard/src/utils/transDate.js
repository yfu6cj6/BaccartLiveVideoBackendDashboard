export function getFullDate(targetDate) {
  const D = new Date(targetDate)
  const y = D.getFullYear()
  let m = D.getMonth() + 1
  let d = D.getDate()
  let h = D.getHours()
  let min = D.getMinutes()
  let s = D.getSeconds()

  m = m > 9 ? m : `0${m}`
  d = d > 9 ? d : `0${d}`
  h = h > 9 ? h : `0${h}`
  min = min > 9 ? min : `0${min}`
  s = s > 9 ? s : `0${s}`
  return `${y}-${m}-${d} ${h}:${min}:${s}`
}

export function getFullDateString(targetDate) {
  const D = new Date(targetDate)
  const y = D.getFullYear()
  let m = D.getMonth() + 1
  let d = D.getDate()
  let h = D.getHours()
  let min = D.getMinutes()
  let s = D.getSeconds()

  m = m > 9 ? m : `0${m}`
  d = d > 9 ? d : `0${d}`
  h = h > 9 ? h : `0${h}`
  min = min > 9 ? min : `0${min}`
  s = s > 9 ? s : `0${s}`
  return `${y}${m}${d}${h}${min}${s}`
}

export function getLastDate(last) {
  const end = new Date()
  const start = new Date()
  start.setTime(start.getTime() - 3600 * 1000 * 24 * last)
  return [start, end]
}

export function getLastDateClearTime(last) {
  const end = new Date()
  const start = new Date()
  start.setTime(start.getTime() - 3600 * 1000 * 24 * last)

  start.setHours(0)
  start.setMinutes(0)
  start.setSeconds(0)
  end.setHours(23)
  end.setMinutes(59)
  end.setSeconds(59)
  return [start, end]
}

export function getNextDate(next) {
  const end = new Date()
  const start = new Date()
  end.setTime(end.getTime() + 3600 * 1000 * 24 * next)
  return [start, end]
}
