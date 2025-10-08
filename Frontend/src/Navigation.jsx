'use client'

import { Fragment, useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
} from '@headlessui/react'
import { Bars3Icon, MagnifyingGlassIcon, ShoppingBagIcon, XMarkIcon, UserIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import CountrySelector from '../CountrySelector/CountrySelector'
import { useCart } from '../../../contexts/CartContext'

const navigation = {
  categories: [
    {
      id: 'new-arrivals',
      name: 'New Arrivals',
      href: '/new-arrivals',
    },
    {
      id: 'women',
      name: 'Women',
      href: '/women',
    },
    {
      id: 'men',
      name: 'Men', 
      href: '/men',
    },
    {
      id: 'accessories',
      name: 'Accessories',
      href: '/accessories',
    },
    {
      id: 'sale',
      name: 'Sale',
      href: '/sale',
    },
  ],
  pages: [
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ],
}

export default function Navigation() {
  const navigate = useNavigate()
  const { getCartItemsCount } = useCart()
  const [open, setOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const profileRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  return (
    <div className="bg-gradient-to-r from-white via-purple-50/30 to-pink-50/30 backdrop-blur-sm border-b border-purple-100/50 shadow-lg relative z-[9996]">
      <Dialog open={open} onClose={setOpen} className="relative z-40 lg:hidden">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-black/25 transition-opacity duration-300 ease-linear data-closed:opacity-0"
        />
        <div className="fixed inset-0 z-40 flex">
          <DialogPanel
            transition
            className="relative flex w-full max-w-xs transform flex-col overflow-y-auto bg-white pb-12 shadow-xl transition duration-300 ease-in-out data-closed:-translate-x-full"
          >
            <div className="flex px-4 pt-5 pb-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="relative -m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
              >
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Close menu</span>
                <XMarkIcon aria-hidden="true" className="size-6" />
              </button>
            </div>

            <div className="space-y-6 border-t border-gray-200 px-4 py-6">
              {navigation.categories.map((category) => (
                <div key={category.name} className="flow-root">
                  <Link to={category.href} className="-m-2 block p-2 font-medium text-gray-900 hover:text-purple-600 transition-colors duration-200">
                    {category.name}
                  </Link>
                </div>
              ))}
            </div>

            <div className="space-y-6 border-t border-gray-200 px-4 py-6">
              {navigation.pages.map((page) => (
                <div key={page.name} className="flow-root">
                  <Link to={page.href} className="-m-2 block p-2 font-medium text-gray-900 hover:text-purple-600 transition-colors duration-200">
                    {page.name}
                  </Link>
                </div>
              ))}
            </div>

            <div className="space-y-6 border-t border-gray-200 px-4 py-6">
              <div className="flow-root">
                <Link to="/login" className="-m-2 block p-2 font-medium text-gray-900">
                  Sign in
                </Link>
              </div>
              <div className="flow-root">
                <Link to="/signup" className="-m-2 block p-2 font-medium text-gray-900">
                  Create account
                </Link>
              </div>
            </div>

            <div className="border-t border-gray-200 px-4 py-6">
              <div className="flex items-center justify-between">
                <span className="text-base font-medium text-gray-900">Country & Currency</span>
                <CountrySelector />
              </div>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      <header className="relative bg-gradient-to-r from-white/95 via-purple-50/50 to-pink-50/50 backdrop-blur-sm z-[9997]">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600"></div>
          <div className="absolute inset-0 bg-black/10"></div>
          <p className="relative flex h-10 items-center justify-center px-4 text-sm font-medium text-white sm:px-6 lg:px-8">
            ✨ Get free delivery on orders over ₹2000
          </p>
        </div>

        <nav aria-label="Top" className="w-full px-2 sm:px-4 lg:px-6">
          <div className="border-b border-purple-200/50">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  className="relative rounded-md bg-white p-2 text-gray-400 lg:hidden mr-4"
                >
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open menu</span>
                  <Bars3Icon aria-hidden="true" className="size-6" />
                </button>

                <div className="flex items-center">
                  <Link to="/" className="flex items-center group">
                    <span className="sr-only">Fashion Forward</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <span className="text-white font-bold text-lg">F</span>
                      </div>
                      <span className="text-xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent whitespace-nowrap">
                        Fashion Forward
                      </span>
                    </div>
                  </Link>
                </div>

                <div className="hidden lg:ml-8 lg:block lg:self-stretch">
                  <div className="flex h-full space-x-6">
                    {navigation.categories.map((category) => (
                      <Link
                        key={category.name}
                        to={category.href}
                        className="flex items-center text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors duration-200 relative group whitespace-nowrap px-3 py-1"
                      >
                        {category.name}
                        <span className="absolute inset-x-0 -bottom-px h-0.5 bg-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
                      </Link>
                    ))}
                    {navigation.pages.map((page) => (
                      <Link
                        key={page.name}
                        to={page.href}
                        className="flex items-center text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors duration-200 relative group whitespace-nowrap px-3 py-1"
                      >
                        {page.name}
                        <span className="absolute inset-x-0 -bottom-px h-0.5 bg-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex-1 max-w-md mx-8">
                <form onSubmit={handleSearch} className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search for products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  />
                </form>
              </div>

              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-4">
                  <Link to="/cart" className="group -m-2 flex items-center p-2 hover:bg-purple-50 rounded-lg transition-colors duration-300">
                    <ShoppingBagIcon
                      aria-hidden="true"
                      className="size-6 shrink-0 text-gray-400 group-hover:text-purple-600 transition-colors duration-300"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-purple-600 transition-colors duration-300">
                      {getCartItemsCount()}
                    </span>
                    <span className="sr-only">items in cart, view bag</span>
                  </Link>

                  <CountrySelector />

                  <div className="relative" ref={profileRef}>
                    <button
                      onClick={() => setProfileOpen(!profileOpen)}
                      className="flex items-center space-x-2 p-2 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors duration-300"
                    >
                      <UserIcon className="size-6" />
                      <ChevronDownIcon className="size-4" />
                    </button>

                    {profileOpen && (
                      <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                        {!isLoggedIn ? (
                          <>
                            <Link
                              to="/login"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200"
                              onClick={() => setProfileOpen(false)}
                            >
                              Sign In
                            </Link>
                            <Link
                              to="/signup"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200"
                              onClick={() => setProfileOpen(false)}
                            >
                              Create Account
                            </Link>
                            <div className="border-t border-gray-200 my-2"></div>
                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200">
                              Track Order
                            </a>
                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200">
                              Help & Support
                            </a>
                          </>
                        ) : (
                          <>
                            <div className="px-4 py-2 border-b border-gray-200">
                              <p className="text-sm font-medium text-gray-900">John Doe</p>
                              <p className="text-xs text-gray-500">john.doe@example.com</p>
                            </div>
                            <Link
                              to="/profile"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200"
                              onClick={() => setProfileOpen(false)}
                            >
                              My Profile
                            </Link>
                            <Link
                              to="/orders"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200"
                              onClick={() => setProfileOpen(false)}
                            >
                              My Orders
                            </Link>
                            <Link
                              to="/addresses"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200"
                              onClick={() => setProfileOpen(false)}
                            >
                              My Addresses
                            </Link>
                            <Link
                              to="/wishlist"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200"
                              onClick={() => setProfileOpen(false)}
                            >
                              Wishlist
                            </Link>
                            <div className="border-t border-gray-200 my-2"></div>
                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200">
                              Help & Support
                            </a>
                            <button
                              onClick={() => {
                                setIsLoggedIn(false)
                                setProfileOpen(false)
                              }}
                              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                            >
                              Sign Out
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  )
}
