import { PrismaPg } from '@prisma/adapter-pg';
import { Priority, PrismaClient, Role } from '@prisma/client';
import { hash } from 'bcrypt';
import 'dotenv/config';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminPass = await hash('123456', 10);
  const userPass = await hash('123456', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: {},
    create: {
      name: 'Скутин Илья',
      email: 'admin@test.com',
      password: adminPass,
      role: Role.ADMIN,
    },
  });

  const user = await prisma.user.upsert({
    where: { email: 'user@test.com' },
    update: {},
    create: {
      name: 'Сергей Иванов',
      email: 'user@test.com',
      password: userPass,
      role: Role.USER,
    },
  });

  await prisma.task.createMany({
    data: [
      {
        title: 'Сделать логин',
        description: 'Форма email/password',
        dueDate: new Date('2026-04-01T18:00:00.000Z'),
        isCompleted: false,
        priority: Priority.IMPORTANT,
        ownerId: admin.id,
      },
    ],
  });

  await prisma.task.createMany({
    data: [
      {
        title: 'Список задач',
        description: 'Фильтрация и сортировка',
        dueDate: new Date('2026-04-01T18:00:00.000Z'),
        isCompleted: true,
        priority: Priority.LOW,
        ownerId: user.id,
      },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
