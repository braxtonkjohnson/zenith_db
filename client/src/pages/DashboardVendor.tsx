import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Sidebar from "@/components/Sidebar"
import StatCard from "@/components/StatCard"
import CircleStatCard from "@/components/CircleStatCard"
import axios from "axios"

export default function DashboardVendor() {
  const { vendorID } = useParams()
  const [vendorData, setVendorData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchVendorData = async () => {
      try {
        const res = await axios.get(`/api/vendors/${vendorID}`)
        setVendorData(res.data)
      } catch (err) {
        console.error("Failed to fetch vendor data:", err)
      } finally {
        setLoading(false)
      }
    }

    if (vendorID) fetchVendorData()
  }, [vendorID])

  return (
    <div className="flex min-h-screen bg-slate-900 text-white">
      <Sidebar />
      <main className="flex-1 p-8 space-y-8">
        {loading ? (
          <p>Loading vendor data...</p>
        ) : vendorData ? (
          <>
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold tracking-tight">
                Welcome back, {vendorData["Business Name"] || "Vendor"}!
              </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard title="Total Transactions Today" value="128" />
              <StatCard title="Top Product" value="French Toast" />
              <StatCard title="Top Item Class" value="Food & Beverage" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <CircleStatCard title="Sales" value="$500" percent={64} color="emerald-400" />
              <CircleStatCard title="Profit" value="$150" percent={32} color="sky-400" />
              <StatCard title="Total Transactions" value="982" />
              <StatCard title="Projected Yearly Revenue" value="702" />
            </div>
          </>
        ) : (
          <p>Vendor not found.</p>
        )}
      </main>
    </div>
  )
}




