"use server";

import { prisma } from "@/lib/prisma";

export async function runDiagnostics() {
    console.log("--- RUNNING SERVER DIAGNOSTICS ---");

    const diagnostics = {
        timestamp: new Date().toISOString(),
        env: {
            NODE_ENV: process.env.NODE_ENV,
            NEXTAUTH_URL: process.env.NEXTAUTH_URL ? "Set" : "MISSING",
            AUTH_SECRET: process.env.AUTH_SECRET ? "Set" : "MISSING",
            NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? "Set" : "MISSING",
            AUTH_TRUST_HOST: process.env.AUTH_TRUST_HOST,
            DATABASE_URL: process.env.DATABASE_URL ? "Set" : "MISSING",
        },
        db: {
            status: "unknown",
            message: "",
        }
    };

    try {
        // Test DB Connection
        await prisma.$queryRaw`SELECT 1`;
        diagnostics.db.status = "connected";
        diagnostics.db.message = "Database connection successful";
    } catch (error: any) {
        diagnostics.db.status = "error";
        diagnostics.db.message = error.message;
        console.error("DB Diagnostic Error:", error);
    }

    console.log("--- DIAGNOSTICS COMPLETE ---", diagnostics);
    return diagnostics;
}
