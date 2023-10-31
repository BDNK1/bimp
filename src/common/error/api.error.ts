export class ApiError extends Error {

    error: boolean = true;

    constructor(message: string) {
        super(message);
    }
}
