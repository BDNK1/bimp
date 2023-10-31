import {FastifyInstance} from "fastify";
import FastifySwagger from "@fastify/swagger";

export async function setupSwagger(app: FastifyInstance) {
    await app.register(FastifySwagger, {
        openapi: {
            info: {
                title: 'Chat API',
                description: 'Chat API',
                version: '0.1.0'
            },
            servers: [
                {url: 'http://localhost:3000', description: 'Local'},
            ],
            tags: [
                {name: 'account', description: 'Account API'},
                {name: 'message', description: 'Message API'},
            ],
            components: {
                securitySchemes: {
                    basicAuth: {
                        type: 'http',
                        scheme: 'basic',
                    },
                },
            },
        },
    })


    await app.register(require('@fastify/swagger-ui'), {
        routePrefix: '/documentation',
    })
}
