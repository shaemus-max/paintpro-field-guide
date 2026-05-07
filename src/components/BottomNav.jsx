import { NavLink } from 'react-router-dom'

const TABS = [
  { to: '/',           label: 'Search',   icon: '🔍' },
  { to: '/compare',    label: 'Compare',  icon: '⚖️' },
  { to: '/favourites', label: 'Saved',    icon: '❤️' },
  { to: '/notes',      label: 'Notes',    icon: '📝' },
  { to: '/settings',   label: 'Settings', icon: '⚙️' },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-navy border-t border-white/10 pb-safe">
      <div className="flex">
        {TABS.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center gap-0.5 py-2 min-h-[56px] text-xs font-medium transition-colors ${
                isActive ? 'text-white' : 'text-gray-400'
              }`
            }
          >
            <span className="text-xl leading-none">{icon}</span>
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
