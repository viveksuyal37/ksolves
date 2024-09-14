'use client';

import { useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import Providers from './Providers';

const AppInitializer = ({ children }: { children: ReactNode }) => {
  //@ts-ignore
  const [user, setUser] = useState<null | Record<string, any>>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { push } = useRouter();

  useEffect(() => {
    const temp = localStorage.getItem('user');
    if (temp) {
      setUser(JSON.parse(temp));
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <Providers>{children}</Providers>;
};
export default AppInitializer;
