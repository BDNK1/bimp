import {db} from "../../common/db/db.config";
import {accountTable} from "../../common/db/schema";
import {Account} from "../domain/account";
import {eq} from "drizzle-orm";

export async function create(account: Account): Promise<Account> {
    return db.insert(accountTable)
        .values({
            name: account.name,
            email: account.email,
            password: account.password
        })
        .returning()
        .execute()
        .then(created => {
            const createdAccount = created[0];
            return new Account(createdAccount.id, createdAccount.name, createdAccount.email, createdAccount.password)
        });
}

export async function findAccountByEmail(email: string): Promise<Account> {
    return db.select()
        .from(accountTable)
        .where(eq(accountTable.email, email))
        .execute()
        .then(accounts => {
            const account = accounts[0];
            return new Account(account.id, account.name, account.email, account.password);
        });
}
