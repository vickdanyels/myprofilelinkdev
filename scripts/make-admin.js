const { PrismaClient } = require('@prisma/client');

async function makeAdmin() {
    const prisma = new PrismaClient();
    const email = process.argv[2];

    if (!email) {
        console.error('Please provide an email: node scripts/make-admin.js user@example.com');
        process.exit(1);
    }

    try {
        const user = await prisma.user.update({
            where: { email: email },
            data: { role: 'ADMIN' }
        });

        console.log(`✅ Success! User ${user.email} is now an ADMIN.`);
        console.log('You can now access: http://localhost:3000/admin');

    } catch (error) {
        console.error('Error:', error.message);
        console.log('User not found or database error.');
    } finally {
        await prisma.$disconnect();
    }
}

makeAdmin();
