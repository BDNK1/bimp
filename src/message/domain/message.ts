export class Message{
    id?: number;
    text?: string | null;
    filePath?: string | null;
    fileName?: string | null;
    createdAt?: Date;
    authorId: number;

constructor(id: number, text: string, filePath: string, createdAt: Date, authorId: number){
        this.id = id;
        this.text = text;
        this.filePath = filePath;
        this.createdAt = createdAt;
        this.authorId = authorId;
    }
}
