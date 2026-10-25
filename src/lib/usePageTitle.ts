import { useEffect } from 'react'

export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = title ? `${title} — Букварь` : 'Букварь — весёлая азбука'
  }, [title])
}
