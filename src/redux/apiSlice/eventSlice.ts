import { CreateEvent } from '@/types/api/zodSchemas';
import { rootApiSlice } from './rootSlice';

const eventApi = rootApiSlice.injectEndpoints({
  endpoints: builder => ({
    createNewEvent: builder.mutation<any, CreateEvent>({
      query: body => ({
        url: 'event',
        method: 'POST',
        body,
      }),
    }),
    deleteEvent: builder.mutation<any, { userId: string; eventId: string }>({
      query: params => ({
        url: 'event',
        method: 'DELETE',
        params,
      }),
      invalidatesTags: ['events', 'allEvents'],
    }),
    getAllUserEvents: builder.query<any, { userId: string }>({
      query: params => ({
        url: 'events',
        method: 'GET',
        params,
      }),
      providesTags: ['events'],
    }),
    getAllEvents: builder.query<any, { userId: string }>({
      query: body => ({
        url: 'getAllEvents',
        method: 'POST',
        body,
      }),
      providesTags: ['allEvents'],
    }),
    getEventById: builder.query<any, { eventId: string }>({
      query: params => ({
        url: 'event',
        method: 'GET',
        params,
      }),
      providesTags: ['event'],
    }),
    mapUsersToEvent: builder.mutation<
      any,
      { userIds: number[]; eventId: string; status?: string; userId: string }
    >({
      query: body => ({
        url: 'event/userMapping',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['event', 'events', 'allEvents'],
    }),
    updateRsvpStatus: builder.mutation<
      any,
      { userIds: number[]; eventId: string; status?: string; userId: string }
    >({
      query: body => ({
        url: 'event/updateRSVP',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['event', 'events', 'allEvents'],
    }),
  }),
});

export const {
  useCreateNewEventMutation,
  useGetAllUserEventsQuery,
  useGetAllEventsQuery,
  useGetEventByIdQuery,
  useMapUsersToEventMutation,
  useDeleteEventMutation,
  useUpdateRsvpStatusMutation,
} = eventApi;
