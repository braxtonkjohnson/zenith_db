import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Sidebar from "@/components/Sidebar"
import { UserCircle, Calendar, BarChart2, Home, AlertCircle, Package, ReceiptText } from "lucide-react"

export default function DashboardVendor() {
  // User info state
  const [userName, setUserName] = useState("Vendor User")
  const [userPosition, setUserPosition] = useState("Business Owner")
  const [userAvatar, setUserAvatar] = useState("/public/default-avatar.png")

  useEffect(() => {
    const storedName = localStorage.getItem("userName")
    const storedPosition = localStorage.getItem("userPosition")
    const storedAvatar = localStorage.getItem("userAvatar")
    if (storedName) setUserName(storedName)
    if (storedPosition) setUserPosition(storedPosition)
    if (storedAvatar) setUserAvatar(storedAvatar)
  }, [])

  // Business dashboard mock data
  const availableBalance = 32450
  const netWorth = 187200
  const spendings = 12890
  const income = 45200
  const incomeGoal = 60000
  const incomeGoalPercent = Math.round((income / incomeGoal) * 100)
  const spendingsByCategory = [
    { label: "Inventory", value: 5400, color: "#a78bfa", icon: <Package size={18} /> },
    { label: "Payroll", value: 3200, color: "#f472b6", icon: <UserCircle size={18} /> },
    { label: "Utilities", value: 1850, color: "#38bdf8", icon: <Home size={18} /> },
    { label: "Marketing", value: 1440, color: "#fbbf24", icon: <BarChart2 size={18} /> },
  ]
  const assets = [
    { label: "Equipment", value: 25000, color: "#fbbf24" },
    { label: "Inventory Stock", value: 18000, color: "#38bdf8" },
    { label: "Business Account", value: 90000, color: "#a78bfa" },
    { label: "Property", value: 54000, color: "#34d399" },
  ]
  const productSales = [
    { label: "Food & Beverage", value: 21000 },
    { label: "Office Supplies", value: 7800 },
    { label: "Cleaning Services", value: 5400 },
    { label: "Consulting", value: 11800 },
  ]
  const petExpenses = [
    { label: "Routine Vet", value: 0 },
    { label: "Food", value: 0 },
    { label: "Food Treats", value: 0 },
    { label: "Kennel Boarding", value: 0 },
  ]
  const transactions = [
    { class: "Food & Beverage", detail: "Catering", count: 34, amount: 8200 },
    { class: "Office Supplies", detail: "Paper & Ink", count: 19, amount: 2100 },
    { class: "Cleaning Services", detail: "Deep Clean", count: 7, amount: 3200 },
    { class: "Consulting", detail: "Strategy Session", count: 12, amount: 4800 },
  ]

  return (
    <div className="flex min-h-screen bg-[#181f2a] text-white">
      <Sidebar />
      <main className="flex-1 p-8 space-y-8">
        {/* Top bar removed: user info and date no longer shown */}

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Available Balance */}
          <div className="col-span-1 md:col-span-1 bg-[#232b3e] rounded-2xl p-6 flex flex-col justify-between shadow-lg">
            <div className="text-slate-300 text-sm">Available Balance</div>
            <div className="text-3xl font-bold text-emerald-400 mt-2 mb-4">${availableBalance.toLocaleString()}</div>
            <div className="text-slate-400 text-xs">Business Account Balance</div>
          </div>
          {/* Net Worth */}
          <div className="col-span-1 md:col-span-1 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-2xl p-6 flex flex-col justify-between shadow-lg">
            <div className="text-white text-sm">Total Net Worth</div>
            <div className="text-3xl font-bold text-white mt-2 mb-4">${netWorth.toLocaleString()}</div>
          </div>
          {/* Spendings */}
          <div className="col-span-1 md:col-span-1 bg-[#232b3e] rounded-2xl p-6 flex flex-col justify-between shadow-lg">
            <div className="text-slate-300 text-sm">Spendings</div>
            <div className="text-3xl font-bold text-pink-400 mt-2 mb-4">${spendings.toLocaleString()}</div>
            {/* Placeholder for line chart */}
            <div className="h-12 w-full bg-gradient-to-r from-pink-400/30 to-pink-400/10 rounded-lg mt-2 flex items-end">
              <div className="h-8 w-2 bg-pink-400 rounded-t-lg mx-1" />
              <div className="h-6 w-2 bg-pink-300 rounded-t-lg mx-1" />
              <div className="h-10 w-2 bg-pink-500 rounded-t-lg mx-1" />
              <div className="h-5 w-2 bg-pink-300 rounded-t-lg mx-1" />
              <div className="h-7 w-2 bg-pink-400 rounded-t-lg mx-1" />
            </div>
          </div>
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Income Source */}
          <div className="bg-[#232b3e] rounded-2xl p-6 shadow-lg">
            <div className="text-slate-300 text-sm mb-2">Revenue by Product Class</div>
            <div className="flex gap-4 items-end">
              {productSales.map((ps, i) => (
                <div key={ps.label} className="flex flex-col items-center">
                  <div className={`text-lg font-bold ${i === 0 ? 'text-emerald-400' : 'text-white'}`}>${ps.value.toLocaleString()}</div>
                  <div className="text-xs text-slate-400 text-center whitespace-nowrap">{ps.label}</div>
                </div>
              ))}
            </div>
          </div>
          {/* Income */}
          <div className="bg-[#232b3e] rounded-2xl p-6 shadow-lg flex flex-col justify-between">
            <div className="text-slate-300 text-sm">Income (This Month)</div>
            <div className="text-3xl font-bold text-orange-300 mt-2 mb-4">${income.toLocaleString()}</div>
            {/* Placeholder for line chart */}
            <div className="h-12 w-full bg-gradient-to-r from-orange-400/30 to-orange-400/10 rounded-lg mt-2 flex items-end">
              <div className="h-8 w-2 bg-orange-400 rounded-t-lg mx-1" />
              <div className="h-6 w-2 bg-orange-300 rounded-t-lg mx-1" />
              <div className="h-10 w-2 bg-orange-500 rounded-t-lg mx-1" />
              <div className="h-5 w-2 bg-orange-300 rounded-t-lg mx-1" />
              <div className="h-7 w-2 bg-orange-400 rounded-t-lg mx-1" />
            </div>
          </div>
          {/* Income Goal */}
          <div className="bg-[#232b3e] rounded-2xl p-6 shadow-lg flex flex-col justify-between">
            <div className="flex justify-between items-center mb-2">
              <div className="text-slate-300 text-sm">Income Goal</div>
              <div className="text-emerald-400 text-xs font-bold">{incomeGoalPercent}%</div>
            </div>
            <div className="text-lg font-bold text-white mb-2">Progress to Goal</div>
            <div className="w-full bg-slate-800 rounded-full h-2 mb-2">
              <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${incomeGoalPercent}%` }} />
            </div>
            <div className="text-xs text-slate-400">${income.toLocaleString()} / {incomeGoal.toLocaleString()}</div>
          </div>
        </div>

        {/* Third Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Income & Expenses Chart */}
          <div className="bg-[#232b3e] rounded-2xl p-6 shadow-lg col-span-2">
            <div className="text-slate-300 text-sm mb-2">Transactions by Class & Detail</div>
            <div className="flex flex-col gap-2 mb-2">
              {transactions.map(tx => (
                <div key={tx.class + tx.detail} className="flex justify-between text-sm">
                  <span className="text-slate-200 font-medium">{tx.class} <span className="text-slate-400">/</span> {tx.detail}</span>
                  <span className="text-slate-400">{tx.count} tx</span>
                  <span className="text-emerald-400 font-semibold">${tx.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
            {/* Placeholder for line chart */}
            <div className="h-32 w-full bg-gradient-to-r from-blue-400/10 to-emerald-400/10 rounded-lg mt-2 flex items-end">
              <div className="h-16 w-2 bg-blue-400 rounded-t-lg mx-1" />
              <div className="h-24 w-2 bg-emerald-400 rounded-t-lg mx-1" />
              <div className="h-20 w-2 bg-blue-300 rounded-t-lg mx-1" />
              <div className="h-28 w-2 bg-emerald-300 rounded-t-lg mx-1" />
              <div className="h-12 w-2 bg-blue-400 rounded-t-lg mx-1" />
              <div className="h-20 w-2 bg-emerald-400 rounded-t-lg mx-1" />
              <div className="h-24 w-2 bg-blue-300 rounded-t-lg mx-1" />
              <div className="h-16 w-2 bg-emerald-300 rounded-t-lg mx-1" />
            </div>
          </div>
          {/* Assets Pie Chart */}
          <div className="bg-[#232b3e] rounded-2xl p-6 shadow-lg flex flex-col items-center">
            <div className="text-slate-300 text-sm mb-2">Assets</div>
            {/* Pie chart placeholder */}
            <div className="relative w-32 h-32 mb-4">
              <svg viewBox="0 0 32 32" className="w-full h-full">
                <circle r="16" cx="16" cy="16" fill="#232b3e" />
                <circle r="16" cx="16" cy="16" fill="none" stroke="#fbbf24" strokeWidth="8" strokeDasharray="25 75" />
                <circle r="16" cx="16" cy="16" fill="none" stroke="#38bdf8" strokeWidth="8" strokeDasharray="18 82" strokeDashoffset="25" />
                <circle r="16" cx="16" cy="16" fill="none" stroke="#a78bfa" strokeWidth="8" strokeDasharray="32 68" strokeDashoffset="43" />
                <circle r="16" cx="16" cy="16" fill="none" stroke="#34d399" strokeWidth="8" strokeDasharray="25 75" strokeDashoffset="75" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-lg font-bold text-white">${assets.reduce((a, b) => a + b.value, 0).toLocaleString()}</div>
            </div>
            <div className="flex flex-col gap-1 w-full">
              {assets.map(asset => (
                <div key={asset.label} className="flex justify-between text-sm">
                  <span className="flex items-center gap-2"><span className="inline-block w-3 h-3 rounded-full" style={{ background: asset.color }} />{asset.label}</span>
                  <span>${asset.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Fourth Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Spendings by Category */}
          <div className="bg-[#232b3e] rounded-2xl p-6 shadow-lg">
            <div className="text-slate-300 text-sm mb-4">Spendings</div>
            <div className="flex flex-col gap-3">
              {spendingsByCategory.map(cat => (
                <div key={cat.label} className="flex items-center gap-3">
                  <span className="w-8 h-8 flex items-center justify-center rounded-full" style={{ background: cat.color + '22' }}>{cat.icon}</span>
                  <span className="flex-1 text-white font-medium">{cat.label}</span>
                  <span className="text-slate-400">${cat.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Notification */}
          <div className="bg-[#232b3e] rounded-2xl p-6 shadow-lg flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-2 text-orange-400 font-semibold"><AlertCircle size={18} /> Notification</div>
            <div className="bg-orange-400/10 text-orange-300 rounded-lg p-3 text-sm font-medium mb-2">2 invoices are overdue. Please review your outstanding payments.</div>
            <div className="text-xs text-slate-400">www.yourbusiness.com</div>
          </div>
          {/* Pet Expenses (hidden for business) */}
          <div className="bg-[#232b3e] rounded-2xl p-6 shadow-lg flex flex-col justify-between opacity-30 pointer-events-none select-none">
            <div className="flex items-center gap-2 mb-2 text-sky-400 font-semibold">
              <span className="inline-block w-6 h-6"><svg viewBox="0 0 24 24" fill="none" className="w-6 h-6"><ellipse cx="7.5" cy="10.5" rx="1.5" ry="2.5" fill="#fbbf24"/><ellipse cx="16.5" cy="10.5" rx="1.5" ry="2.5" fill="#fbbf24"/><ellipse cx="12" cy="17" rx="7" ry="4" fill="#fbbf24"/><circle cx="12" cy="17" r="2" fill="#fff"/></svg></span>
              Pet Expenses (N/A)
            </div>
            <div className="flex flex-col gap-2 mt-2">
              {petExpenses.map(exp => (
                <div key={exp.label} className="flex justify-between text-sm">
                  <span>{exp.label}</span>
                  <span className="text-slate-400">{exp.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}




