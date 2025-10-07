import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import './CountrySelector.css';

const CountrySelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  
  const countries = [
    { name: 'India', code: 'IN', flag: '🇮🇳', currency: 'INR' },
    { name: 'Canada', code: 'CA', flag: '🇨🇦', currency: 'CAD' },
    { name: 'United States', code: 'US', flag: '🇺🇸', currency: 'USD' },
    { name: 'United Kingdom', code: 'GB', flag: '🇬🇧', currency: 'GBP' },
    { name: 'France', code: 'FR', flag: '🇫🇷', currency: 'EUR' },
    { name: 'Germany', code: 'DE', flag: '🇩🇪', currency: 'EUR' },
    { name: 'Japan', code: 'JP', flag: '🇯🇵', currency: 'JPY' },
    { name: 'Australia', code: 'AU', flag: '🇦🇺', currency: 'AUD' },
    { name: 'Italy', code: 'IT', flag: '🇮🇹', currency: 'EUR' },
    { name: 'Spain', code: 'ES', flag: '🇪🇸', currency: 'EUR' },
    { name: 'Brazil', code: 'BR', flag: '🇧🇷', currency: 'BRL' },
    { name: 'China', code: 'CN', flag: '🇨🇳', currency: 'CNY' },
    { name: 'Russia', code: 'RU', flag: '🇷🇺', currency: 'RUB' },
    { name: 'South Korea', code: 'KR', flag: '🇰🇷', currency: 'KRW' },
    { name: 'Mexico', code: 'MX', flag: '🇲🇽', currency: 'MXN' },
  ];

  const [selectedCountry, setSelectedCountry] = useState(countries[0]);

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: buttonRect.bottom + window.scrollY + 8,
        left: buttonRect.right - 288,
      });
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && 
          buttonRef.current && !buttonRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setIsOpen(false);
  };

  const dropdownContent = isOpen && (
    <div 
      ref={dropdownRef}
      className="country-selector-dropdown"
      style={{
        position: 'fixed',
        top: dropdownPosition.top,
        left: dropdownPosition.left,
        zIndex: 99999,
      }}
    >
      <div className="p-2">
        <div className="text-xs text-gray-500 px-2 py-1 mb-1 font-semibold">Select Country & Currency</div>
        {countries.map((country) => (
          <button
            key={country.code}
            onClick={() => handleCountrySelect(country)}
            className={`w-full text-left px-3 py-2 text-sm rounded-md hover:bg-purple-50 flex items-center transition-colors duration-200 ${
              selectedCountry.code === country.code ? 'bg-purple-100 text-purple-700 border border-purple-200' : 'text-gray-700 hover:text-purple-600'
            }`}
          >
            <span className="text-xl mr-3">{country.flag}</span>
            <div className="flex-1">
              <div className="font-medium">{country.name}</div>
              <div className="text-xs text-gray-500">{country.currency}</div>
            </div>
            {selectedCountry.code === country.code && (
              <span className="text-purple-600 font-bold">✓</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="relative country-selector-container">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center text-gray-700 hover:text-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded-lg px-3 py-2 bg-white border border-purple-200 hover:border-purple-300 transition-all duration-200 shadow-sm hover:shadow-md"
      >
        <span className="text-lg mr-2">{selectedCountry.flag}</span>
        <span className="text-sm font-medium">{selectedCountry.currency}</span>
        <ChevronDownIcon className={`ml-1 h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {createPortal(dropdownContent, document.body)}
    </div>
  );
};

export default CountrySelector;