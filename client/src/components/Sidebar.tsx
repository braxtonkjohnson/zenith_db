// src/components/Sidebar.tsx
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Home, Package, ReceiptText, LineChart, User } from "lucide-react"

export default function Sidebar() {
  const [userName, setUserName] = useState("Vendor User")
  const navigate = useNavigate()
  const vendorID = localStorage.getItem("vendorID")

  useEffect(() => {
    const storedName = localStorage.getItem("userName")
    if (storedName) setUserName(storedName)
  }, [])

  return (
    <aside className="w-20 md:w-64 bg-slate-800 p-4 flex flex-col justify-between min-h-screen text-white">
      <div>
        <img className= "hidden md:block mb-10 px-4 w-auto h-20 ml-10" src = "/public/zenith.png" alt = "Zenith Logo"></img>
        <nav className="flex flex-col items-center md:items-start gap-6 text-sm">
          <SidebarItem icon={<Home size={20} />} label="Home" onClick={() => navigate(`/dashboard/vendor/${vendorID}`)} />
          <SidebarItem icon={<Package size={20} />} label="Products & Services" onClick={() => navigate(`/dashboard/vendor/${vendorID}/products-services`)} />
          <SidebarItem icon={<ReceiptText size={20} />} label="Transactions" />
          <SidebarItem icon={<LineChart size={20} />} label="Financial Models" />
        </nav>
      </div>
      <div className="flex items-center justify-center md:justify-start gap-3 px-4 pb-4">
        <div className="w-10 h-10 rounded-full bg-white/20" />
        <div className="hidden md:block">{userName}</div>
      </div>
    </aside>
  )
}

function SidebarItem({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick?: () => void }) {
  return (
    <div
      className="flex items-center gap-3 hover:text-blue-400 cursor-pointer px-2 md:px-4 py-2 w-full"
      onClick={onClick}
    >
      {icon}
      <span className="hidden md:inline">{label}</span>
    </div>
  )
}



