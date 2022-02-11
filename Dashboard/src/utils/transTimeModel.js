export function transTimeModel(time) {
  const index = time.indexOf('T')
  time = time.split('')
  time.splice(index, 1, ' ')
  time = time.join('')
  return time
}
