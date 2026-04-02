"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  Activity, ChevronRight, Database,
  Swords, Target, TrendingUp, Users,
} from "lucide-react"
import {
  Bar, BarChart, Cell, Pie, PieChart,
  ResponsiveContainer, XAxis, YAxis, Tooltip as RechartsTooltip,
} from "recharts"
import { StatsCard } from "@/components/stats-card"
import { Button } from "@/components/ui/button"
import { useAuthGuard } from "@/hooks/useAuthGuard"
import { getAllPredictions, getWeightClasses, apiFetch } from "@/lib/auth"
import { weightDistributionData } from "@/lib/mock-data"

type Prediction = {
  predictionId: number
  boxerAName: string
  boxerBName: string
  matchDecision: string
  probabilityA: number
  probabilityB: number
  predictionDate: string
}

type WeightClass = {
  weightClassId: number
  className: string
}

export default function DashboardPage() {
  const ready = useAuthGuard()
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [weightClasses, setWeightClasses] = useState<WeightClass[]>([])
  const [boxerCount, setBoxerCount] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!ready) return
    async function fetchData() {
      try {
        const [predsRes, wcRes] = await Promise.all([
          getAllPredictions(),
          getWeightClasses(),
        ])

        if (predsRes.ok) {
          const data: Prediction[] = await predsRes.json()
          setPredictions(
            data.sort((a, b) =>
              new Date(b.predictionDate).getTime() - new Date(a.predictionDate).getTime()
            )
          )
        }

        if (wcRes.ok) {
          const wcs: WeightClass[] = await wcRes.json()
          setWeightClasses(wcs)

          // Fetch welterweight (ID 11) active boxers for count
          const boxersRes = await apiFetch("/api/v1/all-time-ranked-boxers/weight-class/11/active")
          if (boxersRes.ok) {
            const boxers = await boxersRes.json()
            setBoxerCount(boxers.length)
          }
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [ready])

  if (!ready) return null

  const recent = predictions.slice(0, 4)
  const avgProbA = predictions.length
    ? predictions.reduce((s, p) => s + p.probabilityA, 0) / predictions.length
    : 0

  const confidenceData = [
    {
      name: "A Favoured",
      value: predictions.filter((p) => p.probabilityA >= 0.5).length,
      color: "oklch(0.58 0.22 25)",
    },
    {
      name: "B Favoured",
      value: predictions.filter((p) => p.probabilityB > 0.5).length,
      color: "oklch(0.78 0.15 80)",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Dashboard Overview</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Monitor predictions, analytics, and fighter performance at a glance.
          </p>
        </div>
        <Link href="/dashboard/predict">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Swords className="mr-2 size-4" /> New Prediction
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Active Fighters" value={loading ? "—" : boxerCount ?? "—"} subtitle="Welterweight division" icon={Users} />
        <StatsCard title="Predictions Made" value={loading ? "—" : predictions.length} subtitle="Stored in history" icon={Target} />
        <StatsCard title="Avg Win Prob A" value={loading ? "—" : `${(avgProbA * 100).toFixed(1)}%`} subtitle="Across all predictions" icon={Activity} />
        <StatsCard title="A Favoured" value={loading ? "—" : predictions.filter((p) => p.probabilityA >= 0.5).length} subtitle={`of ${predictions.length} predictions`} icon={TrendingUp} />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-foreground">Attribute Weight Distribution</h3>
            <p className="text-xs text-muted-foreground">Impact of each attribute on predictions</p>
          </div>
          <div className="h-[420px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weightDistributionData} layout="vertical">
                <XAxis type="number" tick={{ fill: "oklch(0.65 0 0)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis dataKey="attribute" type="category" width={100} tick={{ fill: "oklch(0.65 0 0)", fontSize: 9 }} axisLine={false} tickLine={false} />
                <RechartsTooltip
                  contentStyle={{ backgroundColor: "oklch(0.17 0.005 250)", border: "1px solid oklch(0.28 0.005 250)", borderRadius: "8px", color: "oklch(0.95 0 0)", fontSize: "12px" }}
                  formatter={(v: number) => [`${v}%`, "Weight"]}
                />
                <Bar dataKey="weight" radius={[0, 4, 4, 0]}>
                  {weightDistributionData.map((_, i) => (
                    <Cell key={i} fill={i < 3 ? "oklch(0.58 0.22 25)" : i < 6 ? "oklch(0.78 0.15 80)" : "oklch(0.45 0 0)"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-foreground">Prediction Confidence</h3>
            <p className="text-xs text-muted-foreground">Who is favoured across stored predictions</p>
          </div>
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <p className="text-sm text-muted-foreground">Loading...</p>
            </div>
          ) : predictions.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center gap-2">
              <p className="text-sm text-muted-foreground">No predictions yet.</p>
              <Link href="/dashboard/predict">
                <Button size="sm" variant="outline">Make your first prediction</Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="flex h-64 items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={confidenceData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value" stroke="none">
                      {confidenceData.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                    <RechartsTooltip
                      contentStyle={{ backgroundColor: "oklch(0.17 0.005 250)", border: "1px solid oklch(0.28 0.005 250)", borderRadius: "8px", color: "oklch(0.95 0 0)", fontSize: "12px" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 flex justify-center gap-4">
                {confidenceData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="size-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-xs text-muted-foreground">{item.name} ({item.value})</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Recent Predictions */}
      <div className="rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border p-5">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Recent Predictions</h3>
            <p className="text-xs text-muted-foreground">Latest match outcome predictions</p>
          </div>
          <Link href="/dashboard/history">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              View All <ChevronRight className="ml-1 size-3" />
            </Button>
          </Link>
        </div>
        {loading ? (
          <div className="flex justify-center py-10">
            <p className="text-sm text-muted-foreground">Loading...</p>
          </div>
        ) : recent.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-10">
            <p className="text-sm text-muted-foreground">No predictions yet.</p>
            <Link href="/dashboard/predict">
              <Button size="sm" variant="outline">Make your first prediction</Button>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {recent.map((pred) => (
              <div key={pred.predictionId} className="flex items-center justify-between px-5 py-3.5">
                <div className="flex items-center gap-4">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
                    <Swords className="size-3.5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {pred.boxerAName} <span className="text-muted-foreground">vs</span> {pred.boxerBName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(pred.predictionDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-accent">{pred.matchDecision}</p>
                  <p className="text-xs text-muted-foreground">
                    {(pred.probabilityA * 100).toFixed(0)}% / {(pred.probabilityB * 100).toFixed(0)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { href: "/dashboard/predict", icon: Swords, color: "text-primary", bg: "bg-primary/10", title: "Predict Match", desc: "Enter fighter names and generate AI predictions" },
          { href: "/dashboard/boxers", icon: Database, color: "text-accent", bg: "bg-accent/10", title: "Boxer Database", desc: `Browse ranked fighters` },
          { href: "/dashboard/history", icon: Activity, color: "text-primary", bg: "bg-primary/10", title: "Prediction History", desc: `Review all ${predictions.length} stored predictions` },
        ].map((item) => (
          <Link key={item.href} href={item.href} className="group flex items-center gap-4 rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/30">
            <div className={`rounded-lg ${item.bg} p-2.5`}>
              <item.icon className={`size-5 ${item.color}`} />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground">{item.title}</h4>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
            <ChevronRight className="ml-auto size-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
          </Link>
        ))}
      </div>
    </div>
  )
}
