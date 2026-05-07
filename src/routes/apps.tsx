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

import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
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
    <SidebarProvider>
      <AppSidebar session={session} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-6"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Build Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
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
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  )
}
