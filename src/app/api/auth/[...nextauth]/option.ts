import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { check_password } from "../hashing";
import fetchWatchMiddleware from "../../../../lib/Database/fetchWatch";
import dotenv from 'dotenv';

dotenv.config();

export const options: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                username: { label: "Username", type: "text", placeholder: "輸入帳號" },
                password: { label: "Password", type: "password", placeholder: "輸入密碼" },
            },
            async authorize(credentials) {
                if (!credentials) {
                    throw new Error("Missing credentials");
                }

                await fetchWatchMiddleware();

                const [is_login, user] = await check_password(credentials.username, credentials.password);
                console.log(is_login)
                if (is_login && user) {
                    return { id: user.username, name: user.username };
                } else {
                    return null
                }
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: true, // 啟用調試模式
};
