import { useCallback, useEffect, useRef, useState } from 'react'
import {
  getSpeechRecognitionConstructor,
  speechErrorMessage,
  type SpeechRecognitionLike,
} from './speech'

export type SpeechResultPayload = {
  transcript: string
  alternatives: string[]
}

export function useSpeechRecognition(
  onResult: (payload: SpeechResultPayload) => void,
) {
  const [supported] = useState(() =>
    Boolean(getSpeechRecognitionConstructor()),
  )
  const [listening, setListening] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null)
  const onResultRef = useRef(onResult)
  const mountedRef = useRef(true)

  useEffect(() => {
    onResultRef.current = onResult
  }, [onResult])

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      recognitionRef.current?.abort()
      recognitionRef.current = null
    }
  }, [])

  const start = useCallback(() => {
    const Constructor = getSpeechRecognitionConstructor()
    if (!Constructor) {
      setError(
        'Этот браузер не умеет слушать. Скажи букву вслух, а взрослый проверит.',
      )
      return
    }

    setError(null)
    let recognition = recognitionRef.current

    if (!recognition) {
      recognition = new Constructor()
      recognition.lang = 'ru-RU'
      recognition.continuous = false
      recognition.interimResults = false
      recognition.maxAlternatives = 5
      recognition.onstart = () => {
        if (!mountedRef.current) return
        setListening(true)
        setError(null)
      }
      recognition.onresult = (event) => {
        if (!mountedRef.current) return
        const result = event.results[event.results.length - 1]
        if (!result) return
        const alternatives = Array.from(
          { length: result.length },
          (_, index) => result[index]?.transcript?.trim() ?? '',
        ).filter(Boolean)
        onResultRef.current({
          transcript: alternatives[0] ?? '',
          alternatives,
        })
      }
      recognition.onerror = (event) => {
        if (!mountedRef.current) return
        setListening(false)
        const message = speechErrorMessage(event.error)
        if (message) setError(message)
      }
      recognition.onend = () => {
        if (!mountedRef.current) return
        setListening(false)
      }
      recognitionRef.current = recognition
    }

    try {
      recognition.start()
    } catch {
      try {
        recognition.abort()
      } catch {
        // Если распознавание уже завершилось — просто пробуем ещё раз.
      }
      try {
        recognition.start()
      } catch {
        setListening(false)
        setError('Не получилось включить микрофон. Попробуй ещё раз!')
      }
    }
  }, [])

  const stop = useCallback(() => {
    recognitionRef.current?.stop()
  }, [])

  const reset = useCallback(() => {
    setError(null)
  }, [])

  return { supported, listening, error, start, stop, reset }
}
