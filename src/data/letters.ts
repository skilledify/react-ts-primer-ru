import type { CSSProperties } from 'react'

export type LetterKind = 'vowel' | 'consonant' | 'sign'

export type LetterInfo = {
  /** Строчная буква — используется в адресах страниц. */
  id: string
  upper: string
  lower: string
  /** Как произнести название буквы вслух. */
  name: string
  word: string
  emoji: string
  /** Позиция изучаемой буквы в слове (для слов вроде «сыр»). */
  wordLetterIndex: number
  kind: LetterKind
  rhyme: string
  /** Название палитры из src/index.css. */
  palette: string
}

export const PALETTES = [
  { id: 'coral', from: '#FF7A7A', to: '#FF4D6D', soft: '#FFE3E6' },
  { id: 'sun', from: '#FFD166', to: '#FF9F1C', soft: '#FFF1CC' },
  { id: 'lime', from: '#B8E986', to: '#5FBF6B', soft: '#E8F8D9' },
  { id: 'mint', from: '#5EEAD4', to: '#14B8A6', soft: '#D9FBF4' },
  { id: 'sky', from: '#7DD3FC', to: '#3B82F6', soft: '#DDEFFF' },
  { id: 'grape', from: '#C4A1FF', to: '#8B5CF6', soft: '#EEE5FF' },
  { id: 'rose', from: '#FF9EC4', to: '#F43F8E', soft: '#FFE1EE' },
  { id: 'kiwi', from: '#A3E635', to: '#4D9E2F', soft: '#EAF9CE' },
] as const

export const KIND_LABEL: Record<LetterKind, string> = {
  vowel: 'гласная',
  consonant: 'согласная',
  sign: 'знак',
}

export const KIND_HINT: Record<LetterKind, string> = {
  vowel: 'Поётся голосом — попробуй пропеть!',
  consonant: 'Встречает преграду — произнеси чётко.',
  sign: 'Сам не читается, но меняет звук рядом.',
}

export const LETTERS: LetterInfo[] = [
  {
    id: 'а', upper: 'А', lower: 'а', name: 'а', word: 'арбуз', emoji: '🍉',
    wordLetterIndex: 0, kind: 'vowel', palette: 'coral',
    rhyme: 'Арбуз на солнце греется —\nи буква А нам нравится!',
  },
  {
    id: 'б', upper: 'Б', lower: 'б', name: 'бэ', word: 'барабан', emoji: '🥁',
    wordLetterIndex: 0, kind: 'consonant', palette: 'sun',
    rhyme: 'Барабан стучит: бам-бам!\nБукву Б я знаю сам.',
  },
  {
    id: 'в', upper: 'В', lower: 'в', name: 'вэ', word: 'виноград', emoji: '🍇',
    wordLetterIndex: 0, kind: 'consonant', palette: 'lime',
    rhyme: 'Виноград созрел в саду —\nбукву В легко найду.',
  },
  {
    id: 'г', upper: 'Г', lower: 'г', name: 'гэ', word: 'гриб', emoji: '🍄',
    wordLetterIndex: 0, kind: 'consonant', palette: 'mint',
    rhyme: 'Гриб под ёлкой подрастал,\nбукву Г я отыскал.',
  },
  {
    id: 'д', upper: 'Д', lower: 'д', name: 'дэ', word: 'дом', emoji: '🏠',
    wordLetterIndex: 0, kind: 'consonant', palette: 'sky',
    rhyme: 'Дом построим мы с тобой:\nД — как домик с трубой.',
  },
  {
    id: 'е', upper: 'Е', lower: 'е', name: 'е', word: 'енот', emoji: '🦝',
    wordLetterIndex: 0, kind: 'vowel', palette: 'grape',
    rhyme: 'Енот в траве шуршит,\nбуква Е к нам спешит.',
  },
  {
    id: 'ё', upper: 'Ё', lower: 'ё', name: 'ё', word: 'ёжик', emoji: '🦔',
    wordLetterIndex: 0, kind: 'vowel', palette: 'rose',
    rhyme: 'Ёжик нёс грибок домой:\nЁ — с двумя точками, друг мой.',
  },
  {
    id: 'ж', upper: 'Ж', lower: 'ж', name: 'жэ', word: 'жираф', emoji: '🦒',
    wordLetterIndex: 0, kind: 'consonant', palette: 'kiwi',
    rhyme: 'Жук жужжит: жу-жу-жу,\nбукву Ж я покажу.',
  },
  {
    id: 'з', upper: 'З', lower: 'з', name: 'зэ', word: 'зебра', emoji: '🦓',
    wordLetterIndex: 0, kind: 'consonant', palette: 'coral',
    rhyme: 'Зебра полосатенькая,\nбуква З — приятненькая!',
  },
  {
    id: 'и', upper: 'И', lower: 'и', name: 'и', word: 'индюк', emoji: '🦃',
    wordLetterIndex: 0, kind: 'vowel', palette: 'sun',
    rhyme: 'Индюк важно ходит,\nбукву И он находит.',
  },
  {
    id: 'й', upper: 'Й', lower: 'й', name: 'и краткое', word: 'йогурт', emoji: '🥛',
    wordLetterIndex: 0, kind: 'consonant', palette: 'lime',
    rhyme: 'Йогурт вкусный, сладкий,\nЙ — с короткой палочкой.',
  },
  {
    id: 'к', upper: 'К', lower: 'к', name: 'ка', word: 'кот', emoji: '🐱',
    wordLetterIndex: 0, kind: 'consonant', palette: 'mint',
    rhyme: 'Кот мурлычет у окна,\nбуква К у нас одна.',
  },
  {
    id: 'л', upper: 'Л', lower: 'л', name: 'эль', word: 'лиса', emoji: '🦊',
    wordLetterIndex: 0, kind: 'consonant', palette: 'sky',
    rhyme: 'Лиса в лесу гуляет,\nбукву Л все знают.',
  },
  {
    id: 'м', upper: 'М', lower: 'м', name: 'эм', word: 'мяч', emoji: '⚽',
    wordLetterIndex: 0, kind: 'consonant', palette: 'grape',
    rhyme: 'Мячик прыгает легко:\nМ — как мостик высоко.',
  },
  {
    id: 'н', upper: 'Н', lower: 'н', name: 'эн', word: 'носорог', emoji: '🦏',
    wordLetterIndex: 0, kind: 'consonant', palette: 'rose',
    rhyme: 'Носорог большой идёт,\nбукву Н с собой везёт.',
  },
  {
    id: 'о', upper: 'О', lower: 'о', name: 'о', word: 'облако', emoji: '☁️',
    wordLetterIndex: 0, kind: 'vowel', palette: 'kiwi',
    rhyme: 'Облако над нами тает,\nО — кружок напоминает.',
  },
  {
    id: 'п', upper: 'П', lower: 'п', name: 'пэ', word: 'пингвин', emoji: '🐧',
    wordLetterIndex: 0, kind: 'consonant', palette: 'coral',
    rhyme: 'Пингвин шагает по льдинке,\nП — как парус на картинке.',
  },
  {
    id: 'р', upper: 'Р', lower: 'р', name: 'эр', word: 'рыба', emoji: '🐟',
    wordLetterIndex: 0, kind: 'consonant', palette: 'sun',
    rhyme: 'Рыбка плавает в воде —\nбуква Р нужна везде.',
  },
  {
    id: 'с', upper: 'С', lower: 'с', name: 'эс', word: 'солнце', emoji: '☀️',
    wordLetterIndex: 0, kind: 'consonant', palette: 'lime',
    rhyme: 'Солнце в небе ярко светит,\nС — как серпик, любят дети.',
  },
  {
    id: 'т', upper: 'Т', lower: 'т', name: 'тэ', word: 'торт', emoji: '🎂',
    wordLetterIndex: 0, kind: 'consonant', palette: 'mint',
    rhyme: 'Торт на празднике стоит,\nТ — как торт, — нам говорит.',
  },
  {
    id: 'у', upper: 'У', lower: 'у', name: 'у', word: 'улитка', emoji: '🐌',
    wordLetterIndex: 0, kind: 'vowel', palette: 'sky',
    rhyme: 'Улитка медленно ползёт,\nУ — как рожки, вперёд ведёт.',
  },
  {
    id: 'ф', upper: 'Ф', lower: 'ф', name: 'эф', word: 'флаг', emoji: '🚩',
    wordLetterIndex: 0, kind: 'consonant', palette: 'grape',
    rhyme: 'Флаг на мачте гордо вьётся,\nбуква Ф нам улыбнётся.',
  },
  {
    id: 'х', upper: 'Х', lower: 'х', name: 'ха', word: 'хлеб', emoji: '🍞',
    wordLetterIndex: 0, kind: 'consonant', palette: 'rose',
    rhyme: 'Хлеб румяный испечём,\nХ — как крестик, мы найдём.',
  },
  {
    id: 'ц', upper: 'Ц', lower: 'ц', name: 'цэ', word: 'цыплёнок', emoji: '🐥',
    wordLetterIndex: 0, kind: 'consonant', palette: 'kiwi',
    rhyme: 'Цыплёнок жёлтенький бежит,\nЦ — как крючочек, — говорит.',
  },
  {
    id: 'ч', upper: 'Ч', lower: 'ч', name: 'че', word: 'черепаха', emoji: '🐢',
    wordLetterIndex: 0, kind: 'consonant', palette: 'coral',
    rhyme: 'Черепаха в гости шла,\nЧ — как чашка, — вот дела!',
  },
  {
    id: 'ш', upper: 'Ш', lower: 'ш', name: 'ша', word: 'шар', emoji: '🎈',
    wordLetterIndex: 0, kind: 'consonant', palette: 'sun',
    rhyme: 'Шар воздушный вверх летит,\nШ — как шарик, — говорит.',
  },
  {
    id: 'щ', upper: 'Щ', lower: 'щ', name: 'ща', word: 'щенок', emoji: '🐶',
    wordLetterIndex: 0, kind: 'consonant', palette: 'lime',
    rhyme: 'Щенок под ёлкой лает,\nбуква Щ нас забавляет.',
  },
  {
    id: 'ъ', upper: 'Ъ', lower: 'ъ', name: 'твёрдый знак', word: 'подъезд', emoji: '🏢',
    wordLetterIndex: 3, kind: 'sign', palette: 'mint',
    rhyme: 'Твёрдый знак — серьёзный знак,\nбез него нельзя никак.',
  },
  {
    id: 'ы', upper: 'Ы', lower: 'ы', name: 'ы', word: 'сыр', emoji: '🧀',
    wordLetterIndex: 1, kind: 'vowel', palette: 'sky',
    rhyme: 'Сыр на полке полежал,\nЫ — в середке, я узнал.',
  },
  {
    id: 'ь', upper: 'Ь', lower: 'ь', name: 'мягкий знак', word: 'медведь', emoji: '🐻',
    wordLetterIndex: 6, kind: 'sign', palette: 'grape',
    rhyme: 'Мягкий знак смягчает звук,\nмедведь — наш добрый друг.',
  },
  {
    id: 'э', upper: 'Э', lower: 'э', name: 'э', word: 'экскаватор', emoji: '🚜',
    wordLetterIndex: 0, kind: 'vowel', palette: 'rose',
    rhyme: 'Экскаватор землю копает,\nбуква Э нам помогает.',
  },
  {
    id: 'ю', upper: 'Ю', lower: 'ю', name: 'ю', word: 'юбка', emoji: '👗',
    wordLetterIndex: 0, kind: 'vowel', palette: 'kiwi',
    rhyme: 'Юбка кружится, летит,\nЮ — как юла, — говорит.',
  },
  {
    id: 'я', upper: 'Я', lower: 'я', name: 'я', word: 'яблоко', emoji: '🍎',
    wordLetterIndex: 0, kind: 'vowel', palette: 'coral',
    rhyme: 'Яблоко с дерева падает,\nбуква Я всех радует.',
  },
]

export const VOWELS = LETTERS.filter((letter) => letter.kind === 'vowel')
export const CONSONANTS = LETTERS.filter((letter) => letter.kind === 'consonant')
export const SIGNS = LETTERS.filter((letter) => letter.kind === 'sign')

/** Буквы, с которых начинаются слова — для игры «Найди букву». */
export const STARTING_LETTERS = LETTERS.filter(
  (letter) => letter.wordLetterIndex === 0,
)

export function getLetter(id: string | undefined) {
  return LETTERS.find((letter) => letter.id === id)
}

export function getLetterIndex(id: string | undefined) {
  return LETTERS.findIndex((letter) => letter.id === id)
}

export function getPalette(paletteId: string) {
  return PALETTES.find((palette) => palette.id === paletteId) ?? PALETTES[0]
}

export function letterStyle(letter: LetterInfo) {
  const palette = getPalette(letter.palette)
  return {
    '--card-from': palette.from,
    '--card-to': palette.to,
    '--card-soft': palette.soft,
  } as CSSProperties
}

export const GAME_WORDS = [
  { word: 'кот', emoji: '🐱' },
  { word: 'лиса', emoji: '🦊' },
  { word: 'дом', emoji: '🏠' },
  { word: 'мяч', emoji: '⚽' },
  { word: 'торт', emoji: '🎂' },
  { word: 'рыба', emoji: '🐟' },
  { word: 'зебра', emoji: '🦓' },
  { word: 'гриб', emoji: '🍄' },
  { word: 'луна', emoji: '🌙' },
  { word: 'сыр', emoji: '🧀' },
  { word: 'шар', emoji: '🎈' },
  { word: 'юла', emoji: '🌀' },
  { word: 'ёжик', emoji: '🦔' },
  { word: 'книга', emoji: '📚' },
]
