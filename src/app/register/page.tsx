'use client';

import { useCreateNewUserMutation } from '@/redux/apiSlice/userSlice';
import { addUser } from '@/redux/userSlice';
import { createUserSchema } from '@/types/api/zodSchemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

const Page = () => {
  const [createUser, { isLoading: isCreating, isSuccess }] =
    useCreateNewUserMutation();

  const dispatch = useDispatch();
  const { push } = useRouter();

  const { register, handleSubmit } = useForm({
    resolver: zodResolver(createUserSchema),
  });

  const onSubmit: SubmitHandler<any> = async data => {
    try {
      const response = await createUser(data).unwrap();
      toast.success(response?.message ?? 'User created successfully');
      sessionStorage.setItem('user', JSON.stringify(response.newUser));
      dispatch(addUser(response.newUser));
      push('/events');
    } catch (error: any) {
      toast.error(error?.data?.error ?? 'Something went wrong');
    }
  };

  return (
    <main className="flex-grow w-full h-full flex items-center justify-center">
      <div className="w-[50vw] border border-black rounded-lg p-4 flex flex-col gap-4">
        <h1 className="text-3xl font-bold">Register</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 child:flex child:items-center child:gap-2"
        >
          <div>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              {...register('name', { required: true })}
              placeholder="your name"
              className="w-full bg-gray-300 rounded-lg p-2"
            />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              {...register('email', { required: true })}
              className="w-full bg-gray-300 rounded-lg p-2"
              placeholder="your email"
            />
          </div>
          <div>
            <label htmlFor="role">Role</label>
            <select
              {...register('role')}
              className="w-full bg-gray-300 rounded-lg p-2"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button
            disabled={isCreating}
            className="mx-auto disabled:opacity-35 mt-2 bg-black text-white rounded-md p-2"
          >
            Register
          </button>
        </form>
      </div>
    </main>
  );
};

export default Page;
