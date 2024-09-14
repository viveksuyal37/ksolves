import prisma from '@/db/db';
import { createUserSchema } from '@/types/api/zodSchemas';
import { Prisma } from '@prisma/client';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const data = await request.json();

  const { success, error, data: user } = createUserSchema.safeParse(data);

  if (!success) {
    return Response.json({ error: error.errors[0].message }, { status: 500 });
  }

  try {
    const newUser = await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        role: user?.role ?? 'user',
      },
    });

    return Response.json({ message: 'User created successfully', newUser });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return Response.json(
        { error: 'A user with this email already exists' },
        { status: 400 },
      );
    }

    console.log({ error });
    return Response.json(
      { error: 'An error occurred while creating user' },
      { status: 500 },
    );
  }
}
