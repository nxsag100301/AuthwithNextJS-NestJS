import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { InActiveAccountError, InvalidEmailPasswordError } from "./utils/error"
import { sendRequest } from "./utils/api"
import { IUser } from "./types/next-auth"

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                username: {},
                password: {},
            },
            authorize: async (credentials) => {
                const user = await sendRequest<IBackendRes<ILogin>>({
                    method: "POST",
                    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/login`,
                    body: {
                        username: credentials.username,
                        password: credentials.password
                    }
                })
                if (user.statusCode === 201) {
                    return {
                        _id: user?.data?.user?._id,
                        email: user.data?.user.email,
                        name: user.data?.user.name,
                        access_token: user?.data?.access_token
                    }
                }
                else if (user.statusCode === 401) {
                    throw new InvalidEmailPasswordError()
                }
                else if (user.statusCode === 400) {
                    throw new InActiveAccountError()
                }
                else {
                    throw new Error("Internal server error")
                }


            },
        }),
    ],
    pages: {
        signIn: "/auth/login",
    },
    callbacks: {
        jwt({ token, user }) {
            if (user) { // User is available during sign-in
                token.user = (user as IUser)
            }
            return token
        },
        session({ session, token }) {
            (session.user as IUser) = token.user
            return session
        },
        authorized: async ({ auth }) => {
            // Logged in users are authenticated, otherwise redirect to login page
            return !!auth
        },
    },

})