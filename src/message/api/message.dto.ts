import {z} from "zod";
import {zodToJsonSchema} from "zod-to-json-schema";

const createTextMessageRequest = z.object({
    message: z.string(),
});
const MessageDto = z.object({
    id: z.number(),
    message: z.string().optional().nullable(),
    file: z.string().optional().nullable(),
    createdAt: z.date(),
    authorId: z.number(),
});

const PaginationQuery = z.object({
    size: z.number().min(1),
    page: z.number().min(1),
});

const PaginationDto = z.object({
    page: z.number(),
    size: z.number(),
    totalSize: z.number(),
    totalPages: z.number(),
});


const PagedMessageResponse = z.object({
    messages: z.array(MessageDto),
    pagination: PaginationDto
});

export type CreateTextMessageBody = z.infer<typeof createTextMessageRequest>;
export type MessageDto = z.infer<typeof MessageDto>;
export type PaginationQuery = z.infer<typeof PaginationQuery>;
export type PaginationDto = z.infer<typeof PaginationDto>;
export type PagedMessageResponse = z.infer<typeof PagedMessageResponse>;

export const createTextMessageJsonSchema = {
    tags: ['message'],
    security: [{basicAuth: []}],
    summary: 'create new text message',
    body: zodToJsonSchema(createTextMessageRequest),
    response: {
        200: zodToJsonSchema(MessageDto)
    }
};
export const listAllMessagesJsonSchema = {
    tags: ['message'],
    security: [{basicAuth: []}],
    summary: 'list all messages',
    querystring: zodToJsonSchema(PaginationQuery),
    response: {
        200: zodToJsonSchema(PagedMessageResponse)
    }
}

export const getMessageJsonSchema = {
    tags: ['message'],
    security: [{basicAuth: []}],
    summary: 'get message content',
    params: {
        type: 'object',
        properties: {
            id: {type: 'number'}
        }
    },
    response: {
        200: {
            type: 'string',
            description: 'message content'
        }
    }
}

export const createFileMessageJsonSchema = {
    tags: ['message'],
    security: [{basicAuth: []}],
    body: {
        type: 'object',
        required: ['file'],
        properties: {
            file: {isFile: true},
        },
        description: 'file to upload'
    },
    summary: 'create new file message',
    consumes: ['multipart/form-data'],
}
