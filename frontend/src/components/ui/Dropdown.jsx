import React, { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { cn } from './cn'

export default function Dropdown({ trigger, items = [], align = 'right' }) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="focus-ring rounded-xl">{trigger}</Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-150"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-100"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className={cn(
            'absolute z-30 mt-2 w-52 origin-top rounded-xl border border-dark-100 bg-white p-1.5 shadow-float',
            align === 'right' ? 'right-0' : 'left-0'
          )}
        >
          {items.map((item) => (
            <Menu.Item key={item.label}>
              {({ active }) => (
                <button
                  onClick={item.onClick}
                  className={cn(
                    'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-dark-700 transition',
                    active && 'bg-dark-100'
                  )}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              )}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  )
}
