'use server'
import { auth, signIn } from "@/auth";
import { sendRequest } from "./api";

export async function authenticate(username: string, password: string) {
    try {
        const r = await signIn("credentials", {
            username: username,
            password: password,
            // callbackUrl: "/",
            redirect: false,
        })
        return r
    } catch (error) {
        if ((error as any).name === "InvalidEmailPasswordError") {
            return {
                error: (error as any).type,
                code: 1
            }
        }
        else if ((error as any).name === "InActiveAccountError") {
            return {
                error: (error as any).type,
                code: 2
            }
        }
        else {
            return {
                error: "Internal server error",
                code: 500
            }
        }
    }
}

export async function actionDeleteUser(userId: string) {
    const session = await auth()
    const res = await sendRequest<IBackendRes<IRequest>>({
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${session?.user.access_token}`
        },
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/${userId}`,
    })
    if (res.statusCode === 200) {
        return {
            message: "User deleted",
            errCode: 0
        }
    }
    else {
        return {
            message: "User not found",
            errCode: 1
        }
    }
}

export async function actionUpdateUser(_id: string | undefined, name: string | undefined, isActive: boolean | undefined) {
    const session = await auth()
    const res = await sendRequest<IBackendRes<IRequest>>({
        method: "PATCH",
        body: {
            _id, name, isActive
        },
        headers: {
            Authorization: `Bearer ${session?.user.access_token}`
        },
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users`,
    })
    if (res.statusCode === 200) {
        return {
            message: "User edited",
            errCode: 0
        }
    }
    else {
        return {
            message: "User not found",
            errCode: 1
        }
    }
}

export async function actionCreateUser(name: string | undefined, email: string | undefined, password: string | undefined) {
    const session = await auth()
    const res = await sendRequest<IBackendRes<IRequest>>({
        method: "POST",
        body: {
            name, email, password
        },
        headers: {
            Authorization: `Bearer ${session?.user.access_token}`
        },
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users`,
    })
    if (res.statusCode === 201) {
        return {
            message: "User created",
            errCode: 0
        }
    }
    else if (res.statusCode === 400) {
        return {
            message: "This email already exist",
            errCode: 1
        }
    }
    else {
        return {
            message: "Invalid email",
            errCode: 2
        }
    }
}