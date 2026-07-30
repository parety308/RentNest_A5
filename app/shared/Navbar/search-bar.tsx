'use client'

import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

export default function SearchBar() {
  return (
    <div className="relative w-full">
      <Input
        type="text"
        placeholder="Search city or neighborhood"
        className="w-full pl-12 pr-4 py-2.5 rounded-md bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-emerald-900 focus:ring-2 focus:ring-emerald-100 transition-all"
        aria-label="Search rentals"
      />
      <Search
        className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
        aria-hidden="true"
      />
    </div>
  )
}
