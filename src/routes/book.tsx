import { Link, createFileRoute } from "@tanstack/react-router"

import { getBooks } from "@/db/books.functions"

export const Route = createFileRoute("/book")({
  loader: () => getBooks(),
  component: BookPage,
  pendingComponent: () => (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <p className="text-sm text-muted-foreground">Loading books...</p>
    </main>
  ),
  errorComponent: ({ error }) => (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <div className="rounded-md border border-destructive/30 bg-destructive/10 p-4">
        <h1 className="text-lg font-semibold text-destructive">
          Could not load books
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {error instanceof Error ? error.message : "Unknown database error"}
        </p>
      </div>
    </main>
  ),
})

function BookPage() {
  const books = Route.useLoaderData()

  return (
    <main className="min-h-svh bg-muted px-6 py-10 text-foreground">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-col justify-between gap-4 border-b pb-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm text-muted-foreground">Database test view</p>
            <h1 className="mt-1 text-3xl font-semibold">Books</h1>
          </div>
          <Link
            to="/"
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Back to home
          </Link>
        </div>

        {books.length === 0 ? (
          <div className="rounded-md border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold">No books found</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Add rows to the books table, then refresh this page.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-md border bg-card shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] text-left text-sm">
                <thead className="border-b bg-muted/60 text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-medium">ID</th>
                    <th className="px-4 py-3 font-medium">Title</th>
                    <th className="px-4 py-3 font-medium">Author</th>
                    <th className="px-4 py-3 font-medium">ISBN</th>
                  </tr>
                </thead>
                <tbody>
                  {books.map((book) => (
                    <tr key={book.id} className="border-b last:border-0">
                      <td className="px-4 py-3 text-muted-foreground">
                        {book.id}
                      </td>
                      <td className="px-4 py-3 font-medium">{book.title}</td>
                      <td className="px-4 py-3">{book.author}</td>
                      <td className="px-4 py-3 font-mono text-xs">
                        {book.isbn}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
