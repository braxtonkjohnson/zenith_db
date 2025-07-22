// src/components/StatCard.tsx
import { Card } from "@/components/ui/card"

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
}

export default function StatCard({ title, value, subtitle }: StatCardProps) {
  return (
    <Card className="bg-white/5 border border-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-lg text-white hover:shadow-xl hover:ring-1 hover:ring-white/20 transition duration-300">
      <div className="text-xs uppercase tracking-wide font-medium text-slate-400 mb-1">{title}</div>
      <div className="text-4xl font-bold text-white">{value}</div>
      {subtitle && <div className="text-sm text-slate-400 mt-1">{subtitle}</div>}
    </Card>
  )
}

