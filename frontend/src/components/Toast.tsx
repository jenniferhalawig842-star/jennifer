import { useEffect } from 'react'

interface ToastProps {
  message: string
  icon?: string
  onDone: () => void
  duration?: number
}

export default function Toast({ message, icon = 'fa-circle-check', onDone, duration = 2200 }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onDone, duration)
    return () => clearTimeout(t)
  }, [onDone, duration])

  return (
    <div className="toast">
      <i className={`fas ${icon}`} />
      {message}
    </div>
  )
}
