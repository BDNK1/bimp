import {Account} from "../domain/account";
import {create, findAccountByEmail} from "../repository/account.repository";
import bcrypt from "bcrypt";
import {ApiError} from "../../common/error/api.error";

export async function createAccount(account: Account): Promise<Account> {
    account.password = await hash(account.password);
    return create(account).catch((error: any) => {
        console.log("Error when creating account", error);
        throw new ApiError('Failed to create user');
    });
}

export async function authenticate(email: string, password: string): Promise<Account> {
    const account = await findAccountByEmail(email);
    const result = await bcrypt.compare(password, account.password);
    if (result) {
        return account;
    } else {
        throw new ApiError("Invalid credentials");
    }
}

async function hash(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
}
