import { Card } from "@/components/ui/card"
import { Link } from "react-router-dom"

export default function Register() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-gray-800 flex items-center justify-center px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-3xl w-full">
        <Link to="/register/user">
          <Card className="p-8 rounded-xl shadow-lg bg-white/10 backdrop-blur-md border border-white/20 text-white hover:border-white/40 transition duration-200">
            <div className="flex flex-col items-center space-y-4">
              <div className="bg-white/10 rounded-full p-4 border border-white/20">
                {/* User Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold">Register as a User</h2>
            </div>
          </Card>
        </Link>

        <Link to="/register/vendor/step1">
          <Card className="p-8 rounded-xl shadow-lg bg-white/10 backdrop-blur-md border border-white/20 text-white hover:border-white/40 transition duration-200">
            <div className="flex flex-col items-center space-y-4">
              <div className="bg-white/10 rounded-full p-4 border border-white/20">
                {/* Vendor Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 10l1.553 7.766A2 2 0 006.5 20h11a2 2 0 001.947-2.234L21 10M3 10h18M3 10l1.447-4.553A2 2 0 016.342 4h11.316a2 2 0 011.895 1.447L21 10" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold">Register as a Vendor</h2>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  )
}
