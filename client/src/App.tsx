import { Routes, Route } from 'react-router-dom'
import LandingAuth from './pages/LandingAuth'
import Register from './pages/Register'
import RegisterVendorStep1 from './pages/RegisterVendorStep1'
import RegisterVendorStep2 from './pages/RegisterVendorStep2'
import DashboardVendor from './pages/DashboardVendor'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingAuth />} />
      <Route path="/register" element={<Register />} />
      <Route path="/register/vendor/step1" element={<RegisterVendorStep1 />} />
      <Route path="/register/vendor/step2" element={<RegisterVendorStep2 />} />
      <Route path="/dashboard/vendor" element={<DashboardVendor />} />
    </Routes>
  )
}