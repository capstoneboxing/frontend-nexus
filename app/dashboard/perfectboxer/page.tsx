"use client"

import { useEffect, useMemo, useState } from "react"
import {
    Calendar,
    ChevronDown,
    ChevronUp,
    Clock,
    RefreshCcw,
    RotateCw,
    Search,
    Trophy,
    WandSparkles,
    X,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { fetchAllActivePerfectBoxers,
    fetchWeightClasses,
    generatePerfectBoxer,
    fetchPerfectBoxerBatchStatus,
    recalculatePerfectBoxerByWeightClass } from "@/lib/api"
import { isLoggedIn } from "@/lib/auth"
import type {
    PerfectBoxerBatchStatusResponse,
    PerfectBoxerGenerationRequest,
    PerfectBoxerGenerationStartedResponse,
    PerfectBoxerResponse,
    WeightClassResponse,
} from "@/generated-api/models"
import { appToast } from "@/lib/toast"
import React from "react"

type PerfectBoxerTableRow = {
    perfectBoxerId: number
    batchId: number | null
    weightClassId: number | null
    weightClassName: string
    heightCm: number
    reachCm: number
    weightClassAlignment: number
    handSpeed: number
    footSpeed: number
    strength: number
    endurance: number
    reactionTime: number
    punchAccuracy: number
    punchVariety: number
    defensiveGuardEfficiency: number
    headMovement: number
    footworkTechnique: number
    counterpunchingAbility: number
    combinationEfficiency: number
    ringIq: number
    adaptabilityMidFight: number
    distanceControl: number
    tempoControl: number
    opponentPatternRecognition: number
    fightPlanningDiscipline: number
    composureUnderPressure: number
    aggressionControl: number
    mentalToughness: number
    focusConsistency: number
    resilienceAfterKnockdown: number
    winRatio: number
    knockoutRatio: number
    titleFightExperience: number
    strengthOfOpposition: number
    recentFightActivity: number
    performanceConsistency: number
    createdAt: Date | null
    updatedAt: Date | null
}

const GENERATION_AMOUNTS = [3, 5, 10] as const

function formatDate(value: Date | null): string {
    if (!value) return "N/A"

    return value.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    })
}

function formatTime(value: Date | null): string {
    if (!value) return "N/A"

    return value.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
    })
}

function mapPerfectBoxerToRow(
    item: PerfectBoxerResponse,
    weightClassMap: Record<number, string>
): PerfectBoxerTableRow {
    return {
        perfectBoxerId: item.perfectBoxerId ?? 0,
        batchId: item.batchId ?? null,
        weightClassId: item.weightClassId ?? null,
        weightClassName:
            item.weightClassId != null
                ? weightClassMap[item.weightClassId] ?? `Weight Class ${item.weightClassId}`
                : "Unknown",

        heightCm: item.heightCm ?? 0,
        reachCm: item.reachCm ?? 0,
        weightClassAlignment: item.weightClassAlignment ?? 0,
        handSpeed: item.handSpeed ?? 0,
        footSpeed: item.footSpeed ?? 0,
        strength: item.strength ?? 0,
        endurance: item.endurance ?? 0,
        reactionTime: item.reactionTime ?? 0,
        punchAccuracy: item.punchAccuracy ?? 0,
        punchVariety: item.punchVariety ?? 0,
        defensiveGuardEfficiency: item.defensiveGuardEfficiency ?? 0,
        headMovement: item.headMovement ?? 0,
        footworkTechnique: item.footworkTechnique ?? 0,
        counterpunchingAbility: item.counterpunchingAbility ?? 0,
        combinationEfficiency: item.combinationEfficiency ?? 0,
        ringIq: item.ringIq ?? 0,
        adaptabilityMidFight: item.adaptabilityMidFight ?? 0,
        distanceControl: item.distanceControl ?? 0,
        tempoControl: item.tempoControl ?? 0,
        opponentPatternRecognition: item.opponentPatternRecognition ?? 0,
        fightPlanningDiscipline: item.fightPlanningDiscipline ?? 0,
        composureUnderPressure: item.composureUnderPressure ?? 0,
        aggressionControl: item.aggressionControl ?? 0,
        mentalToughness: item.mentalToughness ?? 0,
        focusConsistency: item.focusConsistency ?? 0,
        resilienceAfterKnockdown: item.resilienceAfterKnockdown ?? 0,
        winRatio: item.winRatio ?? 0,
        knockoutRatio: item.knockoutRatio ?? 0,
        titleFightExperience: item.titleFightExperience ?? 0,
        strengthOfOpposition: item.strengthOfOpposition ?? 0,
        recentFightActivity: item.recentFightActivity ?? 0,
        performanceConsistency: item.performanceConsistency ?? 0,

        createdAt: item.createdAt ?? null,
        updatedAt: item.updatedAt ?? null,
    }
}

export default function PerfectBoxerPage() {
    const [mounted, setMounted] = useState(false)
    const loggedIn = mounted ? isLoggedIn() : false

    const [rows, setRows] = useState<PerfectBoxerTableRow[]>([])
    const [weightClasses, setWeightClasses] = useState<WeightClassResponse[]>([])
    const [weightOrderMap, setWeightOrderMap] = useState<Record<number, number>>({})
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [search, setSearch] = useState("")
    const [error, setError] = useState<string | null>(null)
    const [expandedId, setExpandedId] = useState<number | null>(null)
    const [recalculatingWeightClassId, setRecalculatingWeightClassId] =
        useState<number | null>(null)

    const [generateWeightClassId, setGenerateWeightClassId] = useState<number | "">("")
    const [generateAmount, setGenerateAmount] = useState<number>(10)
    const [generating, setGenerating] = useState(false)
    const [checkingBatchStatus, setCheckingBatchStatus] = useState(false)
    const [generationStarted, setGenerationStarted] =
        useState<PerfectBoxerGenerationStartedResponse | null>(null)
    const [batchStatus, setBatchStatus] =
        useState<PerfectBoxerBatchStatusResponse | null>(null)

    useEffect(() => {
        setMounted(true)
    }, [])

    function sortRowsByWeightClass(data: PerfectBoxerTableRow[]) {
        return [...data].sort((a, b) => {
            const weightA =
                a.weightClassId != null ? weightOrderMap[a.weightClassId] ?? 0 : 0
            const weightB =
                b.weightClassId != null ? weightOrderMap[b.weightClassId] ?? 0 : 0

            return weightA - weightB || a.weightClassName.localeCompare(b.weightClassName)
        })
    }

    async function fetchAll(isRefresh = false) {
        try {
            if (isRefresh) {
                setRefreshing(true)
            } else {
                setLoading(true)
            }

            const [perfectBoxers, weightClassesData] = await Promise.all([
                fetchAllActivePerfectBoxers(),
                fetchWeightClasses(),
            ])

            setWeightClasses(weightClassesData)

            const nextWeightOrderMap = Object.fromEntries(
                weightClassesData
                    .filter((wc) => wc.weightClassId != null)
                    .map((wc) => [wc.weightClassId as number, wc.minWeightLb ?? 0])
            )
            setWeightOrderMap(nextWeightOrderMap)

            const weightClassMap = Object.fromEntries(
                weightClassesData
                    .filter((wc) => wc.weightClassId != null)
                    .map((wc) => [wc.weightClassId as number, wc.className ?? "Unknown"])
            )

            const mapped = perfectBoxers
                .map((item) => mapPerfectBoxerToRow(item, weightClassMap))
                .sort((a, b) => {
                    const weightA =
                        a.weightClassId != null ? nextWeightOrderMap[a.weightClassId] ?? 0 : 0
                    const weightB =
                        b.weightClassId != null ? nextWeightOrderMap[b.weightClassId] ?? 0 : 0

                    return weightA - weightB || a.weightClassName.localeCompare(b.weightClassName)
                })

            setRows(mapped)

            if (generateWeightClassId === "" && weightClassesData.length > 0) {
                setGenerateWeightClassId(weightClassesData[0].weightClassId ?? "")
            }

            setError(null)
        } catch (err) {
            console.error(err)
            setError("Failed to load active perfect boxers.")
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }

    useEffect(() => {
        if (!mounted) return
        void fetchAll()
    }, [mounted])

    const filteredRows = useMemo(() => {
        const q = search.trim().toLowerCase()
        if (!q) return rows

        return rows.filter((row) => row.weightClassName.toLowerCase().includes(q))
    }, [rows, search])

    async function handleGeneratePerfectBoxer() {
        if (!loggedIn || generateWeightClassId === "") return

        try {
            setGenerating(true)
            setError(null)
            setBatchStatus(null)

            const payload: PerfectBoxerGenerationRequest = {
                weightClassId: generateWeightClassId,
                amount: generateAmount,
            }

            const started = await generatePerfectBoxer(payload)

            setGenerationStarted(started)
        } catch (err) {
            console.error(err)
            setError("Failed to start perfect boxer generation.")
        } finally {
            setGenerating(false)
        }
    }

    async function handleCheckBatchStatus() {
        if (!generationStarted?.batchId) return

        try {
            setCheckingBatchStatus(true)
            setError(null)

            const status = await fetchPerfectBoxerBatchStatus(generationStarted.batchId)

            setBatchStatus(status)

            if (status.status?.toLowerCase() === "completed" || status.perfectBoxerId) {
                await fetchAll(true)
            }
        } catch (err) {
            console.error(err)
            setError("Failed to check batch status.")
        } finally {
            setCheckingBatchStatus(false)
        }
    }

    async function handleRecalculate(row: PerfectBoxerTableRow) {
        if (!loggedIn || row.weightClassId == null) return

        try {
            setRecalculatingWeightClassId(row.weightClassId)
            setError(null)

            const updated = await recalculatePerfectBoxerByWeightClass(row.weightClassId)

            setRows((prev) =>
                sortRowsByWeightClass(
                    prev.map((item) =>
                        item.weightClassId === row.weightClassId
                            ? {
                                ...item,
                                perfectBoxerId: updated.perfectBoxerId ?? item.perfectBoxerId,
                                batchId: updated.batchId ?? item.batchId,
                                heightCm: updated.heightCm ?? item.heightCm,
                                reachCm: updated.reachCm ?? item.reachCm,
                                weightClassAlignment:
                                    updated.weightClassAlignment ?? item.weightClassAlignment,
                                handSpeed: updated.handSpeed ?? item.handSpeed,
                                footSpeed: updated.footSpeed ?? item.footSpeed,
                                strength: updated.strength ?? item.strength,
                                endurance: updated.endurance ?? item.endurance,
                                reactionTime: updated.reactionTime ?? item.reactionTime,
                                punchAccuracy: updated.punchAccuracy ?? item.punchAccuracy,
                                punchVariety: updated.punchVariety ?? item.punchVariety,
                                defensiveGuardEfficiency:
                                    updated.defensiveGuardEfficiency ?? item.defensiveGuardEfficiency,
                                headMovement: updated.headMovement ?? item.headMovement,
                                footworkTechnique:
                                    updated.footworkTechnique ?? item.footworkTechnique,
                                counterpunchingAbility:
                                    updated.counterpunchingAbility ?? item.counterpunchingAbility,
                                combinationEfficiency:
                                    updated.combinationEfficiency ?? item.combinationEfficiency,
                                ringIq: updated.ringIq ?? item.ringIq,
                                adaptabilityMidFight:
                                    updated.adaptabilityMidFight ?? item.adaptabilityMidFight,
                                distanceControl: updated.distanceControl ?? item.distanceControl,
                                tempoControl: updated.tempoControl ?? item.tempoControl,
                                opponentPatternRecognition:
                                    updated.opponentPatternRecognition ??
                                    item.opponentPatternRecognition,
                                fightPlanningDiscipline:
                                    updated.fightPlanningDiscipline ?? item.fightPlanningDiscipline,
                                composureUnderPressure:
                                    updated.composureUnderPressure ?? item.composureUnderPressure,
                                aggressionControl:
                                    updated.aggressionControl ?? item.aggressionControl,
                                mentalToughness: updated.mentalToughness ?? item.mentalToughness,
                                focusConsistency:
                                    updated.focusConsistency ?? item.focusConsistency,
                                resilienceAfterKnockdown:
                                    updated.resilienceAfterKnockdown ??
                                    item.resilienceAfterKnockdown,
                                winRatio: updated.winRatio ?? item.winRatio,
                                knockoutRatio: updated.knockoutRatio ?? item.knockoutRatio,
                                titleFightExperience:
                                    updated.titleFightExperience ?? item.titleFightExperience,
                                strengthOfOpposition:
                                    updated.strengthOfOpposition ?? item.strengthOfOpposition,
                                recentFightActivity:
                                    updated.recentFightActivity ?? item.recentFightActivity,
                                performanceConsistency:
                                    updated.performanceConsistency ?? item.performanceConsistency,
                                createdAt: updated.createdAt ?? item.createdAt,
                                updatedAt: updated.updatedAt ?? item.updatedAt,
                            }
                            : item
                    )
                )
            )

            appToast.success(`Successfully recalculated perfect boxer for ${row.weightClassName}`)
        } catch (err) {
            console.error(err)
            appToast.error(`Failed to recalculate ${row.weightClassName}.`)
        } finally {
            setRecalculatingWeightClassId(null)
        }
    }

    const renderStat = (label: string, value: string | number) => (
        <div className="rounded-md border border-border bg-background p-3">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                {label}
            </p>
            <p className="mt-1 text-sm font-medium text-foreground">{value}</p>
        </div>
    )

    if (!mounted) {
        return null
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-display text-2xl font-bold text-foreground">
                    Perfect Boxers
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    View all active perfect boxer records across weight classes, generate new ones, and recalculate existing ones when needed.
                </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-5">
                <div className="mb-4">
                    <h2 className="text-sm font-semibold text-foreground">
                        Generate Perfect Boxer
                    </h2>
                    <p className="text-xs text-muted-foreground">
                        Start a new generation batch for a weight class using 3, 5, or 10 top ranked boxers.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_180px_auto]">
                    <select
                        value={generateWeightClassId}
                        onChange={(e) =>
                            setGenerateWeightClassId(e.target.value ? Number(e.target.value) : "")
                        }
                        disabled={!loggedIn || generating}
                        className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                    >
                        <option value="">Select weight class</option>
                        {weightClasses.map((wc) => (
                            <option key={wc.weightClassId} value={wc.weightClassId}>
                                {wc.className}
                            </option>
                        ))}
                    </select>

                    <select
                        value={generateAmount}
                        onChange={(e) => setGenerateAmount(Number(e.target.value))}
                        disabled={!loggedIn || generating}
                        className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                    >
                        {GENERATION_AMOUNTS.map((amount) => (
                            <option key={amount} value={amount}>
                                Top {amount}
                            </option>
                        ))}
                    </select>

                    <Button
                        type="button"
                        onClick={() => void handleGeneratePerfectBoxer()}
                        disabled={!loggedIn || generateWeightClassId === "" || generating}
                    >
                        {generating ? (
                            <>
                                <RotateCw className="mr-2 size-4 animate-spin" />
                                Starting...
                            </>
                        ) : (
                            <>
                                <WandSparkles className="mr-2 size-4" />
                                Generate
                            </>
                        )}
                    </Button>
                </div>

                {!loggedIn && (
                    <p className="mt-3 text-sm text-muted-foreground">
                        Sign in as admin to generate a perfect boxer.
                    </p>
                )}

                {generationStarted && (
                    <div className="mt-4 relative rounded-lg border border-border bg-background p-4">
                        <button
                            onClick={() => setGenerationStarted(null)}
                            className="absolute right-2 top-2 text-muted-foreground hover:text-foreground"
                            aria-label="Close"
                        >
                            <X className="size-4" />
                        </button>
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Generation Started
                        </p>

                        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                            {renderStat("Batch ID", generationStarted.batchId ?? "N/A")}
                            {renderStat("Weight Class ID", generationStarted.weightClassId ?? "N/A")}
                            {renderStat("Amount", generationStarted.amount ?? "N/A")}
                            {renderStat("Status", generationStarted.status ?? "N/A")}
                            {renderStat("Message", generationStarted.message ?? "N/A")}
                        </div>

                        {generationStarted.batchId && (
                            <div className="mt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => void handleCheckBatchStatus()}
                                    disabled={checkingBatchStatus}
                                >
                                    {checkingBatchStatus ? (
                                        <>
                                            <RotateCw className="mr-2 size-4 animate-spin" />
                                            Checking Status...
                                        </>
                                    ) : (
                                        <>
                                            <RefreshCcw className="mr-2 size-4" />
                                            Check Batch Status
                                        </>
                                    )}
                                </Button>
                            </div>
                        )}
                    </div>
                )}

                {batchStatus && (
                    <div className="mt-4 relative rounded-lg border border-border bg-background p-4">
                        <button
                            onClick={() => setBatchStatus(null)}
                            className="absolute right-2 top-2 text-muted-foreground hover:text-foreground"
                            aria-label="Close"
                        >
                            <X className="size-4" />
                        </button>
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Batch Status
                        </p>

                        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                            {renderStat("Batch ID", batchStatus.batchId ?? "N/A")}
                            {renderStat("Status", batchStatus.status ?? "N/A")}
                            {renderStat("Active", batchStatus.isActive ? "Yes" : "No")}
                            {renderStat("Perfect Boxer ID", batchStatus.perfectBoxerId ?? "N/A")}
                            {renderStat("Amount", batchStatus.amount ?? "N/A")}
                            {renderStat("Weight Class ID", batchStatus.weightClassId ?? "N/A")}
                            {renderStat("Created At", formatDate(batchStatus.createdAt ?? null))}
                            {renderStat("Error", batchStatus.errorMessage ?? "None")}
                        </div>
                    </div>
                )}
            </div>

            <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Active Perfect Boxers
                </p>
                <p className="mt-1 font-display text-2xl font-bold text-foreground">
                    {loading ? "—" : rows.length}
                </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search by weight class..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border-border bg-card pl-9 text-foreground placeholder:text-muted-foreground"
                    />
                </div>

                <Button
                    type="button"
                    variant="outline"
                    onClick={() => void fetchAll(true)}
                    disabled={loading || refreshing}
                    className="sm:w-auto"
                >
                    {refreshing ? (
                        <>
                            <RefreshCcw className="mr-2 size-4 animate-spin" />
                            Refreshing...
                        </>
                    ) : (
                        <>
                            <RefreshCcw className="mr-2 size-4" />
                            Refresh
                        </>
                    )}
                </Button>
            </div>

            {loading && (
                <div className="flex items-center justify-center py-12">
                    <p className="text-sm text-muted-foreground">Loading active perfect boxers...</p>
                </div>
            )}

            {error && (
                <div className="relative rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3">
                    <button
                        onClick={() => setError(null)}
                        className="absolute right-2 top-2 text-destructive hover:opacity-80"
                        aria-label="Close"
                    >
                        <X className="size-4" />
                    </button>
                    <p className="text-sm text-destructive">{error}</p>
                </div>
            )}

            {!loading && !error && (
                <div className="overflow-hidden rounded-xl border border-border bg-card">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                            <tr className="border-b border-border bg-secondary/50">
                                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    Weight Class
                                </th>
                                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    Win %
                                </th>
                                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    KO %
                                </th>
                                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    Created At
                                </th>
                                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    Updated At
                                </th>
                                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    Action
                                </th>
                            </tr>
                            </thead>

                            <tbody className="divide-y divide-border">
                            {filteredRows.map((row) => {
                                const isExpanded = expandedId === row.perfectBoxerId

                                return (
                                    <React.Fragment key={row.perfectBoxerId}>
                                        <tr
                                            className={`cursor-pointer border-l-4 transition-colors ${
                                                isExpanded
                                                    ? "border-l-primary bg-secondary/20"
                                                    : "border-l-transparent hover:bg-secondary/20"
                                            }`}
                                            onClick={() =>
                                                setExpandedId(isExpanded ? null : row.perfectBoxerId)
                                            }
                                            role="button"
                                            tabIndex={0}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" || e.key === " ") {
                                                    e.preventDefault()
                                                    setExpandedId(isExpanded ? null : row.perfectBoxerId)
                                                }
                                            }}
                                        >
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
                                                        <Trophy className="size-4 text-primary" />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <p className="text-sm font-medium text-foreground">
                                                                {row.weightClassName}
                                                            </p>
                                                            {isExpanded ? (
                                                                <ChevronUp className="size-4 text-muted-foreground" />
                                                            ) : (
                                                                <ChevronDown className="size-4 text-muted-foreground" />
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-muted-foreground">
                                                            Perfect Boxer ID: {row.perfectBoxerId}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-5 py-3.5">
                          <span className="font-display text-sm font-bold text-foreground">
                            {(row.winRatio * 100).toFixed(1)}%
                          </span>
                                            </td>

                                            <td className="px-5 py-3.5">
                          <span className="font-display text-sm font-bold text-foreground">
                            {(row.knockoutRatio * 100).toFixed(1)}%
                          </span>
                                            </td>

                                            <td className="px-5 py-3.5 text-sm text-muted-foreground">
                                                <div className="space-y-1">
                            <span className="flex items-center gap-1.5">
                              <Calendar className="size-3 shrink-0" />
                                {formatDate(row.createdAt)}
                            </span>
                                                    <span className="flex items-center gap-1.5">
                              <Clock className="size-3 shrink-0" />
                                                        {formatTime(row.createdAt)}
                            </span>
                                                </div>
                                            </td>

                                            <td className="px-5 py-3.5 text-sm text-muted-foreground">
                                                <div className="space-y-1">
                            <span className="flex items-center gap-1.5">
                              <Calendar className="size-3 shrink-0" />
                                {formatDate(row.updatedAt)}
                            </span>
                                                    <span className="flex items-center gap-1.5">
                              <Clock className="size-3 shrink-0" />
                                                        {formatTime(row.updatedAt)}
                            </span>
                                                </div>
                                            </td>

                                            <td
                                                className="px-5 py-3.5"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => void handleRecalculate(row)}
                                                    disabled={
                                                        !loggedIn ||
                                                        row.weightClassId == null ||
                                                        recalculatingWeightClassId === row.weightClassId
                                                    }
                                                >
                                                    {recalculatingWeightClassId === row.weightClassId ? (
                                                        <>
                                                            <RotateCw className="mr-2 size-4 animate-spin" />
                                                            Recalculating...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <RotateCw className="mr-2 size-4" />
                                                            Recalculate
                                                        </>
                                                    )}
                                                </Button>
                                            </td>
                                        </tr>

                                        {isExpanded && (
                                            <tr className="border-l-4 border-l-primary">
                                                <td colSpan={6} className="px-5 py-4">
                                                    <div className="space-y-5">
                                                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                                            {renderStat("Height", `${row.heightCm.toFixed(1)} cm`)}
                                                            {renderStat("Reach", `${row.reachCm.toFixed(1)} cm`)}
                                                            {renderStat(
                                                                "Win Ratio",
                                                                `${(row.winRatio * 100).toFixed(1)}%`
                                                            )}
                                                            {renderStat(
                                                                "KO Ratio",
                                                                `${(row.knockoutRatio * 100).toFixed(1)}%`
                                                            )}
                                                        </div>

                                                        <div className="grid gap-4 lg:grid-cols-5">
                                                            <div className="rounded-lg border border-border bg-card p-4">
                                                                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                                                    Physical
                                                                </p>
                                                                <div className="mt-3 space-y-2 text-sm">
                                                                    <p><strong>Weight Class Alignment:</strong> {row.weightClassAlignment.toFixed(1)}</p>
                                                                    <p><strong>Hand Speed:</strong> {row.handSpeed.toFixed(1)}</p>
                                                                    <p><strong>Foot Speed:</strong> {row.footSpeed.toFixed(1)}</p>
                                                                    <p><strong>Strength:</strong> {row.strength.toFixed(1)}</p>
                                                                    <p><strong>Endurance:</strong> {row.endurance.toFixed(1)}</p>
                                                                    <p><strong>Reaction Time:</strong> {row.reactionTime.toFixed(1)}</p>
                                                                </div>
                                                            </div>

                                                            <div className="rounded-lg border border-border bg-card p-4">
                                                                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                                                    Technical
                                                                </p>
                                                                <div className="mt-3 space-y-2 text-sm">
                                                                    <p><strong>Punch Accuracy:</strong> {row.punchAccuracy.toFixed(1)}</p>
                                                                    <p><strong>Punch Variety:</strong> {row.punchVariety.toFixed(1)}</p>
                                                                    <p><strong>Defensive Guard Efficiency:</strong> {row.defensiveGuardEfficiency.toFixed(1)}</p>
                                                                    <p><strong>Head Movement:</strong> {row.headMovement.toFixed(1)}</p>
                                                                    <p><strong>Footwork Technique:</strong> {row.footworkTechnique.toFixed(1)}</p>
                                                                    <p><strong>Counterpunching Ability:</strong> {row.counterpunchingAbility.toFixed(1)}</p>
                                                                    <p><strong>Combination Efficiency:</strong> {row.combinationEfficiency.toFixed(1)}</p>
                                                                </div>
                                                            </div>

                                                            <div className="rounded-lg border border-border bg-card p-4">
                                                                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                                                    Tactical
                                                                </p>
                                                                <div className="mt-3 space-y-2 text-sm">
                                                                    <p><strong>Ring IQ:</strong> {row.ringIq.toFixed(1)}</p>
                                                                    <p><strong>Adaptability Mid-Fight:</strong> {row.adaptabilityMidFight.toFixed(1)}</p>
                                                                    <p><strong>Distance Control:</strong> {row.distanceControl.toFixed(1)}</p>
                                                                    <p><strong>Tempo Control:</strong> {row.tempoControl.toFixed(1)}</p>
                                                                    <p><strong>Opponent Pattern Recognition:</strong> {row.opponentPatternRecognition.toFixed(1)}</p>
                                                                    <p><strong>Fight Planning Discipline:</strong> {row.fightPlanningDiscipline.toFixed(1)}</p>
                                                                </div>
                                                            </div>

                                                            <div className="rounded-lg border border-border bg-card p-4">
                                                                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                                                    Psychological
                                                                </p>
                                                                <div className="mt-3 space-y-2 text-sm">
                                                                    <p><strong>Composure Under Pressure:</strong> {row.composureUnderPressure.toFixed(1)}</p>
                                                                    <p><strong>Aggression Control:</strong> {row.aggressionControl.toFixed(1)}</p>
                                                                    <p><strong>Mental Toughness:</strong> {row.mentalToughness.toFixed(1)}</p>
                                                                    <p><strong>Focus Consistency:</strong> {row.focusConsistency.toFixed(1)}</p>
                                                                    <p><strong>Resilience After Knockdown:</strong> {row.resilienceAfterKnockdown.toFixed(1)}</p>
                                                                </div>
                                                            </div>

                                                            <div className="rounded-lg border border-border bg-card p-4">
                                                                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                                                    Experience
                                                                </p>
                                                                <div className="mt-3 space-y-2 text-sm">
                                                                    <p><strong>Title Fight Experience:</strong> {row.titleFightExperience.toFixed(1)}</p>
                                                                    <p><strong>Strength Of Opposition:</strong> {row.strengthOfOpposition.toFixed(1)}</p>
                                                                    <p><strong>Recent Fight Activity:</strong> {row.recentFightActivity.toFixed(1)}</p>
                                                                    <p><strong>Performance Consistency:</strong> {row.performanceConsistency.toFixed(1)}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                )
                            })}
                            </tbody>
                        </table>
                    </div>

                    {filteredRows.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Trophy className="size-8 text-muted-foreground" />
                            <p className="mt-3 text-sm text-muted-foreground">
                                No active perfect boxers found.
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}