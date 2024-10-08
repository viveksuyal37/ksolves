import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const rootApiSlice = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000/api/' }),
  endpoints: () => ({}),
  tagTypes: ['users', 'events', 'event', 'allEvents'],
});
