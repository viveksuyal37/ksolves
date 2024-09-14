import prisma from '@/db/db';
import { createRSVPSchema } from '@/types/api/zodSchemas';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const data = await request.json();

  const { success, error, data: rspv } = createRSVPSchema.safeParse(data);

  if (!success) {
    return Response.json({ error: error.errors[0].message }, { status: 500 });
  }

  try {
    const targetUser = await prisma.user.findUnique({
      where: {
        id: Number(rspv.userId),
      },
    });

    if (!targetUser || targetUser.role === 'user') {
      return Response.json({ error: 'Bad request' }, { status: 400 });
    }

    const users = await prisma.user.findMany({
      where: {
        rsvps: {
          none: {
            eventId: Number(rspv.eventId),
          },
        },
      },
    });

    // Create RSVPs for each user
    await Promise.all(
      users.map(user =>
        prisma.rSVP.create({
          data: {
            userId: user.id,
            eventId: Number(rspv.eventId),
            status: 'pending',
          },
        }),
      ),
    );

    return Response.json({
      message: 'Rsvp created successfully',
    });
  } catch (error) {
    console.log({ error });
    return Response.json(
      { error: 'An error occurred while creating rsvp' },
      { status: 500 },
    );
  }
}
