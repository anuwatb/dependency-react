import { pgTable, varchar } from "drizzle-orm/pg-core";

export const projects = pgTable('projects', {
    id: varchar('id', { length: 255 }).primaryKey(),
    ownerId: varchar('ownerId', { length: 255 }).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    database: varchar('database', { length: 255 }).notNull(),
});