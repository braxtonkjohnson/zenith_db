import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Quantum } from 'ldrs/react'
import 'ldrs/react/Quantum.css'
import axios from "axios"

export default function RegisterVendorStep2() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    businessName: "",
    sector: "",
    zipCode: "",
    legalEntity: "",
    registeredEIN: "",
    address: "",
    phone: "",
    openHours: ""
  })

  const [sectors, setSectors] = useState<{ code: string, label: string }[]>([])
  const [zipCodes, setZipCodes] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const mockSectors = [
      { code: "AF", label: "Alcohol-focused vendors (bars, liquor stores, wineries, breweries)" },
      { code: "AP", label: "Appliances & electronics repair" },
      { code: "AT", label: "Auto services (mechanics, tire shops, car washes)" },
      { code: "CL", label: "Clothing & Apparel Stores" },
      { code: "CN", label: "Cleaning Services" },
      { code: "ED", label: "Education & Tutoring" },
      { code: "EI", label: "Schools & Educational Institutions" },
      { code: "EL", label: "Electronics & Tech Retail" },
      { code: "EN", label: "Entertainment venues (theaters, arcades, bowling alleys)" },
      { code: "EV", label: "Event services (weddings, party planners, DJs, AV rentals)" },
      { code: "FT", label: "Fitness & Training (gyms, studios, trainers)" },
      { code: "GM", label: "General Merchandise (Walmart, Target, dollar stores)" },
      { code: "GR", label: "Grocery Stores, Markets, Bodegas" },
      { code: "GS", label: "Gas Stations" },
      { code: "GV", label: "Government Offices & Services" },
      { code: "HC", label: "Healthcare (urgent care, clinics, dentists, optometrists)" },
      { code: "HM", label: "Home Improvement & Hardware" },
      { code: "IN", label: "Insurance & Consulting" },
      { code: "LG", label: "Legal & Financial Services" },
      { code: "NB", label: "Nonprofits & Community Services" },
      { code: "PS", label: "Personal Services (barbers, nails, salons, massage)" },
      { code: "RE", label: "Recreation (golf courses, climbing centers)" },
      { code: "RS", label: "Restaurants, Cafes, Coffee Shops, Confectionary, Dessert Shops" },
      { code: "SP", label: "Specialty Retail (books, games, hobby shops, etc.)" },
      { code: "ST", label: "Storage & Moving" },
      { code: "TR", label: "Transportation Services (bike shops, car rental, ride share hubs)" }
    ]

    const mockZipCodes = ["46204", "00601", "00602", "00603", "00606", "00610"]

    setSectors(mockSectors)
    setZipCodes(mockZipCodes)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleNext = async () => {
    setIsLoading(true)
    const step1 = localStorage.getItem("vendorStep1")
    if (!step1) return

    const { name, title, username, password } = JSON.parse(step1)

    const payload = {
      zipCode: formData.zipCode,
      sector: formData.sector,
      businessName: formData.businessName,
      legalEntity: formData.legalEntity,
      registeredEIN: formData.registeredEIN,
      address: formData.address,
      phone: formData.phone,
      openHours: formData.openHours,
      user: {
        name,
        title,
        username,
        password
      }
    }

    try {
      const res = await axios.post("/api/vendors/create", payload)
      const { vendorID } = res.data

      if (!vendorID) throw new Error("VendorID not returned")

      localStorage.setItem("vendorID", vendorID)
      localStorage.setItem("userName", name)
      localStorage.setItem("userTitle", title)

      navigate(`/dashboard/vendor/${vendorID}`)
    } catch (err) {
      console.error("Error creating vendor:", err)
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
            <h1 className="text-2xl font-semibold text-white">Business Details</h1>
          </div>

          <form className="space-y-4">
            <div>
              <Label htmlFor="businessName">Business Name</Label>
              <Input id="businessName" name="businessName" value={formData.businessName} onChange={handleChange} placeholder="ex. Zenith" className="mt-1 bg-white/10 border-white/20 text-white" />
            </div>

            <div>
              <Label htmlFor="sector">Sector</Label>
              <select id="sector" name="sector" value={formData.sector} onChange={handleChange} className="w-full mt-1 bg-white/10 border-white/20 text-white rounded px-3 py-2">
                <option value="" className="bg-slate-800 text-white">Select Sector</option>
                {sectors.map((s, i) => (
                  <option key={i} value={s.code} className="bg-slate-800 text-white">
                    {s.code} - {s.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="zipCode">Storefront Zip Code</Label>
              <select id="zipCode" name="zipCode" value={formData.zipCode} onChange={handleChange} className="w-full mt-1 bg-white/10 border-white/20 text-white rounded px-3 py-2">
                <option value="" className="bg-slate-800 text-white">Select Zip Code</option>
                {zipCodes.map((zip, i) => (
                  <option key={i} value={zip} className="bg-slate-800 text-white">{zip}</option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="legalEntity">Legal Entity</Label>
              <Input id="legalEntity" name="legalEntity" value={formData.legalEntity} onChange={handleChange} placeholder="ex. Zenith LLC" className="mt-1 bg-white/10 border-white/20 text-white" />
            </div>

            <div>
              <Label htmlFor="registeredEIN">Registered EIN</Label>
              <Input id="registeredEIN" name="registeredEIN" value={formData.registeredEIN} onChange={handleChange} placeholder="12-3456789" className="mt-1 bg-white/10 border-white/20 text-white" />
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <Input id="address" name="address" value={formData.address} onChange={handleChange} placeholder="123 Main St" className="mt-1 bg-white/10 border-white/20 text-white" />
            </div>

            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="555-123-4567" className="mt-1 bg-white/10 border-white/20 text-white" />
            </div>

            <div>
              <Label htmlFor="openHours">Open Hours</Label>
              <Input id="openHours" name="openHours" value={formData.openHours} onChange={handleChange} placeholder="9AM - 5PM" className="mt-1 bg-white/10 border-white/20 text-white" />
            </div>

            <Button type="button" className="w-full mt-4" onClick={handleNext}>Continue</Button>
          </form>
        </Card>
      )}
    </div>
  )
}






