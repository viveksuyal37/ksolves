import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  role: z.enum(['user', 'admin']).optional(),
});

export type CreateUser = z.infer<typeof createUserSchema>;

export const createEventSchema = z.object({
  name: z.string(),
  description: z.string(),
  date: z.string(),
  location: z.string(),
  userId: z.string(),
});

export type CreateEvent = z.infer<typeof createEventSchema>;

export const createNotificationSchema = z.object({
  message: z.string(),
  eventId: z.string(),
});

export const createRSVPSchema = z.object({
  userId: z.string(),
  eventId: z.string(),
});
