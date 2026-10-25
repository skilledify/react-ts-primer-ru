import { Link } from 'react-router-dom'
import { Mascot } from '../components/Mascot'
import { usePageTitle } from '../lib/usePageTitle'

export function NotFoundPage() {
  usePageTitle('Страница не найдена')

  return (
    <div className="card-surface mx-auto max-w-lg overflow-hidden p-8 text-center">
      <Mascot className="mx-auto w-44" />
      <p className="mt-2 text-6xl font-black text-ink/20">404</p>
      <h1 className="mt-1 font-display text-2xl font-bold text-ink">
        Ой! Эта страница потерялась
      </h1>
      <p className="mt-2 text-sm font-semibold text-ink-soft">
        Наверное, буква спряталась. Давай вернёмся в азбуку и найдём её!
      </p>
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        <Link
          to="/"
          className="rounded-full bg-ink px-5 py-2.5 text-sm font-black text-white shadow-sticker transition hover:-translate-y-0.5"
        >
          На главную
        </Link>
        <Link
          to="/alphabet"
          className="rounded-full border-2 border-white bg-white px-5 py-2.5 text-sm font-black text-ink shadow-sticker transition hover:-translate-y-0.5"
        >
          В азбуку
        </Link>
      </div>
    </div>
  )
}
