import {
  Outlet,
  createFileRoute,
  redirect,
  useNavigate,
} from "@tanstack/react-router"
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

export const Route = createFileRoute("/apps")({
  beforeLoad: async () => {
    const session = await getCurrentSession()

    if (!session) {
      throw redirect({
        to: "/login",
        replace: true,
      })
    }

    return { session }
  },
  component: AppsLayout,
})

function AppsLayout() {
  const navigate = useNavigate()
  const { session } = Route.useRouteContext()
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
    <main className="min-h-svh bg-muted text-foreground">
      <header className="border-b bg-background">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-5">
          <div>
            {session.user.name} <span className="text-muted-foreground">| {session.user.email}</span>
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
      </header>

      <div className="mx-auto max-w-5xl px-6 py-8">
        <Outlet />
      </div>
    </main>
  )
}
