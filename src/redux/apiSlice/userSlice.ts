import { rootApiSlice } from './rootSlice';

import { CreateUser } from '@/types/api/zodSchemas';

const userSlice = rootApiSlice.injectEndpoints({
  endpoints: builder => ({
    getUser: builder.query({
      query: ({ userId }) => `getUser?userId=${userId}`,
    }),
    getAllUsers: builder.query({
      query: ({ userId }) => `getAllUsers?userId=${userId}`,
      providesTags: ['users'],
    }),
    createNewUser: builder.mutation<any, CreateUser>({
      query: body => ({
        url: 'createUser',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['users'],
    }),
  }),
});

export const {
  useGetUserQuery,
  useCreateNewUserMutation,
  useGetAllUsersQuery,
} = userSlice;
