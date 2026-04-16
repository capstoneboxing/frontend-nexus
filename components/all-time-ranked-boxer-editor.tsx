"use client"

import { useMemo, useState } from "react"
import { Lock, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AttributeSlider } from "@/components/attribute-slider"
import { updateRankedBoxer } from "@/lib/api"
import {
    mapAllTimeRankedBoxerToUI,
    mapFormValuesToAllTimeRankedBoxerUpdateRequest,
} from "@/lib/all-time-ranked-boxer-mappers"
import type {
    AllTimeRankedBoxerFormValues,
    AllTimeRankedBoxerUI,
} from "@/lib/all-time-ranked-boxer-types"
import {appToast} from "@/lib/toast";

interface AllTimeRankedBoxerEditorProps {
    boxer: AllTimeRankedBoxerUI
    values: AllTimeRankedBoxerFormValues
    onValuesChange: (values: AllTimeRankedBoxerFormValues) => void
    onClose: () => void
    onSaved: (boxer: AllTimeRankedBoxerUI) => void
    weightClassName: string
    canEdit: boolean
}

type SliderField = {
    key: keyof AllTimeRankedBoxerFormValues
    label: string
    min: number
    max: number
    step: number
    description: string
}

const sliderFields: SliderField[] = [
    { key: "heightCm", label: "Height (cm)", min: 100, max: 300, step: 1, description: "Boxer height in centimeters." },
    { key: "reachCm", label: "Reach (cm)", min: 100, max: 300, step: 1, description: "Boxer reach in centimeters." },

    { key: "weightClassAlignment", label: "Weight Class Alignment", min: 1, max: 10, step: 0.1, description: "How naturally aligned the boxer is to the weight class." },
    { key: "handSpeed", label: "Hand Speed", min: 1, max: 10, step: 0.1, description: "Speed of punches and hand movement." },
    { key: "footSpeed", label: "Foot Speed", min: 1, max: 10, step: 0.1, description: "Mobility and speed on the feet." },
    { key: "strength", label: "Strength", min: 1, max: 10, step: 0.1, description: "Raw physical strength." },
    { key: "endurance", label: "Endurance", min: 1, max: 10, step: 0.1, description: "Ability to sustain performance over rounds." },
    { key: "reactionTime", label: "Reaction Time", min: 1, max: 10, step: 0.1, description: "How quickly the boxer reacts." },

    { key: "punchAccuracy", label: "Punch Accuracy", min: 1, max: 10, step: 0.1, description: "How accurately punches land." },
    { key: "punchVariety", label: "Punch Variety", min: 1, max: 10, step: 0.1, description: "Range of punch selection." },
    { key: "defensiveGuardEfficiency", label: "Defensive Guard Efficiency", min: 1, max: 10, step: 0.1, description: "Effectiveness of guard and defense." },
    { key: "headMovement", label: "Head Movement", min: 1, max: 10, step: 0.1, description: "Defensive slipping and upper-body movement." },
    { key: "footworkTechnique", label: "Footwork Technique", min: 1, max: 10, step: 0.1, description: "Technical quality of movement and positioning." },
    { key: "counterpunchingAbility", label: "Counterpunching Ability", min: 1, max: 10, step: 0.1, description: "Ability to counter effectively." },
    { key: "combinationEfficiency", label: "Combination Efficiency", min: 1, max: 10, step: 0.1, description: "How effectively combinations are thrown." },

    { key: "ringIq", label: "Ring IQ", min: 1, max: 10, step: 0.1, description: "Fight intelligence and awareness." },
    { key: "adaptabilityMidFight", label: "Adaptability Mid-Fight", min: 1, max: 10, step: 0.1, description: "Ability to adjust during the fight." },
    { key: "distanceControl", label: "Distance Control", min: 1, max: 10, step: 0.1, description: "Control of range and spacing." },
    { key: "tempoControl", label: "Tempo Control", min: 1, max: 10, step: 0.1, description: "Ability to control fight pace." },
    { key: "opponentPatternRecognition", label: "Opponent Pattern Recognition", min: 1, max: 10, step: 0.1, description: "Ability to read opponent tendencies." },
    { key: "fightPlanningDiscipline", label: "Fight Planning Discipline", min: 1, max: 10, step: 0.1, description: "Commitment to strategy." },

    { key: "composureUnderPressure", label: "Composure Under Pressure", min: 1, max: 10, step: 0.1, description: "Calmness under stress." },
    { key: "aggressionControl", label: "Aggression Control", min: 1, max: 10, step: 0.1, description: "Control over offensive pressure." },
    { key: "mentalToughness", label: "Mental Toughness", min: 1, max: 10, step: 0.1, description: "Mental resilience and grit." },
    { key: "focusConsistency", label: "Focus Consistency", min: 1, max: 10, step: 0.1, description: "Ability to stay focused throughout." },
    { key: "resilienceAfterKnockdown", label: "Resilience After Knockdown", min: 1, max: 10, step: 0.1, description: "Recovery and response after adversity." },

    { key: "winRatio", label: "Win Ratio", min: 0, max: 1, step: 0.01, description: "Career win ratio as a decimal." },
    { key: "knockoutRatio", label: "Knockout Ratio", min: 0, max: 1, step: 0.01, description: "Career knockout ratio as a decimal." },
    { key: "titleFightExperience", label: "Title Fight Experience", min: 1, max: 10, step: 0.1, description: "Experience in title-level fights." },
    { key: "strengthOfOpposition", label: "Strength of Opposition", min: 1, max: 10, step: 0.1, description: "Quality of opponents faced." },
    { key: "recentFightActivity", label: "Recent Fight Activity", min: 1, max: 10, step: 0.1, description: "Recency and consistency of activity." },
    { key: "performanceConsistency", label: "Performance Consistency", min: 1, max: 10, step: 0.1, description: "Consistency of performances over time." },
]

function getDisplayValue(
    key: keyof AllTimeRankedBoxerFormValues,
    value: number
): string {
    if (key === "heightCm" || key === "reachCm") {
        return `${value} cm`
    }

    if (key === "winRatio" || key === "knockoutRatio") {
        return `${(value * 100).toFixed(0)}%`
    }

    return `${value}`
}

export function AllTimeRankedBoxerEditor({
                                             boxer,
                                             values,
                                             onValuesChange,
                                             onClose,
                                             onSaved,
                                             weightClassName,
                                             canEdit,
                                         }: AllTimeRankedBoxerEditorProps) {
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const groupedFields = useMemo(() => {
        const physical = sliderFields.filter((f) =>
            ["heightCm", "reachCm", "weightClassAlignment", "handSpeed", "footSpeed", "strength", "endurance", "reactionTime"].includes(f.key)
        )
        const technical = sliderFields.filter((f) =>
            ["punchAccuracy", "punchVariety", "defensiveGuardEfficiency", "headMovement", "footworkTechnique", "counterpunchingAbility", "combinationEfficiency"].includes(f.key)
        )
        const tactical = sliderFields.filter((f) =>
            ["ringIq", "adaptabilityMidFight", "distanceControl", "tempoControl", "opponentPatternRecognition", "fightPlanningDiscipline"].includes(f.key)
        )
        const psychological = sliderFields.filter((f) =>
            ["composureUnderPressure", "aggressionControl", "mentalToughness", "focusConsistency", "resilienceAfterKnockdown"].includes(f.key)
        )
        const experience = sliderFields.filter((f) =>
            ["winRatio", "knockoutRatio", "titleFightExperience", "strengthOfOpposition", "recentFightActivity", "performanceConsistency"].includes(f.key)
        )

        return { physical, technical, tactical, psychological, experience }
    }, [])

    function updateField(
        key: keyof AllTimeRankedBoxerFormValues,
        value: number | string
    ) {
        if (!canEdit) return

        onValuesChange({
            ...values,
            [key]: value,
        })
    }

    async function handleSave() {
        if (!canEdit) return

        try {
            setSaving(true)
            setError(null)

            const payload = mapFormValuesToAllTimeRankedBoxerUpdateRequest(values)

            const updated = await updateRankedBoxer(boxer.rankedBoxerId, payload)

            onSaved(mapAllTimeRankedBoxerToUI(updated, weightClassName))
            appToast.success("Successfully updated all Time Ranked Boxer")
        } catch (err) {
            console.error(err)
            appToast.error("Failed to update all Time Ranked Boxer")
        } finally {
            setSaving(false)
        }
    }

    const hasChanges = useMemo(() => {
        return sliderFields.some((field) => {
            const key = field.key

            const originalValue = boxer[key as keyof AllTimeRankedBoxerUI]
            const currentValue = values[key]

            return Number(originalValue) !== Number(currentValue)
        })
    }, [boxer, values])

    return (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50">
            <div className="h-full w-full max-w-3xl overflow-y-auto border-l border-border bg-background shadow-xl">
                <div className="sticky top-0 z-10 flex items-start justify-between border-b border-border bg-background px-6 py-4">
                    <div>
                        <h2 className="font-display text-xl font-bold text-foreground">
                            {boxer.boxerName}
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Rank #{boxer.rankingPosition ?? "—"} • {weightClassName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Generated: {boxer.generatedAtLabel} at {boxer.generatedTimeLabel}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-md p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
                        aria-label="Close editor"
                    >
                        <X className="size-4" />
                    </button>
                </div>

                <div className="space-y-6 px-6 py-6">
                    {!canEdit && (
                        <div className="rounded-lg border border-border bg-secondary/40 px-4 py-3">
                            <div className="flex items-center gap-2">
                                <Lock className="size-4 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">
                                    Sign in as admin to edit attributes and save changes.
                                </p>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3">
                            <p className="text-sm text-destructive">{error}</p>
                        </div>
                    )}

                    {Object.entries(groupedFields).map(([groupName, fields]) => (
                        <div key={groupName} className="rounded-xl border border-border bg-card p-4">
                            <h3 className="mb-4 text-sm font-semibold capitalize text-foreground">
                                {groupName}
                            </h3>

                            <div className="space-y-4">
                                {fields.map((field) => {
                                    const numericValue = Number(values[field.key] ?? 0)

                                    return (
                                        <AttributeSlider
                                            key={field.key}
                                            label={field.label}
                                            value={numericValue}
                                            onChange={(value) => updateField(field.key, value)}
                                            description={field.description}
                                            min={field.min}
                                            max={field.max}
                                            step={field.step}
                                            displayValue={getDisplayValue(field.key, numericValue)}
                                            disabled={!canEdit || saving}
                                        />
                                    )
                                })}
                            </div>
                        </div>
                    ))}

                    <div className="rounded-xl border border-border bg-card p-4">
                        <h3 className="mb-4 text-sm font-semibold text-foreground">
                            Source Note
                        </h3>
                        <textarea
                            value={values.sourceNote}
                            readOnly
                            disabled
                            className="min-h-28 w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm text-muted-foreground outline-none"
                            placeholder="No source note available."
                        />
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
                            Close
                        </Button>
                        <Button
                            type="button"
                            onClick={handleSave}
                            disabled={!canEdit || saving || !hasChanges}
                        >
                            {saving ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}