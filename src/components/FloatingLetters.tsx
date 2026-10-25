const FLOATING = [
  { char: 'А', top: '6%', left: '4%', color: '#FF6B6B', delay: '0s', size: 46, duration: '8s' },
  { char: 'Б', top: '14%', left: '87%', color: '#FF9F1C', delay: '1.2s', size: 38, duration: '9s' },
  { char: 'Ж', top: '62%', left: '2%', color: '#3DDC97', delay: '0.6s', size: 34, duration: '10s' },
  { char: 'М', top: '40%', left: '93%', color: '#4CC9F0', delay: '2s', size: 42, duration: '8.5s' },
  { char: 'Я', top: '80%', left: '90%', color: '#9B5DE5', delay: '0.9s', size: 40, duration: '9.5s' },
  { char: 'Ё', top: '34%', left: '7%', color: '#FF8FAB', delay: '1.6s', size: 36, duration: '11s' },
  { char: 'У', top: '88%', left: '12%', color: '#A7E04A', delay: '0.3s', size: 30, duration: '8s' },
  { char: 'Ч', top: '24%', left: '38%', color: '#FFC53D', delay: '2.4s', size: 28, duration: '10.5s' },
]

export function FloatingLetters() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {FLOATING.map((item) => (
        <span
          key={item.char + item.left}
          className="absolute animate-float select-none font-black opacity-25"
          style={{
            top: item.top,
            left: item.left,
            color: item.color,
            fontSize: item.size,
            animationDelay: item.delay,
            animationDuration: item.duration,
            textShadow: '0 4px 0 rgba(255,255,255,0.6)',
          }}
        >
          {item.char}
        </span>
      ))}
    </div>
  )
}
