import { CreateEvent } from '@/types/api/zodSchemas';
import { rootApiSlice } from './rootSlice';

const eventSlice = rootApiSlice.injectEndpoints({
  endpoints: builder => ({
    createNewEvent: builder.mutation<any, CreateEvent>({
      query: body => ({
        url: 'createEvent',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useCreateNewEventMutation } = eventSlice;
