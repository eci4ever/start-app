import { createServerFn } from "@tanstack/react-start"
import { asc } from "drizzle-orm"

import { db } from "@/db"
import { bookTable } from "@/db/schema"

export const getBooks = createServerFn({ method: "GET" }).handler(async () => {
  return db.select().from(bookTable).orderBy(asc(bookTable.id))
})
