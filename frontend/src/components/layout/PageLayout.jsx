import React, { useContext, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import { cn } from '../ui/cn'
import { IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5'

export default function PageLayout({ children }) {
  const { user } = useContext(AuthContext)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  // Unauthenticated Layout
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    )
  }

  // Authenticated Layout
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar onToggleMobile={() => setMobileOpen((prev) => !prev)} />

      <div className="relative mx-auto flex w-full max-w-[1600px] gap-4 px-3 pb-6 pt-3 sm:px-4 lg:px-6">
        
        {/* Sidebar Desktop Container */}
        <div className="relative hidden lg:block">
          <Sidebar 
            collapsed={sidebarCollapsed} 
            className="sticky top-20 h-[calc(100vh-6rem)] rounded-2xl shadow-sm" 
          />
          
          {/* Collapse Toggle Button - Anchored to Sidebar Edge */}
          <button
            className={cn(
              "absolute -right-3 top-6 z-50 flex h-7 w-7 items-center justify-center rounded-full border border-dark-200 bg-white shadow-sm transition-transform hover:bg-slate-50 focus:outline-none",
              "ring-offset-2 focus:ring-2 focus:ring-blue-500"
            )}
            onClick={() => setSidebarCollapsed((prev) => !prev)}
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={sidebarCollapsed ? 'Expand' : 'Collapse'}
          >
            {sidebarCollapsed ? (
              <IoChevronForwardOutline className="h-4 w-4 text-dark-600" />
            ) : (
              <IoChevronBackOutline className="h-4 w-4 text-dark-600" />
            )}
          </button>
        </div>

        {/* Mobile Sidebar Overlay */}
        {mobileOpen && (
          <>
            <div
              className="fixed inset-0 z-40 bg-dark-900/40 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <Sidebar className="fixed left-0 top-0 z-50 h-full w-72 lg:hidden" />
          </>
        )}

        {/* Main Content Area */}
        <main
          className={cn(
            'flex-1 transition-all duration-300 ease-in-out',
            // The margin is handled by the flex gap and sidebar width, 
            // but you can add specific spacing here if needed.
          )}
        >
          <div className="min-h-[calc(100vh-6rem)] space-y-6 rounded-2xl bg-white/70 p-4 backdrop-blur-md border border-white/20 shadow-sm sm:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}