"use client"

import { useState } from "react"
import { Loader2, Swords } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BoxerInputCard } from "@/components/boxer-input-card"
import { PredictionResults } from "@/components/prediction-results"
import {
  type BoxerAttributes,
  type PredictionResult,
  generatePrediction,
} from "@/lib/mock-data"

const defaultAttributes: BoxerAttributes = {
  height: 5, reach: 5, bodyFat: 5, shoulderToWaistRatio: 5,
  handSpeed: 5, punchOutput: 5, vo2Max: 5, lactateThreshold: 5, knockoutForce: 5, reactTime: 5,
  punchAccuracy: 5, defensiveSlipRate: 5, opponentConnectPct: 5, footworkEfficiency: 5,
  adaptationSpeed: 5, counterSuccessRate: 5, ringIQ: 5,
  mentalResilience: 5, composure: 5, emotionalRegulation: 5,
}

export default function PredictPage() {
  const [boxerAName, setBoxerAName] = useState("")
  const [boxerBName, setBoxerBName] = useState("")
  const [boxerAAttrs, setBoxerAAttrs] = useState<BoxerAttributes>({
    ...defaultAttributes,
  })
  const [boxerBAttrs, setBoxerBAttrs] = useState<BoxerAttributes>({
    ...defaultAttributes,
  })
  const [result, setResult] = useState<PredictionResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handlePredict = async () => {
    if (!boxerAName.trim() || !boxerBName.trim()) {
      setError("Please enter names for both fighters.")
      return
    }
    setError("")
    setLoading(true)
    setResult(null)

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const prediction = generatePrediction(
      boxerAName,
      boxerAAttrs,
      boxerBName,
      boxerBAttrs
    )
    setResult(prediction)
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">
          Match Prediction
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Input fighter attributes and generate an AI-powered outcome
          prediction.
        </p>
      </div>

      {/* Boxer Input Panels */}
      <div className="grid gap-6 lg:grid-cols-2">
        <BoxerInputCard
          label="Fighter A (Red Corner)"
          color="red"
          name={boxerAName}
          onNameChange={setBoxerAName}
          attributes={boxerAAttrs}
          onAttributeChange={(key, value) =>
            setBoxerAAttrs((prev) => ({ ...prev, [key]: value }))
          }
        />
        <BoxerInputCard
          label="Fighter B (Blue Corner)"
          color="blue"
          name={boxerBName}
          onNameChange={setBoxerBName}
          attributes={boxerBAttrs}
          onAttributeChange={(key, value) =>
            setBoxerBAttrs((prev) => ({ ...prev, [key]: value }))
          }
        />
      </div>

      {/* Error message */}
      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3">
          <p className="text-sm text-destructive-foreground">{error}</p>
        </div>
      )}

      {/* Generate Button */}
      <div className="flex justify-center">
        <Button
          size="lg"
          onClick={handlePredict}
          disabled={loading}
          className="bg-primary px-10 text-primary-foreground hover:bg-primary/90"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Analyzing Fighters...
            </>
          ) : (
            <>
              <Swords className="mr-2 size-4" />
              Generate Prediction
            </>
          )}
        </Button>
      </div>

      {/* Results */}
      {result && <PredictionResults result={result} />}
    </div>
  )
}
