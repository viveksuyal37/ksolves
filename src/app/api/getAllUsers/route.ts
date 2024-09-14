import prisma from '@/db/db';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId');

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: Number(userId),
      },
    });

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Bad Request' }, { status: 404 });
    }

    const allUsers = await prisma.user.findMany({});

    return Response.json({ allUsers });
  } catch (error) {
    console.log({ error });
    return Response.json(
      { error: 'An error occurred while getting users' },
      { status: 500 },
    );
  }
}
