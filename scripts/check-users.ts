
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const users = await prisma.user.findMany({
        include: {
            profilePage: true
        }
    })

    console.log('--- ALL USERS ---')
    users.forEach(u => {
        console.log(`ID: ${u.id}`)
        console.log(`Email: ${u.email}`)
        console.log(`Name: ${u.name}`)
        console.log(`Role: ${u.role}`)
        console.log(`Plan: ${u.planType}`)
        if (u.profilePage) {
            console.log(`Profile Username: ${u.profilePage.username}`)
        } else {
            console.log(`No Profile Page.`)
        }
        console.log('---')
    })
}

main()
    .finally(async () => {
        await prisma.$disconnect()
    })
