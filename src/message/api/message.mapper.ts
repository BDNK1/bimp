import {Message} from "../domain/message";

export function mapToDto(message: Message) {
    return {
        id: message.id!,
        message: message.text,
        file: message.fileName,
        authorId: message.authorId,
        createdAt: message.createdAt!,
    }
}
