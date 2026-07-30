'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {  Moon, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import SearchBar from './search-bar'
import MobileMenu from './mobile-menu'
import { Logo } from '../Logo'


const NAV_LINKS = [
  { href: '/properties', label: 'Browse' }
]

export default function Navbar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
const router=useRouter();
  const isActive = (href: string) => pathname === href

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    // Toggle dark mode logic here (e.g., update HTML class, local storage, etc.)
    if (!isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  return (
    <nav
      className="sticky top-0 z-50 w-full bg-white border-b border-gray-200"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
        {/* Left Section: Logo + Navigation Links */}
        <div className="flex items-center gap-8">
          {/* Logo */}
          <Logo/>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                  isActive(link.href)
                    ? 'text-gray-900 font-semibold bg-gray-100'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Center Section: Search Bar - Hidden on Mobile/Tablet */}
        <div className="hidden lg:flex flex-1 max-w-105 mx-8">
          <SearchBar />
        </div>

        {/* Right Section: Actions */}
        <div className="flex items-center gap-3">
          {/* Dark Mode Toggle - Hidden on Mobile */}
          <button
            onClick={toggleDarkMode}
            className="hidden sm:flex w-10 h-10 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <Moon className="w-5 h-5" />
          </button>

          {/* Sign In Button */}
          
          <Button
            variant="ghost"
            className="hidden sm:inline-flex text-gray-900 hover:bg-gray-100"
            aria-label="Sign in"
            onClick={()=>router.push('/auth/login')}
          >
            Sign in
          </Button>

          {/* Get Started Button */}
          <Button
            className="hidden sm:inline-flex bg-emerald-900 hover:bg-emerald-800 text-white rounded-lg px-6"
            aria-label="Get started"
          >
            Get started
          </Button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
            aria-label="Open menu"
            aria-expanded={mobileMenuOpen}
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Menu Sheet */}
        <MobileMenu
          isOpen={mobileMenuOpen}
          onOpenChange={setMobileMenuOpen}
          navLinks={NAV_LINKS}
          isActive={isActive}
        />
      </div>
    </nav>
  )
}
