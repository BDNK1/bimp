import {FastifyReply, FastifyRequest} from "fastify";
import {CreateTextMessageBody, MessageDto, PagedMessageResponse, PaginationQuery} from "./message.dto";
import {count, createFileMessage, createTextMessage, find, findAll, getFileStream} from "../service/message.service";
import {MultipartFile} from "@fastify/multipart";
import 'dotenv/config';
import {mapToDto} from "./message.mapper";
import {lookup} from "mime-types"
import {ApiError} from "../../common/error/api.error";

export async function createTextMessageController(request: FastifyRequest<{
    Body: CreateTextMessageBody
}>): Promise<MessageDto> {
    return createTextMessage({
        text: request.body.message,
        authorId: request.account.id!,
    }).then(mapToDto);
}

export async function createFileMessageController(request: FastifyRequest<{
    Body: {
        file: MultipartFile
    }
}>): Promise<MessageDto | ApiError> {
    const file = request.body.file;
    if (file) {
        return await createFileMessage(file, request.account.id!).then(mapToDto);
    } else return new ApiError("File is required")
}

export async function getAllMessagesController(request: FastifyRequest<{
    Querystring: PaginationQuery
}>): Promise<PagedMessageResponse> {
    const totalSizePromise = count();
    const messages = await findAll(request.query.page, request.query.size);
    return {
        messages: messages.map(mapToDto),
        pagination: {
            page: request.query.page,
            size: request.query.size,
            totalSize: await totalSizePromise,
            totalPages: Math.ceil(await totalSizePromise / request.query.size)
        }
    };
}

export async function getMessageController(request: FastifyRequest<{
    Params: {
        id: number
    }
}>, reply: FastifyReply) {
    const message = await find(request.params.id);
    if (message.filePath) {
        const fileStream = await getFileStream(message);
        if (fileStream) {
            reply.header('Content-Disposition', `attachment; filename="${message.fileName}"`);
            const mimeType = lookup(message.filePath);
            if (mimeType) reply.type(mimeType);
            reply.send(fileStream);
        } else {
            return new ApiError('File does not exists');
        }
    } else {
        reply.type('text/plain')
        reply.send(message.text);
    }
    return reply;
}


