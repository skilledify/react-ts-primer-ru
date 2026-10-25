export type SpeechRecognitionAlternativeLike = {
  transcript: string
  confidence: number
}

export type SpeechRecognitionResultLike = {
  isFinal: boolean
  length: number
  [index: number]: SpeechRecognitionAlternativeLike
}

export type SpeechRecognitionResultListLike = {
  length: number
  [index: number]: SpeechRecognitionResultLike
}

export type SpeechRecognitionEventLike = {
  results: SpeechRecognitionResultListLike
}

export type SpeechRecognitionErrorEventLike = {
  error: string
  message?: string
}

export type SpeechRecognitionLike = {
  lang: string
  continuous: boolean
  interimResults: boolean
  maxAlternatives: number
  start: () => void
  stop: () => void
  abort: () => void
  onstart: (() => void) | null
  onend: (() => void) | null
  onresult: ((event: SpeechRecognitionEventLike) => void) | null
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike

type SpeechWindow = Window & {
  SpeechRecognition?: SpeechRecognitionConstructor
  webkitSpeechRecognition?: SpeechRecognitionConstructor
}

export function getSpeechRecognitionConstructor(): SpeechRecognitionConstructor | null {
  if (typeof window === 'undefined') return null
  const speechWindow = window as SpeechWindow
  return (
    speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition ?? null
  )
}

export function speechErrorMessage(error: string): string {
  switch (error) {
    case 'not-allowed':
    case 'service-not-allowed':
      return 'Разреши доступ к микрофону в настройках браузера — и попробуем ещё раз.'
    case 'no-speech':
      return 'Я не расслышал. Скажи громче и чётче!'
    case 'audio-capture':
      return 'Микрофон не найден. Проверь, что он подключён.'
    case 'network':
      return 'Не удалось связаться с сервисом распознавания. Попробуй позже.'
    case 'aborted':
      return ''
    default:
      return 'Не получилось расслышать. Попробуй ещё раз!'
  }
}
