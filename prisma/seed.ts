import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const seed = async () => {
  await prisma.event.createMany({
    data: [
      {
        name: 'Event 1',
        description: 'This is the first event',
        date: new Date().toISOString(),
        location: 'Earth',
      },
      {
        name: 'Event 2',
        description: 'This is the second event',
        date: new Date().toISOString(),
        location: 'Jupiter',
      },
      {
        name: 'Event 3',
        description: 'This is the third event',
        date: new Date().toISOString(),
        location: 'Mercury',
      },
    ],
  });

  console.log('Events seeded successfully');
};

seed().catch(error => {
  console.error(error);
  prisma.$disconnect();
  process.exit(1);
});
