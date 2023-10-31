import Fastify, {FastifyInstance} from "fastify";

import {migrate} from "drizzle-orm/postgres-js/migrator";
import {db} from "./common/db/db.config";
import {accountApi} from "./account/api/account.api";
import {messageApi} from "./message/api/message.api";
import {Account} from "./account/domain/account";
import {setupBasicAuth} from "./common/config/security.config";
import {setupSwagger} from "./common/config/swagger.config";
import multipart from "@fastify/multipart";
import {setupExceptionHandler} from "./common/error/exception.handler";

declare module "fastify" {
    interface FastifyRequest {
        account: Account;
    }
}

export async function bootstrap() {

    await migrate(db, {
        migrationsFolder: 'db-changelog',
    })
    const app = Fastify({
        logger: true,
        bodyLimit: 1048576 * 100,
        ajv: {
            plugins: [require('@fastify/multipart').ajvFilePlugin]
        }
    })

    app.register(multipart, {
        attachFieldsToBody: true,
    });

    setupExceptionHandler(app);
    setupBasicAuth(app);
    await setupSwagger(app);
    await registerPlugins(app);

    await app.listen({
        port: 3000,
        host: '0.0.0.0'
    })

    return app;
}

async function registerPlugins(app: FastifyInstance) {
    await app.register(accountApi, {prefix: "/api/account"});
    await app.register(messageApi, {prefix: "/api/message"});
}

bootstrap().then(app => {
    console.log("App started")
});
