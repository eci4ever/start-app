import { createFileRoute, redirect } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { getRequestHeaders } from "@tanstack/react-start/server"

const listUsers = createServerFn({ method: "GET" }).handler(async () => {
    const { auth } = await import("@/lib/auth")

    return auth.api.listUsers({
        headers: getRequestHeaders(),
        query: {
            limit: 100,
            sortBy: "createdAt",
            sortDirection: "desc",
        },
    })
})

export const Route = createFileRoute("/apps/admin/")({
    beforeLoad: ({ context }) => {
        if (context.session.user.role !== "admin") {
            throw redirect({
                to: "/apps",
                replace: true,
            })
        }
    },
    loader: () => listUsers(),
    component: AdminPage,
})

function AdminPage() {
    const { users, total } = Route.useLoaderData()

    return (
        <section>
            <div className="rounded-md border bg-background p-5">
                <p className="text-sm text-muted-foreground">Admin</p>
                <div className="mt-2 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
                    <div>
                        <h2 className="text-xl font-semibold">Users</h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {total} total user{total === 1 ? "" : "s"}
                        </p>
                    </div>
                </div>

                <div className="mt-5 overflow-x-auto">
                    <table className="w-full min-w-180 text-left text-sm">
                        <thead className="border-b text-muted-foreground">
                            <tr>
                                <th className="py-3 pr-4 font-medium">Name</th>
                                <th className="py-3 pr-4 font-medium">Email</th>
                                <th className="py-3 pr-4 font-medium">Role</th>
                                <th className="py-3 pr-4 font-medium">Status</th>
                                <th className="py-3 font-medium">Created</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className="border-b last:border-0">
                                    <td className="py-3 pr-4 font-medium">{user.name}</td>
                                    <td className="py-3 pr-4 text-muted-foreground">
                                        {user.email}
                                    </td>
                                    <td className="py-3 pr-4">{user.role || "user"}</td>
                                    <td className="py-3 pr-4">
                                        {user.banned ? "Banned" : "Active"}
                                    </td>
                                    <td className="py-3 text-muted-foreground">
                                        {formatDate(user.createdAt)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    )
}

function formatDate(value: Date | string) {
    return new Intl.DateTimeFormat("en", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(value))
}
