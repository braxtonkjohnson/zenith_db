// src/components/Sidebar.tsx
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Home, Package, ReceiptText, LineChart } from "lucide-react"
import axios from "axios"

export default function Sidebar() {
  const [userName, setUserName] = useState("Vendor User")
  const [userAvatarUrl, setUserAvatarUrl] = useState<string | null>(null)
  const navigate = useNavigate()
  const vendorID = localStorage.getItem("vendorID")
  const userId = localStorage.getItem("userId")
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    const storedName = localStorage.getItem("userName")
    const storedAvatarUrl = localStorage.getItem("userAvatarUrl")
    if (storedName) setUserName(storedName)
    if (storedAvatarUrl) setUserAvatarUrl(storedAvatarUrl)
  }, [])

  // Construct the full URL if it's a relative path
  const fullAvatarUrl = userAvatarUrl
    ? userAvatarUrl.startsWith('/')
      ? `${window.location.origin}${userAvatarUrl}`
      : userAvatarUrl
    : "/public/default-avatar.png"

  // Handle avatar/name click
  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "" // Reset file input
      fileInputRef.current.click()
    }
  }

  // Handle file selection and upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !userId) return
    const file = e.target.files[0]
    const formData = new FormData()
    formData.append("avatar", file)
    try {
      const res = await axios.post(`/api/vendor_users/${userId}/avatar`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })
      const { profilePictureUrl } = res.data
      if (profilePictureUrl) {
        localStorage.setItem("userAvatarUrl", profilePictureUrl)
        setUserAvatarUrl(profilePictureUrl)
      }
    } catch (err) {
      alert("Failed to upload profile picture.")
      console.error(err)
    }
  }

  return (
    <aside className="w-20 md:w-64 bg-slate-800 p-4 flex flex-col justify-between min-h-screen text-white">
      <div>
        <img className="hidden md:block mb-10 px-4 w-auto h-20 ml-10" src="/public/zenith.png" alt="Zenith Logo" />
        <nav className="flex flex-col items-center md:items-start gap-6 text-sm">
          <SidebarItem icon={<Home size={20} />} label="Home" onClick={() => navigate(`/dashboard/vendor/${vendorID}`)} />
          <SidebarItem icon={<Package size={20} />} label="Products & Services" onClick={() => navigate(`/dashboard/vendor/${vendorID}/products-services`)} />
          <SidebarItem icon={<ReceiptText size={20} />} label="Transactions" />
          <SidebarItem icon={<LineChart size={20} />} label="Financial Models" />
        </nav>
      </div>
      <div className="flex items-center justify-center md:justify-start gap-3 px-4 pb-4">
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <img
          src={fullAvatarUrl}
          alt="User Avatar"
          className="w-10 h-10 rounded-full bg-slate-700 object-cover border-2 border-blue-500 cursor-pointer hover:opacity-80 transition"
          onClick={handleAvatarClick}
          onError={(e) => { e.currentTarget.src = '/public/default-avatar.png' }}
          title="Click to change profile picture"
        />
        <div
          className="hidden md:block cursor-pointer hover:text-blue-400 transition"
          onClick={handleAvatarClick}
          title="Click to change profile picture"
        >
          {userName}
        </div>
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



