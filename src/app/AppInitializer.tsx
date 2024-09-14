'use client';

import { useGetUserQuery } from '@/redux/apiSlice/userSlice';
import { addUser } from '@/redux/userSlice';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

const AppInitializer = ({ children }: { children: ReactNode }) => {
  //@ts-ignore

  const [user, setUser] = useState<null | Record<string, any>>(null);
  console.log({ user });

  const {
    data,
    isFetching: isUserLoading,
    isSuccess,
    isError,
  } = useGetUserQuery({ userId: user?.id }, { skip: user === null });

  const [isLoading, setIsLoading] = useState(true);
  const { push } = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isSuccess && data?.user?.id) {
      (pathname === '/register' || pathname === '/') && push('/events');
      dispatch(addUser(data.user));
    }
    if (isError) push('/register');
  }, [isUserLoading]);

  useEffect(() => {
    const temp = sessionStorage.getItem('user');
    if (temp) {
      setUser(JSON.parse(temp));
    } else {
      push('/register');
    }
    setIsLoading(false);
  }, []);

  if (isLoading || isUserLoading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};
export default AppInitializer;
