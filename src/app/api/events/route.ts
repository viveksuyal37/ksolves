import prisma from '@/db/db';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId');

  try {
    const targetUser = await prisma.user.findUnique({
      where: {
        id: Number(userId),
      },
    });

    //ideally we should check through jwt via auth middleware
    if (!targetUser || !userId) {
      return Response.json({ error: 'Bad request' }, { status: 400 });
    }

    const events = await prisma.event.findMany({
      where: {
        attendees: {
          some: {
            userId: Number(userId),
          },
        },
      },
      include: {
        attendees: {
          where: {
            userId: Number(userId),
          },
          select: {
            status: true,
          },
        },
      },
    });

    return Response.json({ events });
  } catch (error) {
    console.log({ error });
    return Response.json(
      { error: 'An error occurred while fetching events' },
      { status: 500 },
    );
  }
}
