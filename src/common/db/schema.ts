import {integer, pgTable, serial, timestamp, varchar} from "drizzle-orm/pg-core";

export const accountTable = pgTable('account', {
    id: serial('id').primaryKey(),
    name: varchar('name', {length: 256}).notNull(),
    email: varchar('email', {length: 256}).unique().notNull(),
    password: varchar('password', {length: 256}).notNull(),
})

export const messageTable = pgTable('message', {
    id: serial('id').primaryKey(),
    text: varchar('text', {length: 256}),
    filePath: varchar('file_path', {length: 256}),
    fileName: varchar('file_name', {length: 256}),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
    authorId: integer('accountId').notNull().references(() => accountTable.id),
})

