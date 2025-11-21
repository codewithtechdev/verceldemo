import Link from 'next/link'
import { useState } from 'react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="fixed w-full bg-dark text-white z-50 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="text-xl font-bold font-montserrat hidden sm:block">
              CodeWithTechDev
            </span>
          </Link>

          {/* Desktop Navigation */}

          <Link href="/checkout" className="hover:text-accent transition font-medium">
  Checkout
</Link>
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="hover:text-accent transition font-medium">
              Home
            </Link>
            <Link href="/products" className="hover:text-accent transition font-medium">
              All Projects
            </Link>
            <Link href="/products?category=html-css-js" className="hover:text-accent transition font-medium">
              HTML/CSS/JS
            </Link>
            <Link href="/products?category=python" className="hover:text-accent transition font-medium">
              Python
            </Link>
            <Link href="/products?category=open-source" className="hover:text-accent transition font-medium">
              Open Source
            </Link>
            <Link href="/admin" className="hover:text-accent transition font-medium">
              Admin
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-dark border-t border-gray-700 py-4">
            <div className="flex flex-col space-y-4">
              <Link href="/" className="text-white hover:text-accent transition font-medium">
                Home
              </Link>
              <Link href="/products" className="text-white hover:text-accent transition font-medium">
                All Projects
              </Link>
              <Link href="/products?category=html-css-js" className="text-white hover:text-accent transition font-medium">
                HTML/CSS/JS
              </Link>
              <Link href="/products?category=python" className="text-white hover:text-accent transition font-medium">
                Python
              </Link>
              <Link href="/products?category=open-source" className="text-white hover:text-accent transition font-medium">
                Open Source
              </Link>
              <Link href="/admin" className="text-white hover:text-accent transition font-medium">
                Admin
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}