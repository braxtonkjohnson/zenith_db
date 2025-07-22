// src/pages/RegisterVendorStep1.tsx
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function RegisterVendorStep1() {
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    username: "",
    password: ""
  })

  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    localStorage.setItem("vendorStep1", JSON.stringify(formData))
    navigate("/register/vendor/step2")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-gray-800 flex items-center justify-center">
      <Card className="w-full max-w-md p-8 rounded-xl shadow-lg bg-white/10 backdrop-blur-md border border-white/20 text-white">
        <h1 className="text-2xl font-semibold text-center mb-6">User Information</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 bg-white/10 border-white/20 text-white"
            />
          </div>
          <div>
            <Label htmlFor="title">Your Title</Label>
            <Input
              id="title"
              name="title"
              type="text"
              placeholder="Owner, Manager, etc."
              value={formData.title}
              onChange={handleChange}
              className="mt-1 bg-white/10 border-white/20 text-white"
            />
          </div>
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              type="text"
              placeholder="Vendor login username"
              value={formData.username}
              onChange={handleChange}
              className="mt-1 bg-white/10 border-white/20 text-white"
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 bg-white/10 border-white/20 text-white"
            />
          </div>
          <Button type="submit" className="w-full mt-4">Continue</Button>
        </form>
      </Card>
    </div>
  )
}
