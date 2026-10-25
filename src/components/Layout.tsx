import { useEffect } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useProgress } from '../context/ProgressContext'
import { useSound } from '../context/SoundContext'
import { AlphabetTicker } from './AlphabetTicker'

const NAV_ITEMS = [
  { to: '/', label: 'Главная', icon: '🏠', end: true },
  { to: '/alphabet', label: 'Азбука', icon: '🔤' },
  { to: '/games', label: 'Игры', icon: '🎮' },
  { to: '/write', label: 'Прописи', icon: '✏️' },
  { to: '/progress', label: 'Успехи', icon: '🏆' },
]

function Logo() {
  return (
    <Link
      to="/"
      className="group flex items-center gap-2.5 rounded-2xl py-1 pr-2 transition active:scale-95"
      aria-label="Букварь — на главную"
    >
      <span className="relative flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-white bg-[linear-gradient(135deg,#FFC53D,#FF6B6B_55%,#9B5DE5)] font-display text-2xl font-bold text-white shadow-sticker transition-transform duration-300 group-hover:rotate-[-6deg] md:h-12 md:w-12">
        Б
        <span className="absolute -top-1.5 -right-1.5 text-sm">✨</span>
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-display text-xl font-bold text-ink md:text-2xl">
          Букварь
        </span>
        <span className="mt-0.5 hidden text-[10px] font-extrabold tracking-[0.18em] text-ink-soft uppercase sm:block">
          весёлая азбука
        </span>
      </span>
    </Link>
  )
}

function Header() {
  const { progress } = useProgress()
  const { soundOn, toggleSound, play } = useSound()

  return (
    <header className="sticky top-0 z-50 border-b-2 border-white/70 bg-cream/85 backdrop-blur-xl">
      <div className="mx-auto flex h-[68px] w-full max-w-6xl items-center justify-between gap-3 px-4 md:h-20">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Основная навигация">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-extrabold transition-all duration-200 ${
                  isActive
                    ? 'bg-white text-ink shadow-sticker'
                    : 'text-ink-soft hover:-translate-y-0.5 hover:bg-white/60 hover:text-ink'
                }`
              }
            >
              <span aria-hidden="true">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/progress"
            aria-label={`Звёзды: ${progress.stars}. Перейти к успехам`}
            title="Мои звёзды"
            className="flex h-10 items-center gap-1.5 rounded-full border-2 border-sun bg-white/90 px-3.5 text-sm font-black text-ink shadow-sticker transition hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
          >
            <span aria-hidden="true" className="animate-sparkle">
              ⭐
            </span>
            <span key={progress.stars} className="animate-pop tabular-nums">
              {progress.stars}
            </span>
          </Link>

          <button
            type="button"
            onClick={() => {
              play('tap')
              toggleSound()
            }}
            aria-pressed={soundOn}
            aria-label={soundOn ? 'Выключить звук' : 'Включить звук'}
            title={soundOn ? 'Выключить звук' : 'Включить звук'}
            className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-white/80 text-lg shadow-sticker transition hover:-translate-y-0.5 active:translate-y-0 active:scale-90"
          >
            <span aria-hidden="true">{soundOn ? '🔊' : '🔇'}</span>
          </button>
        </div>
      </div>
    </header>
  )
}

function BottomNav() {
  return (
    <nav
      aria-label="Мобильная навигация"
      className="fixed inset-x-0 bottom-0 z-50 lg:hidden"
    >
      <div className="mx-auto max-w-md rounded-t-4xl border-t-2 border-white bg-paper/95 px-2 pt-1.5 pb-[max(0.4rem,env(safe-area-inset-bottom))] shadow-[0_-14px_34px_-20px_rgba(51,37,74,0.5)] backdrop-blur-xl">
        <ul className="flex items-stretch justify-between">
          {NAV_ITEMS.map((item) => (
            <li key={item.to} className="flex-1">
              <NavLink
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-0.5 rounded-2xl px-1 py-1.5 text-[10px] font-extrabold transition ${
                    isActive
                      ? 'bg-sun/30 text-ink'
                      : 'text-ink-soft active:bg-cream'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      aria-hidden="true"
                      className={`text-xl transition-transform duration-200 ${
                        isActive ? 'scale-110 -rotate-6' : ''
                      }`}
                    >
                      {item.icon}
                    </span>
                    {item.label}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [pathname])

  return null
}

export function Layout() {
  const { pathname } = useLocation()

  return (
    <div className="flex min-h-svh flex-col">
      <a
        href="#main"
        className="sr-only z-[100] rounded-full bg-ink px-4 py-2 text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        К содержанию
      </a>
      <ScrollToTop />
      <Header />
      <AlphabetTicker />
      <main
        id="main"
        className="mx-auto w-full max-w-6xl flex-1 px-4 pt-6 pb-28 md:pt-10 lg:pb-12"
      >
        <div key={pathname} className="animate-page">
          <Outlet />
        </div>
      </main>
      <footer className="mx-auto w-full max-w-6xl px-4 pt-4 pb-28 text-center text-xs font-bold text-ink-soft lg:pb-8">
        <p>
          Букварь · учимся играя{' '}
          <span aria-hidden="true" className="mx-1">
            💛
          </span>
        </p>
        <p className="mt-1 font-semibold opacity-70">
          Сделано на React, Vite и Tailwind CSS
        </p>
      </footer>
      <BottomNav />
    </div>
  )
}
