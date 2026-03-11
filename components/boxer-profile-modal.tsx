"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { RadarAttributeChart } from "@/components/radar-attribute-chart"
import {
  type Boxer,
  type BoxerAttributes,
  attributeLabels,
  attributeCategories,
  calculateScore,
} from "@/lib/mock-data"

interface BoxerProfileModalProps {
  boxer: Boxer | null
  open: boolean
  onClose: () => void
}

export function BoxerProfileModal({
  boxer,
  open,
  onClose,
}: BoxerProfileModalProps) {
  if (!boxer) return null

  const score = calculateScore(boxer.attributes)

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto border-border bg-card text-foreground">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 font-display text-sm font-bold text-primary">
              {boxer.name.charAt(0)}
            </div>
            <div>
              <span className="font-display text-lg text-foreground">
                {boxer.name}
              </span>
              <p className="text-xs font-normal text-muted-foreground">
                {boxer.nickname} &middot; {boxer.weight} &middot;{" "}
                {boxer.nationality}
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-2">
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg bg-secondary p-3 text-center">
              <p className="text-[10px] uppercase text-muted-foreground">
                Record
              </p>
              <p className="mt-1 font-display text-sm font-bold text-foreground">
                {boxer.record}
              </p>
            </div>
            <div className="rounded-lg bg-primary/5 p-3 text-center">
              <p className="text-[10px] uppercase text-muted-foreground">
                Overall Score
              </p>
              <p className="mt-1 font-display text-xl font-bold text-primary">
                {score}
              </p>
            </div>
            <div className="rounded-lg bg-secondary p-3 text-center">
              <p className="text-[10px] uppercase text-muted-foreground">
                Weight Class
              </p>
              <p className="mt-1 font-display text-sm font-bold text-foreground">
                {boxer.weight}
              </p>
            </div>
          </div>

          {/* Radar Chart */}
          <div>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Attribute Profile vs Perfect Boxer
            </h4>
            <div className="h-72">
              <RadarAttributeChart
                attributes={boxer.attributes}
                showPerfect
              />
            </div>
          </div>

          {/* Attribute Breakdown by Category */}
          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Attribute Breakdown
            </h4>
            <div className="space-y-4">
              {attributeCategories.map((category) => (
                <div key={category.key}>
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {category.label}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {category.attributes.map((key) => (
                      <div
                        key={key}
                        className="flex items-center justify-between rounded-md bg-secondary px-3 py-2"
                      >
                        <span className="text-xs text-muted-foreground">
                          {attributeLabels[key]}
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-background">
                            <div
                              className="h-full rounded-full bg-primary"
                              style={{
                                width: `${boxer.attributes[key] * 10}%`,
                              }}
                            />
                          </div>
                          <span className="w-5 text-right font-display text-xs font-bold text-foreground">
                            {boxer.attributes[key]}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Historical Performance Placeholder */}
          <div className="rounded-lg border border-dashed border-border p-6 text-center">
            <p className="text-xs text-muted-foreground">
              Historical performance data will be available when connected to
              the backend API.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
