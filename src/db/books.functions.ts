import { createServerFn } from "@tanstack/react-start"
import { asc, eq } from "drizzle-orm"
import { z } from "zod"

import { db } from "@/db"
import { bookTable } from "@/db/schema"

const bookIdSchema = z
  .number()
  .int("A valid book ID is required.")
  .positive("A valid book ID is required.")

const bookInputSchema = z.object({
  title: z.string().trim().min(1, "Title is required."),
  author: z.string().trim().min(1, "Author is required."),
  isbn: z.string().trim().min(1, "ISBN is required."),
})

const updateBookInputSchema = bookInputSchema.extend({
  id: bookIdSchema,
})

const deleteBookInputSchema = z.object({
  id: bookIdSchema,
})

export const getBooks = createServerFn({ method: "GET" }).handler(async () => {
  return db.select().from(bookTable).orderBy(asc(bookTable.id))
})

export const createBook = createServerFn({ method: "POST" })
  .inputValidator(bookInputSchema)
  .handler(async ({ data }) => {
    const [book] = await db.insert(bookTable).values(data).returning()

    return book
  })

export const updateBook = createServerFn({ method: "POST" })
  .inputValidator(updateBookInputSchema)
  .handler(async ({ data }) => {
    await db
      .update(bookTable)
      .set({
        title: data.title,
        author: data.author,
        isbn: data.isbn,
      })
      .where(eq(bookTable.id, data.id))

    return { id: data.id }
  })

export const deleteBook = createServerFn({ method: "POST" })
  .inputValidator(deleteBookInputSchema)
  .handler(async ({ data }) => {
    await db.delete(bookTable).where(eq(bookTable.id, data.id))

    return { id: data.id }
  })
