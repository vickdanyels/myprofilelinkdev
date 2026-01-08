const { PrismaClient } = require('@prisma/client');

async function grantProAccess() {
    const prisma = new PrismaClient();

    try {
        // Find and update all users with 'victor' in their email
        const result = await prisma.user.updateMany({
            where: {
                email: {
                    contains: 'victor'
                }
            },
            data: {
                planType: 'pro'
            }
        });

        console.log('Updated users:', result.count);

        // List users to confirm
        const users = await prisma.user.findMany({
            where: {
                email: {
                    contains: 'victor'
                }
            },
            select: {
                email: true,
                username: true,
                planType: true
            }
        });

        console.log('User details:');
        users.forEach(u => {
            console.log(`  - ${u.email} (${u.username}): ${u.planType}`);
        });

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

grantProAccess();
