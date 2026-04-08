"use client"

import Link from "next/link"
import {
  Activity,
  BarChart3,
  Brain,
  ChevronRight,
  Github,
  Target,
  Trophy,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-md bg-primary">
              <Trophy className="size-4 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold tracking-tight text-foreground">
              BOXPREDICT
            </span>
          </Link>
          <div className="hidden items-center gap-8 md:flex">
            <Link
              href="#features"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              How It Works
            </Link>
            <Link href="/dashboard">
              <Button
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Launch App
              </Button>
            </Link>
          </div>
          <Link href="/dashboard" className="md:hidden">
            <Button
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Launch App
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-20">
        {/* Background Pattern */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
          <div className="absolute right-0 top-1/4 size-96 rounded-full bg-accent/5 blur-3xl" />
          <div className="absolute bottom-1/4 left-0 size-96 rounded-full bg-primary/5 blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-1.5">
            <Zap className="size-3.5 text-accent" />
            <span className="text-xs font-medium text-muted-foreground">
              AI-Powered Boxing Analytics
            </span>
          </div>

          <h1 className="font-display text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl md:text-7xl">
            <span className="text-balance">
              Predict Boxing Match Outcomes Using{" "}
              <span className="text-primary">AI</span> &{" "}
              <span className="text-accent">Performance Analytics</span>
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
            A data-driven boxing prediction tool built around weight-class-specific
            perfect boxer benchmarks, normalized fighter attributes, category scoring,
            closeness analysis, and probability-based outcomes.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/dashboard/predict">
              <Button
                size="lg"
                className="bg-primary px-8 text-primary-foreground hover:bg-primary/90"
              >
                Start Prediction
                <ChevronRight className="ml-1 size-4" />
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button
                size="lg"
                variant="outline"
                className="border-border px-8 text-foreground hover:bg-secondary"
              >
                Learn How It Works
              </Button>
            </Link>
          </div>

          {/* Stats Bar */}
          <div className="mx-auto mt-16 grid max-w-3xl grid-cols-3 gap-6 rounded-xl border border-border bg-card/50 p-6 backdrop-blur-sm">
            <div>
              <p className="font-display text-2xl font-bold text-primary md:text-3xl">
                5
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Attribute Categories
              </p>
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-accent md:text-3xl">
                32
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Fighter Attributes
              </p>
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-foreground md:text-3xl">
                AI + Math
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Benchmark & Prediction Logic
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="border-t border-border py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-16 text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">
              Features
            </p>
            <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
              <span className="text-balance">
                Built for Structured Boxing Prediction
              </span>
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: BarChart3,
                title: "32-Attribute Fighter Profiles",
                description:
                    "Evaluate fighters using physical, technical, tactical, psychological, and experience-based attributes.",
              },
              {
                icon: Brain,
                title: "AI-Generated Boxer Profiles",
                description:
                    "Generate boxer profiles and top-ranked boxer lists by weight class to support analysis and benchmarking.",
              },
              {
                icon: Activity,
                title: "Perfect Boxer Benchmarks",
                description:
                    "Each weight class has its own perfect boxer, built by averaging the attributes of AI-generated top-ranked fighters in that division.",
              },
              {
                icon: Target,
                title: "Closeness & Probability Analysis",
                description:
                    "Compare fighters to the perfect boxer using normalized category scores, closeness calculations, and probability-based predictions.",
              },
            ].map((feature) => (
                <div
                    key={feature.title}
                    className="group rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/30"
                >
                  <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-2.5">
                    <feature.icon className="size-5 text-primary" />
                  </div>
                  <h3 className="mb-2 text-sm font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="border-t border-border bg-card/30 py-24">
        <div className="mx-auto max-w-4xl px-6">
          <div className="mb-16 text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">
              Methodology
            </p>
            <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
              <span className="text-balance">How the Prediction Model Works</span>
            </h2>
          </div>

          <div className="space-y-8">
            {[
              {
                step: "01",
                title: "Generate Top Ranked Boxers by Weight Class",
                description:
                    "The system uses AI to generate top-ranked boxers for a selected weight class, along with structured attribute values for each fighter.",
              },
              {
                step: "02",
                title: "Build the Perfect Boxer",
                description:
                    "A perfect boxer is created for that weight class by averaging the attributes of those top-ranked fighters, producing a benchmark based on real boxing profiles rather than an abstract maximum.",
              },
              {
                step: "03",
                title: "Normalize and Score Attributes",
                description:
                    "Fighter attributes are normalized by type, grouped into five categories, and combined into category and overall scores for fair comparison.",
              },
              {
                step: "04",
                title: "Compare Closeness and Predict Outcome",
                description:
                    "Each fighter is compared to the perfect boxer using closeness calculations. Those closeness values are then converted into win probabilities for the final match prediction.",
              },
            ].map((item) => (
                <div
                    key={item.step}
                    className="flex gap-6 rounded-xl border border-border bg-card p-6"
                >
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <span className="font-display text-lg font-bold text-primary">
                      {item.step}
                    </span>
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold text-foreground">
                      {item.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background py-12">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-md bg-primary">
                <Trophy className="size-3.5 text-primary-foreground" />
              </div>
              <span className="font-display text-lg font-bold tracking-tight text-foreground">
                BOXPREDICT
              </span>
            </div>

            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link href="/dashboard" className="hover:text-foreground">
                Dashboard
              </Link>
              <Link href="/dashboard/predict" className="hover:text-foreground">
                Predict
              </Link>
              <Link href="/dashboard/boxers" className="hover:text-foreground">
                Boxers
              </Link>
              <Link
                href="/dashboard/model"
                className="hover:text-foreground"
              >
                Model
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground"
                aria-label="GitHub Repository"
              >
                <Github className="size-5" />
              </a>
              <span className="text-xs text-muted-foreground">
                Research Project 2026
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
