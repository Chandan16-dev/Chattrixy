import { useState, useEffect, useRef } from 'react'
import { randomBetween } from '../utils/strangerResponses'

/**
 * Animated live user counter.
 * Fluctuates between baseCount ± variance every interval ms.
 */
export function useLiveCounter(baseCount = 48312, variance = 2000) {
  const [count, setCount] = useState(baseCount + randomBetween(-500, 500))
  const directionRef = useRef(1)

  useEffect(() => {
    const tick = () => {
      setCount((prev) => {
        const delta = randomBetween(3, 47) * directionRef.current
        const next = prev + delta
        if (next >= baseCount + variance) directionRef.current = -1
        if (next <= baseCount - variance) directionRef.current = 1
        return next
      })
    }

    const interval = setInterval(tick, randomBetween(2500, 5000))
    return () => clearInterval(interval)
  }, [baseCount, variance])

  return count
}
