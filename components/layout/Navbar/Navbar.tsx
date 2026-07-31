'use client'

import {  useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Moon, Menu, User, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import SearchBar from './search-bar'
import MobileMenu from './mobile-menu'
import { Logo } from '../../../app/shared/Logo'

import { UserResponse } from '@/types/user'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { MdDashboard } from 'react-icons/md'
import { CgProfile } from 'react-icons/cg'
import Image from 'next/image'

const NAV_LINKS = [
  { href: '/properties', label: 'Browses' }
]
type NavbarProps = {
  user: UserResponse;
};

export default function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();
  const userData = user.data;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const router = useRouter();
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
      className="sticky top-0 z-50 w-full border-b bg-background border-border"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
        {/* Left Section: Logo + Navigation Links */}
        <div className="flex items-center gap-8">
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg transition-all duration-200 ${isActive(link.href)
                  ? "bg-accent text-accent-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
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
            className="hidden sm:flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <Moon className="w-5 h-5" />
          </button>
          {user.success ?
            <Popover>
              <PopoverTrigger>
                <span className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-md hover:bg-accent">
                 {userData?.profileImage?<Image src={userData?.profileImage} alt='profileImage'/> :<User className="h-5 w-5" />}
                </span>
              </PopoverTrigger>

              <PopoverContent align="end" className="w-48 p-2">
                <Button onClick={()=>router.push('/dashboard/profile')} variant="ghost" className="w-full justify-start">
                  <CgProfile />  Profile
                </Button>

                <Button  onClick={()=>router.push(`/dashboard/${userData?.role.toLocaleLowerCase()}`)} variant="ghost" className="w-full justify-start">
                  <MdDashboard /> Dashboard
                </Button>

                <Button
                  variant="ghost"
                  className="w-full justify-start text-red-500"
                >
                  <LogOut /> Logout
                </Button>
              </PopoverContent>
            </Popover> : <div><Button><Link href={'/auth/login'}>Login</Link></Button>
              <Button onClick={() => router.push('/auth/login')}>Get Started</Button></div>}



          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
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
