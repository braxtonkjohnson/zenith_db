// src/components/CircleStatCard.tsx
import { Card } from "@/components/ui/card"

interface CircleStatCardProps {
  title: string
  value: string | number
  percent: number
  color?: string
}

export default function CircleStatCard({ title, value, percent, color = "pink" }: CircleStatCardProps) {
  const ringColor = `text-${color}`

  return (
    <Card className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-xl p-6 shadow-md text-white flex flex-col items-center justify-between">
      <div className="text-sm opacity-70">{title}</div>
      <div className="text-xl font-medium mt-1">{value}</div>
      <div className="relative w-16 h-16 mt-4">
        <svg className="absolute top-0 left-0 w-full h-full">
          <circle
            cx="32" cy="32" r="28"
            fill="none"
            stroke="#334155"
            strokeWidth="6"
          />
          <circle
            cx="32" cy="32" r="28"
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            strokeDasharray={176}
            strokeDashoffset={176 - (176 * percent) / 100}
            className={`${ringColor} transition-all duration-500`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-xs font-bold">{percent}%</div>
      </div>
    </Card>
  )
}

