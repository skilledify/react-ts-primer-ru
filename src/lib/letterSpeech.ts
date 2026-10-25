import type { LetterInfo } from '../data/letters'

/**
 * Дополнительные варианты, которые может вернуть распознавание речи.
 * Основное название буквы уже хранится в letter.name.
 */
const EXTRA_VARIANTS: Record<string, string[]> = {
  б: ['бэ', 'бе'],
  в: ['вэ', 'ве'],
  г: ['гэ', 'ге'],
  д: ['дэ', 'де'],
  ж: ['жэ', 'же'],
  з: ['зэ', 'зе'],
  й: ['й', 'и', 'и краткое', 'и кратк'],
  ё: ['ё', 'йо', 'е'],
  л: ['эль', 'эл'],
  м: ['эм'],
  н: ['эн'],
  р: ['эр'],
  с: ['эс'],
  ф: ['эф'],
  х: ['ха'],
  ц: ['цэ', 'це'],
  ч: ['че', 'чэ'],
  ш: ['ша', 'шэ'],
  щ: ['ща', 'щэ'],
  ъ: ['ъ', 'твердый знак', 'твёрдый знак', 'твердый'],
  ы: ['ы'],
  ь: ['ь', 'мягкий знак', 'мягкий'],
  э: ['э'],
  ю: ['ю', 'йу'],
  я: ['я', 'йа'],
}

export function normalizeSpeech(text: string): string {
  return text
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/[^a-zа-я0-9\s-]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function variantsFor(letter: LetterInfo): string[] {
  const variants = [
    letter.upper,
    letter.lower,
    letter.name,
    ...(EXTRA_VARIANTS[letter.id] ?? []),
  ]
  return [...new Set(variants.map(normalizeSpeech).filter(Boolean))]
}

/**
 * Проверяет, назвал ли ребёнок нужную букву.
 * Принимает и саму букву, и её название («б» или «бэ»),
 * а также фразы вроде «это буква бэ».
 */
export function matchesLetter(
  transcript: string,
  letter: LetterInfo,
): boolean {
  const normalized = normalizeSpeech(transcript)
  if (!normalized) return false

  const tokens = normalized.split(' ').filter(Boolean)
  const squashed = normalized.replace(/(.)\1+/g, '$1')
  const squashedTokens = squashed.split(' ').filter(Boolean)

  return variantsFor(letter).some((variant) => {
    if (variant.includes(' ')) {
      return normalized.includes(variant) || squashed.includes(variant)
    }
    return tokens.includes(variant) || squashedTokens.includes(variant)
  })
}
