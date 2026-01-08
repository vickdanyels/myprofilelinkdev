const { PrismaClient } = require('@prisma/client');

async function checkUser() {
    const prisma = new PrismaClient();

    try {
        const users = await prisma.user.findMany({
            where: {
                email: {
                    contains: 'victor'
                }
            },
            select: {
                id: true,
                email: true,
                name: true,
                planType: true,
                createdAt: true
            }
        });

        console.log('\n=== USUÁRIOS ENCONTRADOS ===\n');
        users.forEach(u => {
            console.log(`📧 Email: ${u.email}`);
            console.log(`👤 Nome: ${u.name || 'N/A'}`);
            console.log(`💎 Plano: ${u.planType === 'pro' ? '✅ PRO' : '❌ Free'}`);
            console.log(`📅 Criado em: ${u.createdAt}`);
            console.log('---');
        });

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkUser();
