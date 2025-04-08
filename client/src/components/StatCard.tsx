// src/components/StatCard.tsx
import { Card } from "@/components/ui/card"

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
}

export default function StatCard({ title, value, subtitle }: StatCardProps) {
  return (
    <Card className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-xl p-6 shadow-md text-white">
      <div className="text-sm opacity-70">{title}</div>
      <div className="text-3xl font-semibold mt-1">{value}</div>
      {subtitle && <div className="text-xs opacity-50 mt-1">{subtitle}</div>}
    </Card>
  )
}

