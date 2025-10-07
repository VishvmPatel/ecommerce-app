import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navigation from './customers/components/Navigation/Navigation.jsx'
import HomePage from './customers/pages/HomePage/HomePage.jsx'
import LoginPage from './customers/pages/Auth/LoginPage/LoginPage.jsx'
import SignUpPage from './customers/pages/Auth/SignUpPage/SignUpPage.jsx'
import AboutUs from './customers/pages/AboutUs/AboutUs.jsx'
import ContactUs from './customers/pages/ContactUs/ContactUs.jsx'
import './App.css'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 w-full">
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
