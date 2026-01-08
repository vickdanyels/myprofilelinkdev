import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email("Email inválido"),
    password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

export const registerSchema = z.object({
    name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
    email: z.string().email("Email inválido"),
    password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
    username: z
        .string()
        .min(3, "Username deve ter no mínimo 3 caracteres")
        .max(30, "Username deve ter no máximo 30 caracteres")
        .regex(
            /^[a-zA-Z0-9_-]+$/,
            "Username pode conter apenas letras, números, _ e -"
        ),
});

export const profileSchema = z.object({
    displayName: z.string().min(1, "Nome é obrigatório").max(30, "Nome deve ter no máximo 30 caracteres"),
    bio: z.string().max(160, "Bio deve ter no máximo 160 caracteres").optional(),
    avatarUrl: z.string().optional().or(z.literal("")),
    buttonSize: z.enum(["micro", "small", "regular", "large"]).default("regular").optional(),
    linksLayout: z.enum(["list", "grid", "carousel"]).default("list").optional(),
    removeBranding: z.boolean().default(false).optional(),
    displayPlanFrame: z.boolean().default(false).optional(),
});

export const linkSchema = z.object({
    title: z.string().min(1, "Título é obrigatório").max(50),
    url: z.string().url("URL inválida"),
    icon: z.string().optional(),
    isEnabled: z.boolean().default(true),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type LinkInput = z.infer<typeof linkSchema>;
