import { useSelector } from 'react-redux';

const useUser = () => {
  const { activeUser } = useSelector((state: any) => state.user);

  const isAdmin = activeUser?.role === 'admin';

  return { activeUser, isAdmin };
};

export default useUser;
