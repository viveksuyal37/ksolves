import prisma from '@/db/db';
import { RSVPStatus } from '@prisma/client';

async function assignUsersToEvent(
  userIds: number[],
  eventId: number,
  status: RSVPStatus = 'pending',
) {
  console.log({ userIds, eventId, status });

  try {
    const rsvps = await prisma.rSVP.createMany({
      data: userIds?.map(userId => ({
        userId: Number(userId),
        eventId: Number(eventId),
        status: status,
      })),
      skipDuplicates: true,
    });

    console.log('Users successfully assigned to event:', rsvps);
    return rsvps;
  } catch (error) {
    console.error('Error assigning users to event:', error);
    throw new Error('Failed to assign users to event');
  }
}

export async function POST(request: Request) {
  const data = await request.json();
  console.log({ data });

  const { userIds, eventId, status, userId } = data;

  try {
    const targetUser = await prisma.user.findUnique({
      where: {
        id: Number(userId),
      },
    });
    if (
      !targetUser ||
      (targetUser.role !== 'admin' &&
        userIds.length > 1 &&
        !userIds.includes(targetUser.id))
    ) {
      return Response.json({ error: 'Bad request' }, { status: 400 });
    }

    const rsvps = await assignUsersToEvent(
      userIds,
      eventId,
      status ?? 'pending',
    );

    return Response.json({
      message: 'users successfully mapped to event',
      rsvps,
    });
  } catch (error: any) {
    console.log({ error });
    return Response.json(
      { error: 'An error occurred while mapping events' },
      { status: 500 },
    );
  }
}
