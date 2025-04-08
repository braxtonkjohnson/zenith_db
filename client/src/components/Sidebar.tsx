import { Home, Package, ReceiptText, LineChart, User } from "lucide-react"

export default function Sidebar() {
  return (
    <aside className="w-20 md:w-64 bg-slate-800 p-4 flex flex-col justify-between min-h-screen text-white">
      <div>
        <div className="hidden md:block text-2xl font-bold mb-10 px-4">Zenith</div>
        <nav className="flex flex-col items-center md:items-start gap-6 text-sm">
          <SidebarItem icon={<Home size={20} />} label="Home" />
          <SidebarItem icon={<Package size={20} />} label="Products & Services" />
          <SidebarItem icon={<ReceiptText size={20} />} label="Transactions" />
          <SidebarItem icon={<LineChart size={20} />} label="Financial Models" />
        </nav>
      </div>
      <div className="flex items-center justify-center md:justify-start gap-3 px-4 pb-4">
        <div className="w-10 h-10 rounded-full bg-white/20" />
        <div className="hidden md:block">Vendor User</div>
      </div>
    </aside>
  )
}

function SidebarItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-3 hover:text-blue-400 cursor-pointer px-2 md:px-4 py-2 w-full">
      {icon}
      <span className="hidden md:inline">{label}</span>
    </div>
  )
}

