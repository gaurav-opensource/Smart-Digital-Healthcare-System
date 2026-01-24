import { useState, useEffect, useContext } from "react";
import { NavLink, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; 


// Navbar Component
export default function Navbar() {
  const { isAuthenticated, role, logout } = useContext(AuthContext); 
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navClass = (isActive) =>
    `hover:text-purple-600 transition-colors ${
      isActive ? "text-purple-600 font-semibold" : "text-gray-800"
    }`;

  // Role-based navigation links
  const getRoleBasedLinks = () => {
    if (!isAuthenticated) return null;

    switch (role) {
      case "admin":
        return (
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) => navClass(isActive)}
            onClick={() => setIsOpen(false)}
          >
            Admin Dashboard
          </NavLink>
        );
      case "doctor":
        return (
          <>
           <NavLink
              to="/doctor/home"
              className={({ isActive }) => navClass(isActive)}
              onClick={() => setIsOpen(false)}
            >
             Home
            </NavLink>
            <NavLink
              to="/doctor/dashboard"
              className={({ isActive }) => navClass(isActive)}
              onClick={() => setIsOpen(false)}
            >
             Dashboard
            </NavLink>
            
            
            <NavLink
              to="/doctor/completed-appointments"
              className={({ isActive }) => navClass(isActive)}
              onClick={() => setIsOpen(false)}
            >
              Payment
            </NavLink>
          </>
        );
      case "user":
        return (
          <>
          <NavLink
              to="/user/home"
              className={({ isActive }) => navClass(isActive)}
              onClick={() => setIsOpen(false)}
            >
              Home
            </NavLink>
            <NavLink
              to="/user/dashboard"
              className={({ isActive }) => navClass(isActive)}
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/doctorlist"
              className={({ isActive }) => navClass(isActive)}
              onClick={() => setIsOpen(false)}
            >
              Doctors
            </NavLink>
            <NavLink
              to="/user/payment-history"
              className={({ isActive }) => navClass(isActive)}
              onClick={() => setIsOpen(false)}
            >
              Payment History
            </NavLink>
            <NavLink
              to="/predict"
              className={({ isActive }) => navClass(isActive)}
              onClick={() => setIsOpen(false)}
            >
              predict
            </NavLink>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md" : "bg-[#e3f2fd]"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left nav - Desktop */}
          <div className="hidden md:flex items-center space-x-6">
            {getRoleBasedLinks()}
          </div>

          {/* Center logo */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <div className="flex items-center text-2xl font-bold">

              
            
              Best<sup className="text-xs">®</sup>
              <span className="text-teal-500 ml-1">HEALTH</span>
            </div>
          </div>

          {/* Right side - Auth Buttons */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  to={`/${role}/profile`}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition duration-200 ${
                    isScrolled
                      ? "text-gray-700 hover:text-purple-600"
                      : "text-gray-800 hover:text-purple-600"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={logout} // use logout from context
                  className={`px-4 py-2 text-sm font-medium rounded-md transition duration-200 bg-purple-600 text-white hover:bg-purple-700`}
                >
                  Log Out
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className={`px-4 py-2 text-sm font-medium rounded-md transition duration-200 ${
                    isScrolled
                      ? "text-gray-700 hover:text-purple-600"
                      : "text-gray-800 hover:text-purple-600"
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 text-sm font-medium rounded-md transition duration-200 bg-purple-600 text-white hover:bg-purple-700"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-purple-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu panel */}
      <div className={`md:hidden ${isOpen ? "block" : "hidden"}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {getRoleBasedLinks()}
          {isAuthenticated ? (
            <>
              <Link
                to={`/${role}/profile`}
                className="block px-3 py-2 hover:text-purple-600"
                onClick={toggleMenu}
              >
                Profile
              </Link>
              <button
                onClick={logout}
                className="block w-full text-left px-3 py-2 hover:text-purple-600"
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="block px-3 py-2 hover:text-purple-600"
                onClick={toggleMenu}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="block px-3 py-2 hover:text-purple-600"
                onClick={toggleMenu}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
