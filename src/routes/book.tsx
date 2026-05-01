import { useState } from "react"
import { Link, createFileRoute, useRouter } from "@tanstack/react-router"
import { useServerFn } from "@tanstack/react-start"
import { BookOpen, Pencil, Plus, Save, Trash2, X } from "lucide-react"
import type { ComponentProps } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  createBook,
  deleteBook,
  getBooks,
  updateBook,
} from "@/db/books.functions"

type BookFormState = {
  title: string
  author: string
  isbn: string
}

type FormSubmitHandler = NonNullable<ComponentProps<"form">["onSubmit"]>

const emptyBookForm: BookFormState = {
  title: "",
  author: "",
  isbn: "",
}

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
  const router = useRouter()
  const books = Route.useLoaderData()
  const createBookFn = useServerFn(createBook)
  const updateBookFn = useServerFn(updateBook)
  const deleteBookFn = useServerFn(deleteBook)
  const [form, setForm] = useState<BookFormState>(emptyBookForm)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const isEditing = editingId !== null

  function updateField(field: keyof BookFormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function resetForm() {
    setForm(emptyBookForm)
    setEditingId(null)
    setError(null)
  }

  async function refreshBooks() {
    await router.invalidate({ sync: true })
  }

  const handleSubmit: FormSubmitHandler = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      if (isEditing) {
        await updateBookFn({ data: { id: editingId, ...form } })
      } else {
        await createBookFn({ data: form })
      }

      resetForm()
      await refreshBooks()
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Could not save the book."
      )
    } finally {
      setSubmitting(false)
    }
  }

  function handleEdit(book: (typeof books)[number]) {
    setForm({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
    })
    setEditingId(book.id)
    setError(null)
  }

  async function handleDelete(book: (typeof books)[number]) {
    const confirmed = window.confirm(`Delete "${book.title}"?`)

    if (!confirmed) {
      return
    }

    setDeletingId(book.id)
    setError(null)

    try {
      await deleteBookFn({ data: { id: book.id } })

      if (editingId === book.id) {
        resetForm()
      }

      await refreshBooks()
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Could not delete the book."
      )
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <main className="min-h-svh bg-muted px-6 py-10 text-foreground">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col justify-between gap-4 border-b pb-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm text-muted-foreground">Library records</p>
            <h1 className="mt-1 text-3xl font-semibold">Books</h1>
          </div>
          <Link
            to="/"
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Back to home
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
          <div className="rounded-md border bg-card p-5 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
                {isEditing ? (
                  <Pencil className="size-4" />
                ) : (
                  <Plus className="size-4" />
                )}
              </span>
              <div>
                <h2 className="text-lg font-semibold">
                  {isEditing ? "Edit book" : "Add book"}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {isEditing
                    ? "Update the selected record."
                    : "Create a new book record."}
                </p>
              </div>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(event) => updateField("title", event.target.value)}
                  placeholder="Clean Code"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  value={form.author}
                  onChange={(event) =>
                    updateField("author", event.target.value)
                  }
                  placeholder="Robert C. Martin"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="isbn">ISBN</Label>
                <Input
                  id="isbn"
                  value={form.isbn}
                  onChange={(event) => updateField("isbn", event.target.value)}
                  placeholder="9780132350884"
                  required
                />
              </div>

              {error ? (
                <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {error}
                </p>
              ) : null}

              <div className="flex gap-2 pt-1">
                <Button type="submit" className="flex-1" disabled={submitting}>
                  {isEditing ? (
                    <Save className="size-4" />
                  ) : (
                    <Plus className="size-4" />
                  )}
                  {submitting ? "Saving..." : isEditing ? "Save" : "Add"}
                </Button>

                {isEditing ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={resetForm}
                    aria-label="Cancel edit"
                    disabled={submitting}
                  >
                    <X className="size-4" />
                  </Button>
                ) : null}
              </div>
            </form>
          </div>

          <div className="overflow-hidden rounded-md border bg-card shadow-sm">
            <div className="flex items-center justify-between gap-4 border-b px-5 py-4">
              <div>
                <h2 className="text-lg font-semibold">Book list</h2>
                <p className="text-sm text-muted-foreground">
                  {books.length} {books.length === 1 ? "record" : "records"}
                </p>
              </div>
              <BookOpen className="size-5 text-muted-foreground" />
            </div>

            {books.length === 0 ? (
              <div className="p-6">
                <h3 className="text-base font-semibold">No books found</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Add your first book using the form.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-190 text-left text-sm">
                  <thead className="border-b bg-muted/60 text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3 font-medium">ID</th>
                      <th className="px-4 py-3 font-medium">Title</th>
                      <th className="px-4 py-3 font-medium">Author</th>
                      <th className="px-4 py-3 font-medium">ISBN</th>
                      <th className="px-4 py-3 text-right font-medium">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {books.map((book) => (
                      <tr
                        key={book.id}
                        className="border-b last:border-0 hover:bg-muted/40"
                      >
                        <td className="px-4 py-3 text-muted-foreground">
                          {book.id}
                        </td>
                        <td className="px-4 py-3 font-medium">{book.title}</td>
                        <td className="px-4 py-3">{book.author}</td>
                        <td className="px-4 py-3 font-mono text-xs">
                          {book.isbn}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="icon-sm"
                              onClick={() => handleEdit(book)}
                              aria-label={`Edit ${book.title}`}
                            >
                              <Pencil className="size-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon-sm"
                              onClick={() => handleDelete(book)}
                              aria-label={`Delete ${book.title}`}
                              disabled={deletingId === book.id}
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
