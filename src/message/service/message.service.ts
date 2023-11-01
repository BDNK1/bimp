import {Message} from "../domain/message";
import {
    countFromDb,
    findAllFromDb,
    findByIdFromDb,
    saveFileMessageToDb,
    saveTextMessageToDb
} from "../repository/message.repository";
import * as fs from 'fs';
import * as path from 'path';
import {MultipartFile} from "@fastify/multipart";
import 'dotenv/config';
import {ApiError} from "../../common/error/api.error";

export async function createTextMessage(message: Message): Promise<Message> {
    return saveTextMessageToDb(message)
        .catch((error) => {
                console.error(error);
                throw new ApiError("Failed to save message");
            }
        )
}

export async function createFileMessage(file: MultipartFile, authorId: number): Promise<Message> {
    const filePath = await saveUploadedFile(file)
        .catch((error) => {
            console.error(error);
            throw new ApiError("Failed to save file");
        });

    return saveFileMessageToDb({
        authorId: authorId,
        fileName: file.filename,
        filePath: filePath,
    }).catch((error) => {
        console.log(error);
        throw new ApiError("Failed to save message");
    })
}

export async function find(id: number): Promise<Message> {
    return findByIdFromDb(id)
        .catch((error) => {
            console.error(error);
            throw new ApiError("Failed to find message");
        })
}

export async function findAll(page: number, size: number): Promise<Message[]> {
    return findAllFromDb(page, size)
        .catch((error) => {
            console.error(error);
            throw new ApiError("Failed to find messages");
        })
}

export async function count(): Promise<number> {
    return countFromDb().catch((error) => {
        console.error(error);
        throw new ApiError("Failed to count messages");
    });
}

export async function getFileStream(message: Message): Promise<fs.ReadStream | undefined> {
    if (fs.existsSync(message.filePath!)) {
        const readStream = fs.createReadStream(message.filePath!);
        readStream.on('error', error => {
            console.error("There was an error reading the file: ", error);
            throw new ApiError('An error occurred while reading the file');
        });
        return readStream;
    }
}

async function saveUploadedFile(file: MultipartFile): Promise<string> {
    const filename = `${Date.now()}-${file.filename}`;
    const directory = path.join(process.env.FILE_STORAGE_PATH!);

    if (!fs.existsSync(directory)) {
        await fs.promises.mkdir(directory);
    }
    const targetPath = path.join(directory, filename);

    fs.writeFileSync(targetPath, await file.toBuffer())
    console.log(`File saved at: ${targetPath}`);
    return targetPath;
}
