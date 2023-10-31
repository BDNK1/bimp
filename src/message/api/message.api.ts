import {FastifyInstance} from "fastify";
import {
    createFileMessageController,
    createTextMessageController,
    getAllMessagesController,
    getMessageController
} from "./message.controller";
import {
    createFileMessageJsonSchema,
    CreateTextMessageBody,
    createTextMessageJsonSchema,
    getMessageJsonSchema,
    listAllMessagesJsonSchema,
    PaginationQuery
} from "./message.dto";
import {MultipartFile} from "@fastify/multipart";

export async function messageApi(app: FastifyInstance) {

    app.post<{ Body: CreateTextMessageBody }>(
        '/text',
        {
            schema: createTextMessageJsonSchema,
            preHandler: app.basicAuth
        },
        createTextMessageController
    )

    app.post<{ Body: { file: MultipartFile } }>(
        '/file',
        {
            schema: createFileMessageJsonSchema,
            preHandler: app.basicAuth
        },
        createFileMessageController
    )

    app.get<{ Querystring: PaginationQuery }>(
        '/list',
        {
            schema: listAllMessagesJsonSchema,
            preHandler: app.basicAuth
        },
        getAllMessagesController
    )

    app.get<{ Params: { id: number } }>(
        '/:id/content',
        {
            schema: getMessageJsonSchema,
            preHandler: app.basicAuth
        },
        getMessageController)
}
