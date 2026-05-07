import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/apps/admin/')({
    component: RouteComponent,
})

function RouteComponent() {
    return <div>Hello "/apps/admin/"!</div>
}
