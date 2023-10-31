import {FastifyInstance} from "fastify";
import basicAuth from "@fastify/basic-auth";
import {authenticate} from "../../account/service/account.service";

export function setupBasicAuth(app: FastifyInstance) {
    app.decorateRequest('account', null)
    app.register(basicAuth, {validate})

    async function validate(username: string, password: string, req: any, reply: any) {
        const account = await authenticate(username, password);
        if (account) {
            req.account = account;
        }
    }
}
