/**
 * Tiny class-name helper (like clsx but zero-dep).
 * Usage: cn('base', condition && 'extra', { 'conditional': bool })
 */
export function cn(...args) {
  return args
    .flatMap((a) =>
      typeof a === 'object' && a !== null && !Array.isArray(a)
        ? Object.entries(a).filter(([, v]) => v).map(([k]) => k)
        : [a]
    )
    .filter(Boolean)
    .join(' ')
}

/**
 * Format timestamp for chat bubbles
 */
export function formatTime(date) {
  if (!(date instanceof Date)) date = new Date(date)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
