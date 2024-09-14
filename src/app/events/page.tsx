'use client';
import EventCard from '@/components/layouts/EventCard';
import {
  useGetAllEventsQuery,
  useGetAllUserEventsQuery,
} from '@/redux/apiSlice/eventSlice';
import useUser from '../hooks/useUser';

const Page = () => {
  const { activeUser, isAdmin } = useUser();

  const {
    data: userEvents,
    isLoading,
    isSuccess,
  } = useGetAllUserEventsQuery(
    {
      userId: activeUser?.id,
    },
    { skip: isAdmin || !activeUser },
  );

  const { data } = useGetAllEventsQuery(
    { userId: activeUser?.id },
    { skip: !isAdmin },
  );
  console.log({ data, userEvents });

  return (
    <div className="flex flex-col gap-3 m-3">
      <h1 className="font-bold text-xl">
        {isAdmin ? 'All Events' : 'Your Upcoming Events'}
      </h1>
      <div className="flex flex-wrap gap-5">
        {data?.allEvents?.map((event: any) => (
          <EventCard key={event.id} event={event} />
        ))}
        {userEvents?.events?.map((event: any) => (
          <EventCard type="user" key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
};
export default Page;
