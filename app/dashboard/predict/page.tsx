"use client"

import React, { useEffect, useState } from "react"
import { Loader2, Search, Swords, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BoxerInputCard } from "@/components/boxer-input-card"
import { PredictionResults } from "@/components/prediction-results"
import {
  allTimeRankedBoxersApi,
  matchPredictionApi,
  weightClassesApi,
} from "@/lib/api-client"
import {
  mapGeneratedProfileToAttributes,
  mapAttributesToBoxerInput,
  mapPredictionResponseToUI,
  type PredictionUIResult,
} from "@/lib/mappers"
import { defaultAttributes, type BoxerAttributes } from "@/lib/predict-types"
import { ResponseError } from "@/generated-api/runtime"
import type {
  BoxerProfileLookupFailureResponse,
  GenerateBoxerProfileRequest,
  GeneratedBoxerProfileResponse,
  PredictMatchRequest,
  WeightClassResponse,
} from "@/generated-api/models"

export default function PredictPage() {
  const [weightClasses, setWeightClasses] = useState<WeightClassResponse[]>([])
  const [selectedWeightClassId, setSelectedWeightClassId] = useState<number | "">("")

  const [boxerAName, setBoxerAName] = useState("")
  const [boxerBName, setBoxerBName] = useState("")

  const [boxerAAttrs, setBoxerAAttrs] = useState<BoxerAttributes>({
    ...defaultAttributes,
  })
  const [boxerBAttrs, setBoxerBAttrs] = useState<BoxerAttributes>({
    ...defaultAttributes,
  })

  const [boxerAProfile, setBoxerAProfile] =
      useState<GeneratedBoxerProfileResponse | null>(null)
  const [boxerBProfile, setBoxerBProfile] =
      useState<GeneratedBoxerProfileResponse | null>(null)

  const [boxerAFailure, setBoxerAFailure] =
      useState<BoxerProfileLookupFailureResponse | null>(null)
  const [boxerBFailure, setBoxerBFailure] =
      useState<BoxerProfileLookupFailureResponse | null>(null)

  const [loadingWeightClasses, setLoadingWeightClasses] = useState(true)
  const [loadingBoxerA, setLoadingBoxerA] = useState(false)
  const [loadingBoxerB, setLoadingBoxerB] = useState(false)
  const [loadingPrediction, setLoadingPrediction] = useState(false)

  const [result, setResult] = useState<PredictionUIResult | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    async function loadWeightClasses() {
      try {
        const data = await weightClassesApi.getWeightClasses()
        setWeightClasses(data)
      } catch (err) {
        console.error(err)
        setError("Failed to load weight classes.")
      } finally {
        setLoadingWeightClasses(false)
      }
    }

    void loadWeightClasses()
  }, [])

  async function handleGenerateProfile(
      boxerName: string,
      setAttrs: React.Dispatch<React.SetStateAction<BoxerAttributes>>,
      setProfile: React.Dispatch<
          React.SetStateAction<GeneratedBoxerProfileResponse | null>
      >,
      setFailure: React.Dispatch<
          React.SetStateAction<BoxerProfileLookupFailureResponse | null>
      >,
      setLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) {
    if (!boxerName.trim()) {
      setError("Please enter a boxer name first.")
      return
    }

    if (selectedWeightClassId === "") {
      setError("Please select a weight class first.")
      return
    }

    setError("")
    setLoading(true)
    setProfile(null)
    setFailure(null)

    try {
      const payload: GenerateBoxerProfileRequest = {
        boxerName: boxerName.trim(),
        weightClassId: selectedWeightClassId,
      }

      const response = await allTimeRankedBoxersApi.generateProfile({
        generateBoxerProfileRequest: payload,
      })

      setProfile(response)

      if (!response.boxerFound) {
        return
      }

      setAttrs(mapGeneratedProfileToAttributes(response))
    } catch (err) {
      console.error(err)

      if (err instanceof ResponseError) {
        try {
          const failure =
              (await err.response.json()) as BoxerProfileLookupFailureResponse

          setFailure(failure)
        } catch {
          console.error("Failed to parse failure response")
        }
      } else {
        console.error(`Failed to generate profile for ${boxerName}.`)
      }
    } finally {
      setLoading(false)
    }
  }

  async function handlePredict() {
    if (!boxerAName.trim() || !boxerBName.trim()) {
      setError("Please enter names for both fighters.")
      return
    }

    if (selectedWeightClassId === "") {
      setError("Please select a weight class.")
      return
    }

    setError("")
    setLoadingPrediction(true)
    setResult(null)

    try {
      const payload: PredictMatchRequest = {
        weightClassId: selectedWeightClassId,
        boxerA: mapAttributesToBoxerInput(boxerAName.trim(), boxerAAttrs),
        boxerB: mapAttributesToBoxerInput(boxerBName.trim(), boxerBAttrs),
      }

      const response = await matchPredictionApi.predict({
        predictMatchRequest: payload,
      })

      setResult(mapPredictionResponseToUI(response))
    } catch (err) {
      console.error(err)
      setError("Failed to calculate prediction.")
    } finally {
      setLoadingPrediction(false)
    }
  }

  return (
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Match Prediction
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Select one weight class, generate both boxer profiles, then calculate
            the prediction.
          </p>
        </div>

        <div className="rounded-xl border p-4 space-y-3">
          <label className="text-sm font-medium">Weight Class</label>
          <select
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              value={selectedWeightClassId}
              onChange={(e) =>
                  setSelectedWeightClassId(e.target.value ? Number(e.target.value) : "")
              }
              disabled={loadingWeightClasses}
          >
            <option value="">
              {loadingWeightClasses ? "Loading weight classes..." : "Select weight class"}
            </option>
            {weightClasses.map((wc) => (
                <option key={wc.weightClassId} value={wc.weightClassId}>
                  {wc.className}
                </option>
            ))}
          </select>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-3">
            <Button
                type="button"
                variant="outline"
                onClick={() =>
                    handleGenerateProfile(
                        boxerAName,
                        setBoxerAAttrs,
                        setBoxerAProfile,
                        setBoxerAFailure,
                        setLoadingBoxerA
                    )
                }
                disabled={loadingBoxerA || selectedWeightClassId === ""}
            >
              {loadingBoxerA ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Generating Fighter A...
                  </>
              ) : (
                  <>
                    <Search className="mr-2 size-4" />
                    Generate Fighter A Profile
                  </>
              )}
            </Button>

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

            {boxerAProfile && !boxerAFailure && (
                <div className="relative rounded-lg border p-3 pr-10 text-sm">
                  <button
                      type="button"
                      onClick={() => setBoxerAProfile(null)}
                      aria-label="Close fighter A profile result"
                      className="absolute right-2 top-2 rounded p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
                  >
                    <X className="size-4" />
                  </button>

                  <p><strong>Found:</strong> {boxerAProfile.boxerFound ? "Yes" : "No"}</p>
                  <p>
                    <strong>Confidence:</strong>{" "}
                    {boxerAProfile.confidence != null
                        ? `${(boxerAProfile.confidence * 100).toFixed(0)}%`
                        : "N/A"}
                  </p>
                  <p><strong>Reason:</strong> {boxerAProfile.matchReason || "N/A"}</p>
                </div>
            )}

            {boxerAFailure && (
                <div className="relative rounded-lg border p-3 pr-10 text-sm">
                  <button
                      type="button"
                      onClick={() => setBoxerAFailure(null)}
                      aria-label="Close fighter A failure result"
                      className="absolute right-2 top-2 rounded p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
                  >
                    <X className="size-4" />
                  </button>

                  <p><strong>Found:</strong> {boxerAFailure.boxerFound ? "Yes" : "No"}</p>
                  <p>
                    <strong>Confidence:</strong>{" "}
                    {boxerAFailure.confidence != null
                        ? `${(boxerAFailure.confidence * 100).toFixed(0)}%`
                        : "N/A"}
                  </p>
                  <p><strong>Message:</strong> {boxerAFailure.message || "N/A"}</p>
                </div>
            )}
          </div>

          <div className="space-y-3">
            <Button
                type="button"
                variant="outline"
                onClick={() =>
                    handleGenerateProfile(
                        boxerBName,
                        setBoxerBAttrs,
                        setBoxerBProfile,
                        setBoxerBFailure,
                        setLoadingBoxerB
                    )
                }
                disabled={loadingBoxerB || selectedWeightClassId === ""}
            >
              {loadingBoxerB ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Generating Fighter B...
                  </>
              ) : (
                  <>
                    <Search className="mr-2 size-4" />
                    Generate Fighter B Profile
                  </>
              )}
            </Button>

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

            {boxerBProfile && !boxerBFailure && (
                <div className="relative rounded-lg border p-3 pr-10 text-sm">
                  <button
                      type="button"
                      onClick={() => setBoxerBProfile(null)}
                      aria-label="Close fighter B profile result"
                      className="absolute right-2 top-2 rounded p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
                  >
                    <X className="size-4" />
                  </button>

                  <p><strong>Found:</strong> {boxerBProfile.boxerFound ? "Yes" : "No"}</p>
                  <p>
                    <strong>Confidence:</strong>{" "}
                    {boxerBProfile.confidence != null
                        ? `${(boxerBProfile.confidence * 100).toFixed(0)}%`
                        : "N/A"}
                  </p>
                  <p><strong>Reason:</strong> {boxerBProfile.matchReason || "N/A"}</p>
                </div>
            )}

            {boxerBFailure && (
                <div className="relative rounded-lg border p-3 pr-10 text-sm">
                  <button
                      type="button"
                      onClick={() => setBoxerBFailure(null)}
                      aria-label="Close fighter B failure result"
                      className="absolute right-2 top-2 rounded p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
                  >
                    <X className="size-4" />
                  </button>

                  <p><strong>Found:</strong> {boxerBFailure.boxerFound ? "Yes" : "No"}</p>
                  <p>
                    <strong>Confidence:</strong>{" "}
                    {boxerBFailure.confidence != null
                        ? `${(boxerBFailure.confidence * 100).toFixed(0)}%`
                        : "N/A"}
                  </p>
                  <p><strong>Message:</strong> {boxerBFailure.message || "N/A"}</p>
                </div>
            )}
          </div>
        </div>

        {error && (
            <div className="relative rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 pr-10">
              <button
                  type="button"
                  onClick={() => setError("")}
                  aria-label="Close error message"
                  className="absolute right-2 top-2 rounded p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                <X className="size-4" />
              </button>

              <p className="text-sm text-destructive-foreground">{error}</p>
            </div>
        )}

        <div className="flex justify-center">
          <Button
              size="lg"
              onClick={handlePredict}
              disabled={loadingPrediction}
              className="bg-primary px-10 text-primary-foreground hover:bg-primary/90"
          >
            {loadingPrediction ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Calculating Prediction...
                </>
            ) : (
                <>
                  <Swords className="mr-2 size-4" />
                  Calculate Prediction
                </>
            )}
          </Button>
        </div>

        {result && <PredictionResults result={result} />}
      </div>
  )
}