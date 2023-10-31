import {z} from "zod";
import {zodToJsonSchema} from "zod-to-json-schema";

const createAccountRequest = z.object({
    email: z.string().email(),
    name: z.string(),
    password: z.string().regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
        'Password must contain minimum eight characters, at least one letter and one number'),
});

const accountDto = z.object({
    id: z.number(),
    name: z.string(),
    email: z.string(),
})

export type CreateAccountBody = z.infer<typeof createAccountRequest>;
export type AccountDto = z.infer<typeof accountDto>;

export const createAccountJsonSchema = {
    tags: ['account'],
    summary: 'create new account',
    body: zodToJsonSchema(createAccountRequest),
    response: {
        200: zodToJsonSchema(accountDto)
    }
};
