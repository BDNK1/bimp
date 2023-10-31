import {Message} from "../domain/message";
import {db} from "../../common/db/db.config";
import {messageTable} from "../../common/db/schema";
import {desc, eq, sql} from "drizzle-orm";

export async function saveTextMessageToDb(message: Message): Promise<Message> {
    return db.insert(messageTable)
        .values({
            text: message.text,
            authorId: message.authorId,
        }).returning().then(rows => {
            const createdMessage = rows[0];
            return {
                id: createdMessage.id,
                text: createdMessage.text,
                authorId: createdMessage.authorId,
                createdAt: createdMessage.createdAt,
            };
        })
}

export async function saveFileMessageToDb(message: Message): Promise<Message> {
    return db.insert(messageTable)
        .values({
            filePath: message.filePath,
            fileName: message.fileName,
            authorId: message.authorId,
        })
        .returning()
        .then(rows => {
            const createdMessage = rows[0];
            return {
                id: createdMessage.id,
                filePath: createdMessage.filePath,
                fileName: createdMessage.fileName,
                authorId: createdMessage.authorId,
                createdAt: createdMessage.createdAt,
            };
        });
}

export async function findByIdFromDb(id: number): Promise<Message> {
    return db.select().from(messageTable)
        .where(eq(messageTable.id, id))
        .then(rows => {
            const message = rows[0];
            return {
                id: message.id,
                text: message.text,
                filePath: message.filePath,
                fileName: message.fileName,
                authorId: message.authorId,
                createdAt: message.createdAt,
            }
        });
}

export async function findAllFromDb(page: number, size: number): Promise<Message[]> {
    return db.select()
        .from(messageTable)
        .offset(size * --page)
        .limit(size)
        .orderBy(desc(messageTable.createdAt))
        .then(rows => {
            return rows.map(row => {
                return {
                    id: row.id,
                    text: row.text,
                    filePath: row.filePath,
                    fileName: row.fileName,
                    authorId: row.authorId,
                    createdAt: row.createdAt,
                }
            })
        })
}

export async function countFromDb() {
    return db.select({
        count: sql<number>`count(*)`
    })
        .from(messageTable)
        .then(count => count[0].count);
}
