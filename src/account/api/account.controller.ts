import {AccountDto, CreateAccountBody} from "./account.dto";
import {FastifyRequest} from "fastify";
import {createAccount} from "../service/account.service";

export async function createAccountController(request: FastifyRequest<{
    Body: CreateAccountBody
}>): Promise<AccountDto> {
    const account = await createAccount(request.body);
    return {
        id: account.id!,
        name: account.name,
        email: account.email
    };
}
