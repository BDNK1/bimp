import {ApiError} from "./api.error";
import {FastifyInstance} from "fastify";

export function setupExceptionHandler(app: FastifyInstance) {
    app.setErrorHandler(function (error, request, reply) {
        console.log(error)
        if (error instanceof ApiError) {
            reply.status(500).send({error: true, message: error.message})
        }
        reply.status(500).send({error: true, message: 'Something went wrong'})
    })
}
