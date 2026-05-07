import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { getRequestHeaders } from "@tanstack/react-start/server"
import { LogOut } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { signOut } from "@/lib/auth-client"

const getCurrentSession = createServerFn({ method: "GET" }).handler(
  async () => {
    const { auth } = await import("@/lib/auth")

    return auth.api.getSession({
      headers: getRequestHeaders(),
    })
  }
)

export const Route = createFileRoute("/apps/")({
  loader: async () => {
    const session = await getCurrentSession()

    if (!session) {
      throw redirect({
        to: "/login",
        replace: true,
      })
    }

    return session
  },
  component: AppsPage,
})

function AppsPage() {
  const navigate = useNavigate()
  const { user } = Route.useLoaderData()
  const [isSigningOut, setIsSigningOut] = useState(false)

  async function handleLogout() {
    setIsSigningOut(true)

    try {
      await signOut()
      await navigate({ to: "/login", replace: true })
    } finally {
      setIsSigningOut(false)
    }
  }

  return (
    <main className="min-h-svh bg-muted px-6 py-8 text-foreground">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 border-b pb-5">
        <div>
          <p className="text-sm text-muted-foreground">Signed in as</p>
          <h1 className="mt-1 text-2xl font-semibold">{user.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={handleLogout}
          disabled={isSigningOut}
        >
          <LogOut className="size-4" />
          {isSigningOut ? "Logging out..." : "Logout"}
        </Button>
      </div>
    </main>
  )
}
