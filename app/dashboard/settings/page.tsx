"use client"

import { Database, Globe, Lock, Server } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">
          Settings
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Configure connections and preferences for the prediction system.
        </p>
      </div>

      {/* API Configuration */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <Server className="size-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              ML API Endpoint
            </h3>
            <p className="text-xs text-muted-foreground">
              Connect to a Python ML model backend
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Input
            placeholder="https://api.example.com/predict"
            className="border-border bg-secondary text-foreground placeholder:text-muted-foreground"
            disabled
          />
          <Button
            variant="outline"
            className="border-border text-foreground"
            disabled
          >
            Connect
          </Button>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Currently using local prediction model. Connect a remote endpoint
          for enhanced predictions.
        </p>
      </div>

      {/* Database Configuration */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-lg bg-accent/10 p-2">
            <Database className="size-4 text-accent" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Database Connection
            </h3>
            <p className="text-xs text-muted-foreground">
              Supabase integration for fighter data storage
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Input
            placeholder="Supabase Project URL"
            className="border-border bg-secondary text-foreground placeholder:text-muted-foreground"
            disabled
          />
          <Button
            variant="outline"
            className="border-border text-foreground"
            disabled
          >
            Configure
          </Button>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Database integration coming soon. Currently using in-memory mock
          data.
        </p>
      </div>

      {/* Preferences */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <Globe className="size-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Application Preferences
            </h3>
            <p className="text-xs text-muted-foreground">
              General application settings
            </p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-md bg-secondary px-4 py-3">
            <div>
              <p className="text-sm font-medium text-foreground">
                Model Version
              </p>
              <p className="text-xs text-muted-foreground">
                Current prediction model version
              </p>
            </div>
            <span className="rounded-md bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
              v1.0.0
            </span>
          </div>
          <div className="flex items-center justify-between rounded-md bg-secondary px-4 py-3">
            <div>
              <p className="text-sm font-medium text-foreground">
                Data Source
              </p>
              <p className="text-xs text-muted-foreground">
                Where fighter data comes from
              </p>
            </div>
            <span className="rounded-md bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">
              Mock Data
            </span>
          </div>
          <div className="flex items-center justify-between rounded-md bg-secondary px-4 py-3">
            <div>
              <p className="text-sm font-medium text-foreground">
                Sigmoid Sensitivity (k)
              </p>
              <p className="text-xs text-muted-foreground">
                Controls prediction steepness
              </p>
            </div>
            <span className="font-display text-sm font-bold text-foreground">
              0.8
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
