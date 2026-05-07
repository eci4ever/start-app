import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/apps/")({
  component: AppsIndexPage,
})

function AppsIndexPage() {
  return (
    <section>
      <div className="rounded-md border bg-background p-5">
        <p className="text-sm text-muted-foreground">Apps dashboard</p>
        <h2 className="mt-2 text-xl font-semibold">Welcome back</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          This page is protected by the apps layout.
        </p>
      </div>
    </section>
  )
}
