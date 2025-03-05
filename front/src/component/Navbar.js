"use client";

import { useState, useEffect } from "react";
import {
  User,
  Settings,
  LogOut,
  ChevronDown,
  Home,
  Package,
  CreditCard,
  Star,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { FaUserTie } from "react-icons/fa";

function Navbar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    role: "User",
    profileImage: "/placeholder.svg?height=40&width=40",
    status: "active",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    profileImage: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  const location = useLocation();

  const navItems = [
    { name: "Attendance", icon: Home, badge: null, href: "/attendance" },
    { name: "Products", icon: Package, badge: "New", href: "/product" },
    { name: "Billing", icon: CreditCard, badge: null, href: "/billing" },
  ];

  useEffect(() => {
    fetchUserDetails();

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    const handleClickOutside = (event) => {
      if (isProfileOpen && !event.target.closest(".profile-dropdown")) {
        setIsProfileOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileOpen]);

  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:3000/api/user/userDetail",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      

      if (data.success) {
        const userData = data.data;
        setUserInfo({
          name: userData.name,
          email: userData.email,
          role: userData.role || "User",
          profileImage:
            userData.profileImage || "/placeholder.svg?height=40&width=40",
          status: "active",
        });
        setFormData({
          name: userData.name,
          email: userData.email,
          profileImage: null,
        });
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      const formDataToSend = new FormData();

      // Only append fields that have values
      if (formData.name) {
        formDataToSend.append("name", formData.name);
      }
      if (formData.email) {
        formDataToSend.append("email", formData.email);
      }
      if (formData.profileImage) {
        formDataToSend.append("profileImage", formData.profileImage);
      }

      const response = await fetch(
        "http://localhost:3000/api/user/updateProfile",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            // Don't set Content-Type header when sending FormData
            // browser will set it automatically with boundary
          },
          body: formDataToSend,
        }
      );

      const data = await response.json();

      if (data.success) {
        // Update local state with new data
        setUserInfo((prev) => ({
          ...prev,
          name: data.data.name,
          email: data.data.email,
          profileImage: data.data.profileImage || prev.profileImage,
        }));
        setIsEditing(false);
        setIsProfileOpen(false);
        alert("Profile updated successfully!");
      } else {
        throw new Error(data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert(error.message || "Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Add file type validation
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }
      // Add file size validation (e.g., 5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size should be less than 5MB");
        return;
      }
      setFormData((prev) => ({
        ...prev,
        profileImage: file,
      }));
    }
  };

  const getImagePreview = () => {
    if (formData.profileImage) {
      return URL.createObjectURL(formData.profileImage);
    }
    return userInfo.profileImage || "/placeholder.svg";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login"; // or use your login route
  };

  useEffect(() => {
    return () => {
      // Cleanup function to revoke object URLs
      if (formData.profileImage) {
        URL.revokeObjectURL(URL.createObjectURL(formData.profileImage));
      }
    };
  }, [formData.profileImage]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 font-sans transition-all duration-300 ${
        scrolled ? "translate-y-0" : ""
      }`}
    >
      <div
        className={`relative transition-all duration-300 ${
          scrolled
            ? "bg-gradient-to-r from-purple-600 via-pink-500 to-red-500"
            : "bg-gradient-to-r from-purple-600 via-pink-500 to-red-500"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <div className="relative group">
                {/* <span
                  className={`text-2xl font-black tracking-wider ${
                    scrolled
                      ? "text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500"
                      : "text-white"
                  }`}
                > */}
                <span
                  className={`text-2xl font-white text-white tracking-wider `}
                >
                <img src=" " alt="logo"/>
                </span>
                <div className="absolute -top-1 -right-12 transform rotate-12 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-2 py-0.5 rounded-lg shadow-lg group-hover:rotate-0 transition-all duration-300">
                  PRO
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="relative px-4 py-2 group"
                >
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <item.icon
                        className={`h-5 w-5 transition-all duration-300 ${
                          location.pathname === item.href
                            ? scrolled
                              ? "text-purple-600"
                              : "text-white"
                            : scrolled
                            ? "text-gray-400 group-hover:text-purple-600"
                            : "text-white/70 group-hover:text-white"
                        }`}
                      />
                      {item.badge && (
                        <span className="absolute -top-2 -right-2 px-1.5 py-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-[10px] font-bold rounded-full animate-pulse">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <span
                      className={`text-sm font-medium transition-all duration-300 ${
                        location.pathname === item.href
                          ? scrolled
                            ? "text-purple-600"
                            : "text-white"
                          : scrolled
                          ? "text-gray-100 group-hover:text-purple-600"
                          : "text-white/70 group-hover:text-white"
                      }`}
                    >
                      {item.name}
                    </span>
                  </div>
                  <span
                    className={`absolute bottom-0 left-0 w-full h-0.5 bg-white transform transition-transform duration-300 ${
                      location.pathname === item.href
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </Link>
              ))}
            </div>

            {/* Profile Section */}
            <div className="flex items-center space-x-4">
              <div className="relative profile-dropdown">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className={`flex items-center space-x-3 px-4 py-2 rounded-xl transition-all duration-300 ${
                    scrolled
                      ? "bg-gray-50 hover:bg-gray-100"
                      : "bg-white/10 hover:bg-white/20"
                  }`}
                >
                  <div className="relative">
                    {userInfo.profile ? (
                      <img
                        className="h-16 w-16 rounded-full border-4 border-purple-200 dark:border-purple-900 object-cover"
                        src={userInfo.profile}
                        alt="Profile"
                      />
                    ) : (
                      <FaUserTie className="h-10 w-10 text-purple-500 border-4 border-purple-200 dark:border-purple-900 rounded-full p-2 bg-gray-200" />
                    )}
                    <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full ring-2 ring-white"></span>
                  </div>
                  <span className={scrolled ? "text-gray-700" : "text-white"}>
                    {userInfo.name || "Loading..."}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-300 ${
                      isProfileOpen ? "rotate-180" : ""
                    } ${scrolled ? "text-gray-600" : "text-white"}`}
                  />
                </button>

                {/* Profile Dropdown Menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl py-2 z-50 border border-gray-100 transform transition-all duration-300 ease-out dark:bg-gray-800 dark:border-gray-700">
                    <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                      {isEditing ? (
                        <form
                          onSubmit={handleUpdateProfile}
                          className="space-y-4"
                          encType="multipart/form-data"
                        >
                          <div className="flex items-center justify-center">
                            <div className="relative">
                              {userInfo.profile ? (
                                <img
                                  className="h-16 w-16 rounded-full border-4 border-purple-200 dark:border-purple-900 object-cover"
                                  src={userInfo.profile}
                                  alt="Profile"
                                />
                              ) : (
                                <FaUserTie className="h-16 w-16 text-purple-500 border-4 border-purple-200 dark:border-purple-900 rounded-full p-2 bg-gray-200" />
                              )}
                              <label className="absolute bottom-0 right-0 h-6 w-6 bg-purple-500 rounded-full ring-2 ring-white cursor-pointer">
                                <input
                                  type="file"
                                  className="hidden"
                                  accept="image/*"
                                  onChange={handleFileChange}
                                />
                                <User className="h-4 w-4 m-1 text-white" />
                              </label>
                            </div>
                          </div>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Name"
                          />
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Email"
                          />
                          <div className="flex justify-end space-x-2">
                            <button
                              type="button"
                              onClick={() => setIsEditing(false)}
                              className="px-4 py-2 text-sm text-gray-200 hover:text-gray-800"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              disabled={isLoading}
                              className="px-4 py-2 text-sm text-white bg-purple-600 rounded-lg hover:bg-purple-700 disabled:bg-purple-300 disabled:cursor-not-allowed"
                            >
                              {isLoading ? "Saving..." : "Save"}
                            </button>
                          </div>
                        </form>
                      ) : (
                        <div className="flex items-center space-x-4">
                          <div className="relative">
                            {userInfo.profile ? (
                              <img
                                className="h-16 w-16 rounded-full border-4 border-purple-200 dark:border-purple-900 object-cover"
                                src={userInfo.profile}
                                alt="Profile"
                              />
                            ) : (
                              <FaUserTie className="h-16 w-16 text-purple-500 border-4 border-purple-200 dark:border-purple-900 rounded-full p-2 bg-gray-200" />
                            )}
                            <span className="absolute bottom-0 right-0 h-4 w-4 bg-green-500 rounded-full ring-2 ring-white dark:ring-gray-800"></span>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {userInfo.name}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {userInfo.email}
                            </p>
                            {/* <div className="flex items-center mt-2">
                              <Star className="w-4 h-4 text-yellow-400" />
                              <span className="ml-1.5 text-sm font-medium text-gray-600 dark:text-gray-300">
                                {userInfo.role}
                              </span>
                            </div> */}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="px-2 py-2 space-y-1">
                      <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 rounded-xl transition-colors group dark:text-gray-300 dark:hover:bg-purple-900/20"
                      >
                        <div className="p-2 rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-900/20">
                          <User className="h-5 w-5 text-white" />
                        </div>
                        <span className="group-hover:text-purple-600 dark:group-hover:text-purple-400">
                          {isEditing ? "View Profile" : "Edit Profile"}
                        </span>
                      </button>
                      {/* <button className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 rounded-xl transition-colors group dark:text-gray-300 dark:hover:bg-purple-900/20">
                        <div className="p-2 rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-900/20">
                          <Settings className="h-5 w-5" />
                        </div>
                        <span className="group-hover:text-purple-600 dark:group-hover:text-purple-400">
                          Settings
                        </span>
                      </button> */}
                    </div>
                    <div className="border-t border-gray-100 px-2 py-2 mt-2 dark:border-gray-700">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors group dark:text-red-400 dark:hover:bg-red-900/20"
                      >
                        <div className="p-2 rounded-lg bg-red-50 text-red-600 dark:bg-red-900/20">
                          <LogOut className="h-5 w-5" />
                        </div>
                        <span className="group-hover:text-red-700 dark:group-hover:text-red-100">
                          Sign out
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-800 rounded-t-3xl shadow-2xl transform transition-transform duration-300 ${
            isMobileMenuOpen ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <div className="px-4 py-6 space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                  location.pathname === item.href
                    ? "bg-purple-50 text-purple-600 dark:bg-purple-900/20"
                    : "text-gray-600 hover:bg-purple-50 hover:text-purple-600 dark:text-gray-300 dark:hover:bg-purple-900/10"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-1 bg-gradient-to-r from-purple-600 to-pink-500 text-white text-xs font-bold rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
