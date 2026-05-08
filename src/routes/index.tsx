import { Link, createFileRoute } from "@tanstack/react-router"
import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  GraduationCap,
  ShieldCheck,
} from "lucide-react"

import { Button } from "@/components/ui/button"

export const Route = createFileRoute("/")({ component: App })


const scores = [
  ["Answer Accuracy", 92],
  ["Rubric Criteria", 84],
  ["Feedback Quality", 89],
  ["Review Status", 78],
]

function App() {
  return (
    <main className="min-h-svh bg-muted text-foreground">
      <header className="border-b bg-muted">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GraduationCap className="size-4" />
            </span>
            Examination Marking System
          </Link>

          <Button asChild size="sm">
            <Link to="/login">Login</Link>
          </Button>
        </nav>
      </header>

      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-16 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:py-24">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-md border bg-muted px-3 py-1.5 text-sm text-muted-foreground">
            <ShieldCheck className="size-4" />
            Structured marking for student examinations
          </div>

          <h1 className="max-w-3xl text-4xl font-semibold tracking-normal sm:text-5xl lg:text-6xl">
            Student Examination Marking System
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
            A simple platform for managing examination marking with clear
            rubrics, authenticated access, admin control, and consistent student
            assessment records.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link to="/login">
                Login to mark
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/signup">Create account</Link>
            </Button>
          </div>
        </div>

        <div id="preview" className="rounded-md border bg-card p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4 border-b pb-5">
            <div>
              <p className="text-sm text-muted-foreground">Current paper</p>
              <h2 className="mt-1 text-xl font-semibold">Final Examination</h2>
            </div>
            <div className="rounded-md bg-muted px-3 py-2 text-right">
              <p className="text-xs text-muted-foreground">Score</p>
              <p className="text-2xl font-semibold">86.4</p>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            {scores.map(([label, value]) => (
              <div key={label}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span>{label}</span>
                  <span className="font-medium">{value}%</span>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full bg-primary"
                    style={{ width: `${value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {["Answers", "Rubric", "Feedback"].map((item) => (
              <div key={item} className="rounded-md border bg-background p-3">
                {item === "Rubric" ? (
                  <ClipboardCheck className="mb-3 size-4 text-primary" />
                ) : (
                  <CheckCircle2 className="mb-3 size-4 text-primary" />
                )}
                <p className="text-sm font-medium">{item}</p>
                <p className="mt-1 text-xs text-muted-foreground">Reviewed</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
