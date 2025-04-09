// src/pages/LandingAuth.tsx
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Link, useNavigate } from "react-router-dom"
import { Quantum } from 'ldrs/react'
import 'ldrs/react/Quantum.css'
import axios from "axios"

export default function LandingAuth() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ username: "", password: "" })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const res = await axios.post("/api/vendor_users/login", {
        username: formData.username,
        password: formData.password
      })

      const { token, name, title, vendorID } = res.data

      if (!vendorID) {
        setError("Unable to access your vendor dashboard.")
        setIsLoading(false)
        return
      }

      localStorage.setItem("authToken", token)
      localStorage.setItem("vendorID", vendorID)
      localStorage.setItem("userName", name)
      localStorage.setItem("userTitle", title)

      setTimeout(() => {
      navigate(`/dashboard/vendor/${vendorID}`)
      }, 2000)
    } catch (err) {
      console.error("Login failed:", err)
      setError("Invalid username or password")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-gray-800 flex items-center justify-center">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center space-y-6">
          <Quantum size="200" speed="1.75" color="white" />
          <p className="text-white text-sm opacity-70">Loading your dashboard...</p>
        </div>
      ) : (
        <Card className="w-full max-w-md p-8 rounded-xl shadow-lg bg-white/10 backdrop-blur-md border border-white/20 text-white">
          <div className="flex flex-col items-center mb-6">
            <div className="bg-white/10 rounded-full p-4 border border-white/20 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-18 8h18" />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold">Zenith</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                placeholder="Username"
                className="mt-1 bg-white/10 border-white/20 text-white"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="mt-1 bg-white/10 border-white/20 text-white"
              />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <div className="flex items-center justify-between text-sm mt-2">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="form-checkbox rounded" />
                <span className="text-white">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-blue-300 hover:underline">Forgot password?</Link>
            </div>
            <Button type="submit" className="w-full mt-4">Login</Button>
            <Button type="button" className="w-full mt-2" onClick={() => navigate('/register')}>
              Register
            </Button>
          </form>
        </Card>
      )}
    </div>
  )
}






