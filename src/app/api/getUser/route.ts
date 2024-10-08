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

    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }
    return Response.json({ message: 'User created successfully', user });
  } catch (error) {
    console.log({ error });
    return Response.json(
      { error: 'An error occurred while creating user' },
      { status: 500 },
    );
  }
}
