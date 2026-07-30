'use client'

import Link from 'next/link'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

interface MobileMenuProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  navLinks: Array<{ href: string; label: string }>
  isActive: (href: string) => boolean
}

export default function MobileMenu({
  isOpen,
  onOpenChange,
  navLinks,
  isActive,
}: MobileMenuProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:w-96 p-0">
        <SheetHeader className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl font-bold text-gray-900">
              Menu
            </SheetTitle>
          </div>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <nav className="space-y-2" aria-label="Mobile navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => onOpenChange(false)}
                  className={`block px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive(link.href)
                      ? 'bg-emerald-50 text-emerald-900 font-semibold'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Separator */}
          <Separator className="bg-gray-200" />

          {/* Auth Buttons */}
          <div className="px-6 py-4 space-y-3">
            <Button
              variant="outline"
              className="w-full border-gray-300 text-gray-900 hover:bg-gray-50"
              onClick={() => onOpenChange(false)}
            >
              Sign in
            </Button>
            <Button
              className="w-full bg-emerald-900 hover:bg-emerald-800 text-white rounded-xl"
              onClick={() => onOpenChange(false)}
            >
              Get started
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
