'use client'

import { Fragment, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Popover,
  PopoverButton,
  PopoverPanel,
} from '@headlessui/react'
import { Bars3Icon, MagnifyingGlassIcon, ShoppingBagIcon, XMarkIcon, UserIcon, ChevronDownIcon, HeartIcon, ClipboardDocumentListIcon, Cog6ToothIcon, QuestionMarkCircleIcon, BellIcon, MapPinIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import CountrySelector from '../CountrySelector/CountrySelector'
import { useCart } from '../../../contexts/CartContext'
import { useAuth } from '../../../contexts/AuthContext'
import ProfileImage from '../../../components/ProfileImage/ProfileImage'

const navigation = {
  categories: [
    {
      id: 'new-arrivals',
      name: 'New Arrivals',
      href: '/new-arrivals',
    },
    {
      id: 'casual-wear',
      name: 'Casual Wear',
      href: '/category/casual-wear',
    },
    {
      id: 'formal-wear',
      name: 'Formal Wear', 
      href: '/category/formal-wear',
    },
    {
      id: 'ethnic-wear',
      name: 'Ethnic Wear',
      href: '/category/ethnic-wear',
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
  const { user, isAuthenticated, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [profileOpen, setProfileOpen] = useState(false)

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const closeDropdown = () => {
    setProfileOpen(false)
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
              {isAuthenticated ? (
                <>
                  <div className="flow-root">
                    <Link to="/profile" className="-m-2 block p-2 font-medium text-gray-900 hover:text-purple-600 transition-colors duration-200">
                      My Profile
                    </Link>
                  </div>
                  <div className="flow-root">
                    <Link to="/orders" className="-m-2 block p-2 font-medium text-gray-900 hover:text-purple-600 transition-colors duration-200">
                      My Orders
                    </Link>
                  </div>
                  <div className="flow-root">
                    <Link to="/wishlist" className="-m-2 block p-2 font-medium text-gray-900 hover:text-purple-600 transition-colors duration-200">
                      Wishlist
                    </Link>
                  </div>
                  <div className="flow-root">
                    <button
                      onClick={handleLogout}
                      className="-m-2 block p-2 font-medium text-gray-900 hover:text-purple-600 transition-colors duration-200 w-full text-left"
                    >
                      Sign Out
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flow-root">
                    <Link to="/login" className="-m-2 block p-2 font-medium text-gray-900 hover:text-purple-600 transition-colors duration-200">
                      Sign In
                    </Link>
                  </div>
                  <div className="flow-root">
                    <Link to="/signup" className="-m-2 block p-2 font-medium text-gray-900 hover:text-purple-600 transition-colors duration-200">
                      Create Account
                    </Link>
                  </div>
                </>
              )}
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

                  {isAuthenticated ? (
                    <Popover className="relative">
                      {({ close }) => (
                        <>
                          <PopoverButton className="group -m-2 flex items-center p-2 hover:bg-purple-50 rounded-lg transition-all duration-300 hover:shadow-md">
                        <div className="relative">
                          <ProfileImage 
                            src={user?.profilePicture} 
                            alt={`${user?.firstName} ${user?.lastName}`}
                            className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm"
                            fallbackClassName="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center"
                          />
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        </div>
                        <div className="ml-3 text-left">
                          <p className="text-sm font-medium text-gray-900 group-hover:text-purple-600 transition-colors duration-300">
                            {user?.firstName}
                          </p>
                          <p className="text-xs text-gray-500">My Account</p>
                        </div>
                        <ChevronDownIcon className="ml-2 w-4 h-4 text-gray-400 group-hover:text-purple-600 transition-colors duration-300" />
                      </PopoverButton>
                      <PopoverPanel className="absolute right-0 z-10 mt-2 w-64 origin-top-right rounded-xl bg-white py-2 shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none border border-gray-100">
                        {/* User Info Header */}
                        <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50">
                          <div className="flex items-center space-x-3">
                            <ProfileImage 
                              src={user?.profilePicture} 
                              alt={`${user?.firstName} ${user?.lastName}`}
                              className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                              fallbackClassName="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center"
                            />
                            <div>
                              <p className="text-sm font-semibold text-gray-900">{user?.firstName} {user?.lastName}</p>
                              <p className="text-sm text-gray-500">{user?.email}</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Account Section */}
                        <div className="py-2">
                          <div className="px-3 py-1">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Account</p>
                          </div>
                          <Link to="/my-profile" onClick={close} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200">
                            <UserIcon className="w-4 h-4 mr-3 text-gray-400" />
                            My Profile
                          </Link>
                 <Link to="/my-orders" onClick={close} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200">
                   <ClipboardDocumentListIcon className="w-4 h-4 mr-3 text-gray-400" />
                   My Orders
                 </Link>
                 <Link to="/wishlist" onClick={close} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200">
                   <HeartIcon className="w-4 h-4 mr-3 text-gray-400" />
                   Wishlist
                 </Link>
                 <Link to="/my-addresses" onClick={close} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200">
                   <MapPinIcon className="w-4 h-4 mr-3 text-gray-400" />
                   My Addresses
                 </Link>
                        </div>

                        {/* Support Section */}
                        <div className="py-2 border-t border-gray-100">
                          <div className="px-3 py-1">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Support</p>
                          </div>
                 <Link to="/help-support" onClick={close} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200">
                   <QuestionMarkCircleIcon className="w-4 h-4 mr-3 text-gray-400" />
                   Help & Support
                 </Link>
                 <Link to="/settings" onClick={close} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200">
                   <Cog6ToothIcon className="w-4 h-4 mr-3 text-gray-400" />
                   Settings
                 </Link>
                        </div>

                        {/* Sign Out */}
                        <div className="py-2 border-t border-gray-100">
                          <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-200"
                          >
                            <XMarkIcon className="w-4 h-4 mr-3" />
                            Sign Out
                          </button>
                        </div>
                      </PopoverPanel>
                        </>
                      )}
                    </Popover>
                  ) : (
                    <Popover className="relative">
                      {({ close }) => (
                        <>
                          <PopoverButton className="group -m-2 flex items-center p-2 hover:bg-purple-50 rounded-lg transition-all duration-300 hover:shadow-md">
                            <div className="w-8 h-8 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center">
                              <UserIcon className="w-5 h-5 text-white" />
                            </div>
                            <div className="ml-3 text-left">
                              <p className="text-sm font-medium text-gray-700 group-hover:text-purple-600 transition-colors duration-300">
                                Guest
                              </p>
                              <p className="text-xs text-gray-500">Sign in</p>
                            </div>
                            <ChevronDownIcon className="ml-2 w-4 h-4 text-gray-400 group-hover:text-purple-600 transition-colors duration-300" />
                          </PopoverButton>
                          <PopoverPanel className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-xl bg-white py-2 shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none border border-gray-100">
                        {/* Guest Section */}
                        <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50">
                          <p className="text-sm font-semibold text-gray-900">Welcome to Fashion Forward</p>
                          <p className="text-sm text-gray-500">Sign in to access your account</p>
                        </div>
                        
                        {/* Auth Actions */}
                        <div className="py-2">
                          <Link to="/login" onClick={close} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200">
                            <UserIcon className="w-4 h-4 mr-3 text-gray-400" />
                            Sign In
                          </Link>
                          <Link to="/signup" onClick={close} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200">
                            <UserIcon className="w-4 h-4 mr-3 text-gray-400" />
                            Create Account
                          </Link>
                        </div>

                        {/* Support Section */}
                        <div className="py-2 border-t border-gray-100">
                          <div className="px-3 py-1">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Support</p>
                          </div>
                 <Link to="/help-support" onClick={close} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200">
                   <QuestionMarkCircleIcon className="w-4 h-4 mr-3 text-gray-400" />
                   Help & Support
                 </Link>
                        </div>
                      </PopoverPanel>
                        </>
                      )}
                    </Popover>
                  )}

                  <CountrySelector />
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  )
}
