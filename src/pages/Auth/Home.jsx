import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Home() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard"); // already logged in -> dashboard
    }
  }, [user, loading, navigate]);

  // jab tak loading hai tab kuch show karna (optional spinner)
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600 text-lg">Checking session...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="text-center max-w-2xl">
        {/* Logo/Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-blue-600 p-4 rounded-2xl shadow-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-white"
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
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-5xl font-bold text-gray-800 mb-6">
          Welcome to <span className="text-blue-600">Cloudary</span>
        </h1>

        {/* Subheading */}
        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
          Your secure cloud storage solution. Store, share, and access your files
          from anywhere, anytime.
        </p>

        {/* CTA Button */}
        <Link to="/signup">
          <button className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-xl shadow-lg hover:bg-blue-700 transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300">
            Get Started - It's Free
          </button>
        </Link>

        {/* Additional Features */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { icon: "🔒", text: "Secure Storage" },
            { icon: "🚀", text: "Fast Uploads" },
            { icon: "🌐", text: "Anywhere Access" },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition"
            >
              <div className="text-2xl mb-2">{feature.icon}</div>
              <p className="font-medium">{feature.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
