import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/apps/")({
  component: AppsIndexPage,
})

function AppsIndexPage() {
  return (
    <section>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="rounded-md border bg-background p-5">
          <p className="text-sm text-muted-foreground">Apps dashboard</p>
          <h2 className="mt-2 text-xl font-semibold">Welcome back</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            This page is protected by the apps layout.
          </p>
        </div>
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="aspect-video rounded-xl bg-muted/50" />
          <div className="aspect-video rounded-xl bg-muted/50" />
          <div className="aspect-video rounded-xl bg-muted/50" />
        </div>
        <div className="min-h-screen flex-1 rounded-xl bg-muted/50 md:min-h-min" />
      </div>

    </section>
  )
}
