export const limitText = (text: string, limit = 20) => (text.length > limit ? text.slice(0, limit) + '...' : text)
