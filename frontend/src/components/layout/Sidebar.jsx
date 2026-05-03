import React from 'react'
import { NavLink } from 'react-router-dom'
import { IoFolderOpenOutline, IoGridOutline, IoPeopleOutline, IoSettingsOutline, IoCheckboxOutline } from 'react-icons/io5'
import { Tooltip } from '../ui'
import { cn } from '../ui/cn'

const navItems = [
  { to: '/', label: 'Dashboard', icon: <IoGridOutline className="h-5 w-5" /> },
  { to: '/tasks', label: 'Tasks', icon: <IoCheckboxOutline className="h-5 w-5" /> },
  { to: '/projects', label: 'Projects', icon: <IoFolderOpenOutline className="h-5 w-5" /> },
 // { to: '/team', label: 'Team', icon: <IoPeopleOutline className="h-5 w-5" />, disabled: true },
 // { to: '/settings', label: 'Settings', icon: <IoSettingsOutline className="h-5 w-5" />, disabled: true },
]

function SidebarItem({ item, collapsed }) {
  const content = (
    <NavLink
      to={item.disabled ? '#' : item.to}
      onClick={(e) => item.disabled && e.preventDefault()}
      className={({ isActive }) =>
        cn(
          'group relative flex h-11 items-center rounded-xl px-3 text-sm font-medium transition',
          collapsed ? 'justify-center' : 'gap-2.5',
          item.disabled && 'cursor-not-allowed opacity-40',
          isActive
            ? 'bg-primary-50 text-primary-700'
            : 'text-dark-600 hover:bg-dark-100 hover:text-dark-900'
        )
      }
    >
      {({ isActive }) => (
        <>
          {isActive && <span className="absolute left-0 top-2 h-7 w-1 rounded-r bg-primary-500" />}
          {item.icon}
          {!collapsed && <span>{item.label}</span>}
        </>
      )}
    </NavLink>
  )

  if (!collapsed) return content
  return <Tooltip text={item.label}>{content}</Tooltip>
}

export default function Sidebar({ collapsed = false, className }) {
  return (
    <aside
      className={cn(
        'h-full border-r border-dark-100 bg-white/80 px-2 py-4 backdrop-blur transition-all duration-300',
        collapsed ? 'w-20' : 'w-64',
        className
      )}
    >
      <div className="space-y-1.5">
        {navItems.map((item) => (
          <SidebarItem key={item.label} item={item} collapsed={collapsed} />
        ))}
      </div>
    </aside>
  )
}
