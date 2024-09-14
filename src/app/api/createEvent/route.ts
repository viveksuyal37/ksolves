import prisma from '@/db/db';
import { createEventSchema } from '@/types/api/zodSchemas';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const data = await request.json();

  const { success, error, data: event } = createEventSchema.safeParse(data);

  if (!success) {
    return Response.json({ error: error.errors[0].message }, { status: 500 });
  }

  try {
    const targetUser = await prisma.user.findUnique({
      where: {
        id: Number(event.userId),
      },
    });

    //ideally we should check through jwt via auth middleware
    if (!targetUser || targetUser.role !== 'admin') {
      return Response.json({ error: 'Bad request' }, { status: 400 });
    }

    const newEvent = await prisma.event.create({
      data: {
        name: event.name,
        description: event.description,
        date: new Date(event.date),
        location: event.location,
      },
    });

    return Response.json({ message: 'Event created successfully', newEvent });
  } catch (error) {
    console.log({ error });
    return Response.json(
      { error: 'An error occurred while creating event' },
      { status: 500 },
    );
  }
}
