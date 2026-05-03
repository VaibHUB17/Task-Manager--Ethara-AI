import React, { useContext, useMemo, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { IoChevronDown, IoMenuOutline, IoNotificationsOutline, IoSearchOutline, IoSettingsOutline, IoLogOutOutline, IoPersonCircleOutline } from 'react-icons/io5'
import { AuthContext } from '../../context/AuthContext'
import { Avatar, Dropdown } from '../ui'
import { cn } from '../ui/cn'

export default function Navbar({ onToggleMobile }){
  const { user, logout } = useContext(AuthContext)
  const [scrolled, setScrolled] = useState(false)

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8)
    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = useMemo(
    () => [
      { to: '/', label: 'Dashboard' },
      { to: '/projects', label: 'Projects' },
      { to: '/tasks', label: 'Tasks' },
    ],
    []
  )

  const userMenu = [
    { label: 'Log Out', icon: <IoLogOutOutline className="h-4 w-4" />, onClick: logout },
  //  { label: 'Profile', icon: <IoPersonCircleOutline className="h-4 w-4" />, onClick: () => {} },
  //  { label: 'Settings', icon: <IoSettingsOutline className="h-4 w-4" />, onClick: () => {} },
  ]

  return (
    <header
      className={cn(
        'sticky top-0 z-40 border-b border-dark-100/80 bg-white/80 backdrop-blur-xl transition-shadow',
        scrolled && 'shadow-md'
      )}
    >
      <nav className="mx-auto flex h-16 w-full max-w-[1600px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          {user && (
            <button
              className="focus-ring inline-flex h-9 w-9 items-center justify-center rounded-lg border border-dark-200 text-dark-600 lg:hidden"
              onClick={onToggleMobile}
              aria-label="Open menu"
            >
              <IoMenuOutline className="h-5 w-5" />
            </button>
          )}
          <Link to="/" className="font-display text-lg font-semibold tracking-tight text-dark-900 transition hover:text-primary-700">
            Ethara Tasks
          </Link>
        </div>


        {user && (
          <div className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'rounded-lg px-3 py-2 text-sm font-medium transition',
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-dark-600 hover:bg-dark-100 hover:text-dark-900'
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <button className="focus-ring relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-dark-200 bg-white text-dark-600 hover:bg-dark-50">
                <IoNotificationsOutline className="h-5 w-5" />
                <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-error" />
              </button>
              <Dropdown
                trigger={
                  <span className="inline-flex items-center gap-2 rounded-xl border border-dark-200 bg-white px-2.5 py-1.5">
                    <Avatar name={user.name} size="sm" />
                    <span className="hidden text-left sm:block">
                      <span className="block text-sm font-semibold text-dark-800">{user.name}</span>
                      <span className="block text-xs capitalize text-dark-500">{user.role}</span>
                    </span>
                    <IoChevronDown className="h-4 w-4 text-dark-500" />
                  </span>
                }
                items={userMenu}
              />
            </>
          ) : (
            <Link to="/login" className="">
             
            </Link>
          )}
        </div>
      </nav>

      {user && (
        <div className="border-t border-dark-100 px-4 py-2 lg:hidden">
          <div className="flex items-center gap-2 overflow-x-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium',
                    isActive ? 'bg-primary-50 text-primary-700' : 'text-dark-600 bg-white'
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
