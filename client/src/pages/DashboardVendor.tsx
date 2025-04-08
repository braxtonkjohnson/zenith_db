import Sidebar from "@/components/Sidebar"
import StatCard from "@/components/StatCard"
import CircleStatCard from "@/components/CircleStatCard"
import { Button } from "@/components/ui/button"

export default function DashboardVendor() {
  return (
    <div className="flex min-h-screen bg-slate-900 text-white">
      <Sidebar />

      <main className="flex-1 p-8 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Welcome back!</h1>
        </div>

        {/* Summary Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Total Transactions Today" value="128" />
          <StatCard title="Top Product" value="French Toast" />
          <StatCard title="Top Item Class" value="Food & Beverage" />
        </div>

        {/* Metrics Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <CircleStatCard title="Sales" value="$500" percent={64} color="emerald-400" />
          <CircleStatCard title="Profit" value="$150" percent={32} color="sky-400" />
          <StatCard title="Total Transactions" value="982" />
          <StatCard title="Projected Yearly Revenue" value="702" />
        </div>
      </main>
    </div>
  )
}



