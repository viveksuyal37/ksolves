import { rootApiSlice } from './rootSlice';

import { CreateUser } from '@/types/api/zodSchemas';

const userSlice = rootApiSlice.injectEndpoints({
  endpoints: builder => ({
    getUser: builder.query({
      query: id => `user/${id}`,
    }),
    createNewUser: builder.mutation<any, CreateUser>({
      query: body => ({
        url: 'createUser',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useGetUserQuery, useCreateNewUserMutation } = userSlice;
