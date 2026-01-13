
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Finding user by email "victor--daniel@outlook.com"...')

    const user = await prisma.user.findUnique({
        where: {
            email: 'victor--daniel@outlook.com'
        }
    })

    if (!user) {
        console.error('No user found in database.')
        return
    }

    console.log(`Found user: ${user.email} (${user.id})`)
    console.log(`Current Status - Role: ${user.role}, Plan: ${user.planType}`)

    // Update user
    const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
            role: 'ADMIN',
            planType: 'PRO',
            proExpiresAt: null, // Lifetime access
            planStartedAt: new Date()
        }
    })

    console.log('User updated successfully!')
    console.log(`New Status - Role: ${updatedUser.role}, Plan: ${updatedUser.planType}`)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
