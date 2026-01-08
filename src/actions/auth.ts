"use server";

import { prisma } from "@/lib/prisma";
import { signIn } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { registerSchema, loginSchema } from "@/lib/validations";
import { AuthError } from "next-auth";

export async function register(formData: FormData) {
    const rawData = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        username: formData.get("username") as string,
    };

    const validatedData = registerSchema.safeParse(rawData);

    if (!validatedData.success) {
        return { error: validatedData.error.issues[0].message };
    }

    const { name, email, password, username } = validatedData.data;

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        return { error: "Este email já está em uso" };
    }

    // Check if username already exists
    const existingUsername = await prisma.profilePage.findUnique({
        where: { username },
    });

    if (existingUsername) {
        return { error: "Este username já está em uso" };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user and profile
    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            profilePage: {
                create: {
                    username,
                    displayName: name,
                },
            },
        },
    });

    // Sign in the user
    await signIn("credentials", {
        email,
        password,
        redirectTo: "/dashboard",
    });

    return { success: true };
}

export async function login(formData: FormData) {
    const rawData = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
    };

    const validatedData = loginSchema.safeParse(rawData);

    if (!validatedData.success) {
        return { error: validatedData.error.issues[0].message };
    }

    try {
        await signIn("credentials", {
            email: rawData.email,
            password: rawData.password,
            redirectTo: "/dashboard",
        });
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Email ou senha inválidos" };
                default:
                    return { error: "Erro ao fazer login" };
            }
        }
        throw error;
    }

    return { success: true };
}
