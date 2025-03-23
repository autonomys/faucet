export const formatSeconds = (timeInSeconds: number): string => {
  const hours = Math.floor(((timeInSeconds % 31536000) % 86400) / 3600)
  const minutes = Math.floor((((timeInSeconds % 31536000) % 86400) % 3600) / 60)
  const seconds = (((timeInSeconds % 31536000) % 86400) % 3600) % 60
  return hours + ' hours ' + minutes + ' minutes ' + seconds + ' seconds'
}
