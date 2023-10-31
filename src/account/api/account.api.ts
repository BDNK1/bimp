import {FastifyInstance} from "fastify";
import {createAccountController} from "./account.controller";
import {createAccountJsonSchema} from "./account.dto";

export async function accountApi(app: FastifyInstance) {

    app.post('/register',
        {
            schema: createAccountJsonSchema
        },
        createAccountController,
    )
}
