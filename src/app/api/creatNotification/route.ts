import prisma from '@/db/db';
import { createNotificationSchema } from '@/types/api/zodSchemas';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const data = await request.json();

  const {
    success,
    error,
    data: event,
  } = createNotificationSchema.safeParse(data);

  if (!success) {
    return Response.json({ error: error.errors[0].message }, { status: 500 });
  }

  try {
    const targetEvent = await prisma.event.findUnique({
      where: {
        id: Number(event.eventId),
      },
    });

    if (!targetEvent) {
      return Response.json({ error: 'Event not found' }, { status: 404 });
    }

    const newNotification = await prisma.notification.create({
      data: {
        message: event.message,
        eventId: Number(event.eventId),
      },
    });

    return Response.json({
      message: 'Notification created successfully',
      newNotification,
    });
  } catch (error) {
    console.log({ error });
    return Response.json(
      { error: 'An error occurred while creating notification' },
      { status: 500 },
    );
  }
}
