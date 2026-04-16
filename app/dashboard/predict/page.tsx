"use client"

import React, { useEffect, useRef, useState } from "react"
import { Loader2, Swords, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BoxerInputCard } from "@/components/boxer-input-card"
import { PredictionResults } from "@/components/prediction-results"
import {
  mapGeneratedBoxerToAttributes,
  mapPredictionResponseToUI,
  type PredictionUIResult,
} from "@/lib/predict-mappers"
import { defaultAttributes, type BoxerAttributes } from "@/lib/predict-types"
import { ResponseError } from "@/generated-api/runtime"
import type {
  BoxerProfileLookupFailureResponse,
  GenerateBoxerRequest,
  GeneratedBoxerResponse,
  PredictMatchRequest,
  WeightClassResponse,
} from "@/generated-api/models"
import { fetchWeightClasses, generateBoxer, predictMatch } from "@/lib/api"

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

  const [boxerAConfidence, setBoxerAConfidence] = useState(1.0)
  const [boxerBConfidence, setBoxerBConfidence] = useState(1.0)

  const [boxerAProfile, setBoxerAProfile] =
      useState<GeneratedBoxerResponse | null>(null)
  const [boxerBProfile, setBoxerBProfile] =
      useState<GeneratedBoxerResponse | null>(null)

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

  const resultRef = useRef<HTMLDivElement | null>(null)
  const boxerAAbortRef = useRef<AbortController | null>(null)
  const boxerBAbortRef = useRef<AbortController | null>(null)

  async function loadWeightClasses() {
    try {
      setLoadingWeightClasses(true)
      const data = await fetchWeightClasses()
      setWeightClasses(data)
    } catch (err) {
      console.error(err)
      setError("Failed to load weight classes.")
    } finally {
      setLoadingWeightClasses(false)
    }
  }

  useEffect(() => {
    void loadWeightClasses()
  }, [])

  function resetBoxerAttributes(
      setAttrs: React.Dispatch<React.SetStateAction<BoxerAttributes>>,
      setProfile: React.Dispatch<React.SetStateAction<GeneratedBoxerResponse | null>>,
      setFailure: React.Dispatch<
          React.SetStateAction<BoxerProfileLookupFailureResponse | null>
      >,
      setConfidence: React.Dispatch<React.SetStateAction<number>>
  ) {
    setAttrs({ ...defaultAttributes })
    setProfile(null)
    setFailure(null)
    setConfidence(1.0)
  }

  function handleManualAttributeChange(
      key: keyof BoxerAttributes,
      value: number,
      setAttrs: React.Dispatch<React.SetStateAction<BoxerAttributes>>,
      setProfile: React.Dispatch<React.SetStateAction<GeneratedBoxerResponse | null>>,
      setFailure: React.Dispatch<
          React.SetStateAction<BoxerProfileLookupFailureResponse | null>
      >,
      setConfidence: React.Dispatch<React.SetStateAction<number>>
  ) {
    setAttrs((prev) => ({ ...prev, [key]: value }))
    setProfile(null)
    setFailure(null)
    setConfidence(1.0)
  }

  async function handleGenerateProfile(
      boxerName: string,
      setAttrs: React.Dispatch<React.SetStateAction<BoxerAttributes>>,
      setProfile: React.Dispatch<React.SetStateAction<GeneratedBoxerResponse | null>>,
      setFailure: React.Dispatch<
          React.SetStateAction<BoxerProfileLookupFailureResponse | null>
      >,
      setLoading: React.Dispatch<React.SetStateAction<boolean>>,
      setConfidence: React.Dispatch<React.SetStateAction<number>>,
      abortRef: React.MutableRefObject<AbortController | null>
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

    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    try {
      const payload: GenerateBoxerRequest = {
        boxerName: boxerName.trim(),
        weightClassId: selectedWeightClassId,
      }

      const response = await generateBoxer(payload, {
        signal: controller.signal,
      })

      if (controller.signal.aborted) return

      setProfile(response)

      if (!response.boxerFound) {
        return
      }

      setAttrs(mapGeneratedBoxerToAttributes(response))
      setConfidence(response.confidence ?? 1.0)
    } catch (err) {
      if ((err as Error)?.name === "AbortError") {
        return
      }

      console.error(err)

      if (err instanceof ResponseError) {
        try {
          const failure =
              (await err.response.json()) as BoxerProfileLookupFailureResponse

          if (!controller.signal.aborted) {
            setFailure(failure)
          }
        } catch {
          console.error("Failed to parse failure response")
        }
      } else {
        console.error(`Failed to generate profile for ${boxerName}.`)
      }
    } finally {
      if (abortRef.current === controller) {
        abortRef.current = null
      }
      setLoading(false)
    }
  }

  function cancelGenerate(
      abortRef: React.MutableRefObject<AbortController | null>,
      setLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) {
    abortRef.current?.abort()
    abortRef.current = null
    setLoading(false)
  }

  async function handlePredict() {
    if (!boxerAName.trim() || !boxerBName.trim()) {
      setError("Please enter names for both boxers.")
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
        boxerA: {
          boxerName: boxerAName.trim(),
          attributeConfidence: boxerAConfidence,
          ...boxerAAttrs,
        },
        boxerB: {
          boxerName: boxerBName.trim(),
          attributeConfidence: boxerBConfidence,
          ...boxerBAttrs,
        },
      }

      const response = await predictMatch(payload)

      const mapped = mapPredictionResponseToUI(response)
      setResult(mapped)

      setTimeout(() => {
        resultRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }, 100)
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

        <div className="space-y-3 rounded-xl border p-4">
          <label className="text-sm font-medium">Weight Class</label>

          <div className="flex flex-col gap-3 sm:flex-row">
            <select
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                value={selectedWeightClassId}
                onChange={(e) =>
                    setSelectedWeightClassId(e.target.value ? Number(e.target.value) : "")
                }
                disabled={loadingWeightClasses}
            >
              <option value="">
                {loadingWeightClasses
                    ? "Loading weight classes..."
                    : "Select weight class"}
              </option>
              {weightClasses.map((wc) => (
                  <option key={wc.weightClassId} value={wc.weightClassId}>
                    {wc.className}
                  </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-3">
            <BoxerInputCard
                label="Boxer A (Red Corner)"
                color="red"
                name={boxerAName}
                onNameChange={setBoxerAName}
                attributes={boxerAAttrs}
                onAttributeChange={(key, value) =>
                    handleManualAttributeChange(
                        key,
                        value,
                        setBoxerAAttrs,
                        setBoxerAProfile,
                        setBoxerAFailure,
                        setBoxerAConfidence
                    )
                }
                confidence={boxerAConfidence}
                onGenerate={() =>
                    handleGenerateProfile(
                        boxerAName,
                        setBoxerAAttrs,
                        setBoxerAProfile,
                        setBoxerAFailure,
                        setLoadingBoxerA,
                        setBoxerAConfidence,
                        boxerAAbortRef
                    )
                }
                onCancelGenerate={() => cancelGenerate(boxerAAbortRef, setLoadingBoxerA)}
                onResetAttributes={() =>
                    resetBoxerAttributes(
                        setBoxerAAttrs,
                        setBoxerAProfile,
                        setBoxerAFailure,
                        setBoxerAConfidence
                    )
                }
                loadingGenerate={loadingBoxerA}
                disabledGenerate={selectedWeightClassId === ""}
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
                      aria-label="Close boxer A failure result"
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
            <BoxerInputCard
                label="Boxer B (Yellow Corner)"
                color="blue"
                name={boxerBName}
                onNameChange={setBoxerBName}
                attributes={boxerBAttrs}
                onAttributeChange={(key, value) =>
                    handleManualAttributeChange(
                        key,
                        value,
                        setBoxerBAttrs,
                        setBoxerBProfile,
                        setBoxerBFailure,
                        setBoxerBConfidence
                    )
                }
                confidence={boxerBConfidence}
                onGenerate={() =>
                    handleGenerateProfile(
                        boxerBName,
                        setBoxerBAttrs,
                        setBoxerBProfile,
                        setBoxerBFailure,
                        setLoadingBoxerB,
                        setBoxerBConfidence,
                        boxerBAbortRef
                    )
                }
                onCancelGenerate={() => cancelGenerate(boxerBAbortRef, setLoadingBoxerB)}
                onResetAttributes={() =>
                    resetBoxerAttributes(
                        setBoxerBAttrs,
                        setBoxerBProfile,
                        setBoxerBFailure,
                        setBoxerBConfidence
                    )
                }
                loadingGenerate={loadingBoxerB}
                disabledGenerate={selectedWeightClassId === ""}
            />

            {boxerBProfile && !boxerBFailure && (
                <div className="relative rounded-lg border p-3 pr-10 text-sm">
                  <button
                      type="button"
                      onClick={() => setBoxerBProfile(null)}
                      aria-label="Close boxer B profile result"
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
                      aria-label="Close boxer B failure result"
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

        {result && (
            <div ref={resultRef}>
              <PredictionResults result={result} />
            </div>
        )}
      </div>
  )
}