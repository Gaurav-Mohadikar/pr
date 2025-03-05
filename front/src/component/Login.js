"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

function Login() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    try {
      const response = await fetch("http://localhost:3000/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const contentType = response.headers.get("content-type")
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const data = await response.json()
        if (response.ok) {
          console.log("Login successful:", data)
          // You might want to store the token in localStorage or a secure cookie here
          localStorage.setItem('token', data.token);
          navigate("/attendance") // Redirect to dashboard or home page
        } else {
          setError(data.message || "Login failed. Please check your credentials and try again.")
        }
      } else {
        // If the response is not JSON, read it as text
        const text = await response.text()
        console.error("Non-JSON response:", text)
        setError("Received an unexpected response from the server. Please try again.")
      }
    } catch (error) {
      console.error("Error during login:", error)
      setError("An error occurred. Please try again later.")
    }
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-background via-purple-100 to-pink-100 
                    flex items-center justify-center p-4 relative overflow-hidden"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "-2s" }}
        ></div>
      </div>

      <div className="form-card w-full max-w-md relative z-10">
        <div className="text-center mb-12">
          <h1
            className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary text-transparent 
                         bg-clip-text mb-3"
          >
            Welcome Back!
          </h1>
          <p className="text-gray-600">We're so excited to see you again!</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="relative">
            <input
              type="email"
              className="input-field peer pt-8 pb-2 border border-gray-300"
              placeholder=" "
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <label className="floating-label">Email Address</label>
          </div>

          <div className="relative">
            <input
              type="password"
              className="input-field peer pt-8 pb-2 border border-gray-300"
              placeholder=" "
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
            <label className="floating-label">Password</label>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center space-x-2 cursor-pointer group">
              <div className="relative">
                <input type="checkbox" className="peer hidden" />
                <div
                  className="w-5 h-5 border-2 border-gray-300 rounded 
                                peer-checked:border-primary peer-checked:bg-primary
                                transition-all duration-200"
                ></div>
                <div
                  className="absolute top-[2px] left-[6px] w-1.5 h-3 border-r-2 border-b-2
                                border-white rotate-45 opacity-0 peer-checked:opacity-100
                                transition-opacity duration-200"
                ></div>
              </div>
              <span className="text-gray-600 group-hover:text-primary transition-colors duration-200">Remember me</span>
            </label>
            {/* <a href="#" className="text-primary hover:text-secondary transition-colors duration-200">
              Forgot Password?
            </a> */}
          </div>

          <button type="submit" className="btn-primary mt-8">
            Sign In
          </button>
        </form>

        <p className="mt-8 text-center text-gray-600">
          Don't have an account?{" "}
          <Link to="/signup" className="text-primary hover:text-secondary font-medium transition-colors duration-200">
            Create Account
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login

