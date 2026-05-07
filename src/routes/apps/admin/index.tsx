import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/apps/admin/")({
  beforeLoad: ({ context }) => {
    if (context.session.user.role !== "admin") {
      throw redirect({
        to: "/apps",
        replace: true,
      })
    }
  },
  component: AdminPage,
})

function AdminPage() {
  return (
    <section>
      <div className="rounded-md border bg-background p-5">
        <p className="text-sm text-muted-foreground">Admin</p>
        <h2 className="mt-2 text-xl font-semibold">Admin dashboard</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          This page is only available to users with the admin role.
        </p>
      </div>
    </section>
  )
}
