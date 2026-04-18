export function getRandomOddIntBetween(min, max) {
  if (min % 2 === 0) min += 1
  if (max % 2 === 0) max -= 1
  const range = (max - min) / 2 + 1
  return min + 2 * Math.floor(Math.random() * range)
}

export function getRandomInt(max) {
  return Math.floor(Math.random() * max)
}