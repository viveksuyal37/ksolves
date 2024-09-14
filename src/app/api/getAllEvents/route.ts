import prisma from '@/db/db';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const data = await request.json();

  try {
    const targetUser = await prisma.user.findUnique({
      where: {
        id: Number(data.userId),
      },
    });

    //ideally we should check through jwt via auth middleware
    if (!targetUser || targetUser.role !== 'admin') {
      return Response.json({ error: 'Bad request' }, { status: 400 });
    }

    const allEvents = await prisma.event.findMany({});

    return Response.json({ allEvents });
  } catch (error) {
    console.log({ error });
    return Response.json(
      { error: 'An error occurred while getting events' },
      { status: 500 },
    );
  }
}
