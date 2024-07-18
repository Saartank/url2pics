import React from "react";
import cookie from "cookie";
const Navbar = ({ username, activeTab, setActiveTab }) => {
  const handleLogout = () => {
    document.cookie = cookie.serialize("client_auth_token", "", {
      maxAge: -1,
      path: "/",
    });

    window.location.href = "/";
  };
  return (
    <nav className="bg-white p-2 flex justify-between items-center w-full shadow-md rounded-md">
      <div>
        <span className="text-transparent text-bold text-3xl bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
          Url2Pics
        </span>
      </div>

      <div className="flex space-x-8">
        <button
          className={`text-lg font-semibold px-4 py-2 rounded ${
            activeTab === "Search New URL"
              ? "text-gray-600 bg-gray-100"
              : "text-gray-600 hover:text-blue-400"
          }`}
          onClick={() => setActiveTab("Search New URL")}
        >
          Search New URL
        </button>
        <button
          className={`text-lg font-semibold px-4 py-2 rounded ${
            activeTab === "Browse History"
              ? "text-gray-600 bg-gray-100"
              : "text-gray-600 hover:text-blue-400"
          }`}
          onClick={() => setActiveTab("Browse History")}
        >
          Browse History
        </button>
      </div>

      <div className="flex space-x-4 items-center">
        <span className="text-gray-800 text-xl">Hi {username}</span>
        <button
          onClick={handleLogout}
          className="text-white text-lg bg-blue-500 px-4 py-1 rounded hover:bg-blue-600"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
