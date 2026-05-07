import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/apps/test')({
    component: RouteComponent,
})

function RouteComponent() {
    return <div>Hello "/apps/test"!</div>
}
