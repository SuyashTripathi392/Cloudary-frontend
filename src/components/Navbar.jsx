import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

export const Navbar = () => {
  const { user, logout, loading } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  if (loading) {
    return (
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto p-4">Loading...</div>
      </div>
    );
  }

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    navigate(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
    setSearchTerm("");
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully!");
      navigate("/");
    } catch (err) {
      toast.error("Logout failed, try again!");
    }
  };

  const hideSearchBar =
    location.pathname === "/" ||
    location.pathname === "/login" ||
    location.pathname === "/signup";

  const isHome = location.pathname === "/";

  const handleLogoClick = () => {
    if (user) {
      navigate("/dashboard");
    }else{
      navigate('/ ')
    }
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div
              onClick={handleLogoClick}
              className={`flex-shrink-0 flex items-center cursor-pointer ${
                !user ? "cursor-default" : ""
              }`}
            >
              <svg
                className="h-8 w-8 text-blue-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                />
              </svg>
              <span className="ml-2 text-xl font-bold text-gray-900">
                Cloudary
              </span>
            </div>
          </div>

          {/* ✅ If home page, show only Login/Signup */}
          {isHome ? (
            <div className="hidden md:block">
              <div className="ml-4 flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm font-medium"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Search bar (only when not hidden) */}
              {!hideSearchBar && (
                <div className="flex-1 flex items-center justify-center px-2 lg:ml-6 lg:justify-end">
                  <form onSubmit={handleSearch} className="w-full max-w-lg">
                    <div className="relative">
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search files or folders..."
                        className="block w-full pl-4 pr-12 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                      <button
                        type="submit"
                        className="absolute inset-y-0 right-0 px-4 text-white bg-blue-600 rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        Search
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* User Actions */}
              <div className="ml-4 flex items-center md:ml-6">
                {user ? (
                  <div className="flex items-center">
                    <span className="hidden md:block text-sm font-medium text-gray-700 mr-4">
                      Hi, {user.name}
                    </span>
                    <button
                      onClick={handleLogout}
                      className="px-3 py-1 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="hidden md:block">
                    <div className="ml-4 flex items-center space-x-4">
                      <Link
                        to="/login"
                        className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                      >
                        Login
                      </Link>
                      <Link
                        to="/signup"
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm font-medium"
                      >
                        Sign Up
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};