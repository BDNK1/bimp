import {drizzle} from "drizzle-orm/postgres-js";
import 'dotenv/config';
import postgres from "postgres";
import * as schema from "./schema";

const databaseUrl = process.env.DATABASE_URL!;

console.log('db url is ', databaseUrl);
export const db = drizzle(postgres(databaseUrl), {
    schema,
    logger: true
});

