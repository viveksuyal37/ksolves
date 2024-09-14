'use client';

import useUser from '@/app/hooks/useUser';
import {
  useDeleteEventMutation,
  useGetEventByIdQuery,
  useMapUsersToEventMutation,
} from '@/redux/apiSlice/eventSlice';
import { useGetAllUsersQuery } from '@/redux/apiSlice/userSlice';
import { formatDate } from 'date-fns';
import { MapPin } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';

const Page = () => {
  const { eId } = useParams();

  const { data, isLoading, isError } = useGetEventByIdQuery({
    eventId: eId as string,
  });

  const [isOpen, setIsOpen] = useState(false);

  const { push } = useRouter();

  const { activeUser, isAdmin } = useUser();

  const [remove] = useDeleteEventMutation();

  if (isLoading) return <div>Loading...</div>;

  if (isError) return <div>Error occured while fetching event</div>;

  if (!activeUser || !isAdmin) {
    return <div>You are not authorized to view this event</div>;
  }

  const { event } = data;

  const handleEventDelete = async () => {
    try {
      const response = await remove({
        userId: activeUser?.id,
        eventId: event.id,
      }).unwrap();
      toast.success(response?.message);
      push('/events');
    } catch (error: any) {
      console.log({ error });
      toast.error(error?.data?.error ?? 'Something went wrong');
    }
  };

  if (!event) return <div>Event not found</div>;

  return (
    <div className="m-3 flex flex-col gap-5">
      <div>
        <h2 className="font-bold text-lg">{event.name}</h2>
        <p>{event.description}</p>
        <div className="flex items-center gap-2">
          <MapPin />
          <p>{event.location}</p>
        </div>
        <p className="self-end">
          {formatDate(new Date(event.date), 'dd/MM/yyyy')}
        </p>
      </div>

      <div className="max-h-[50vh] grid grid-cols-6 gap-3 overflow-y-auto">
        {event.attendees.length ? (
          event.attendees.map((attendee: any) => (
            <div key={attendee.id}>
              <h3>{attendee.User.name}</h3>
              <p>RSVP Status: {attendee.status}</p>
            </div>
          ))
        ) : (
          <div>This event has no attendee yet.</div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsOpen(true)}
          className="self-start bg-black p-2 rounded-sm text-white"
        >
          Manage Attendees
        </button>

        <button
          onClick={handleEventDelete}
          className="self-start bg-red-500 p-2 rounded-sm text-white"
        >
          Delete Event
        </button>
      </div>
      {isOpen && (
        <ManageAttendeesModal
          attendees={event.attendees}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};
export default Page;

const ManageAttendeesModal = ({
  onClose,
  attendees,
}: {
  onClose: () => void;
  attendees: any[];
}) => {
  const { activeUser, isAdmin } = useUser();
  const { data, isFetching } = useGetAllUsersQuery(
    { userId: activeUser?.id },
    { skip: !isAdmin },
  );

  const eventId = useParams().eId;

  const [map] = useMapUsersToEventMutation();

  const [checkedUsers, setCheckedUsers] = useState<number[]>(
    attendees?.length ? attendees.map(attendee => attendee.User.id) : [],
  );

  const isChanged =
    JSON.stringify(attendees.map(attendee => attendee.User.id)) ===
    JSON.stringify(checkedUsers);

  const handleCheckboxChange = (userId: number) => {
    setCheckedUsers(prevCheckedUsers => {
      if (prevCheckedUsers.includes(userId)) {
        return prevCheckedUsers.filter(id => id !== userId);
      } else {
        return [...prevCheckedUsers, userId];
      }
    });
  };

  const handleSave = async () => {
    if (!checkedUsers.length) {
      return toast.error('Please select at least one user');
    }

    try {
      const response = await map({
        userIds: checkedUsers,
        eventId: String(eventId),
        userId: activeUser?.id,
      }).unwrap();

      toast.success(response?.message);
      onClose();
    } catch (error: any) {
      console.log({ error });
      toast.error(error?.data?.error ?? 'Something went wrong');
    }
  };

  return (
    <div className="w-screen h-screen bg-black/50 z-10 fixed inset-0 flex items-center justify-center">
      <div className="bg-white rounded-lg p-4 flex flex-col gap-4">
        <h1 className="text-3xl font-bold">Manage Attendees</h1>
        <div className="max-h-[40vh] overflow-y-auto flex flex-col gap-3">
          {data?.allUsers?.map((user: any) => (
            <label key={user.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                value={user.id}
                checked={checkedUsers.includes(user.id)}
                onChange={() => handleCheckboxChange(user.id)}
              />
              {user.email}
            </label>
          ))}
        </div>

        <button
          disabled={isChanged}
          onClick={handleSave}
          className="bg-black disabled:opacity-35 text-white rounded-md p-2"
        >
          Save Changes
        </button>
        <button
          onClick={onClose}
          className="bg-black text-white rounded-md p-2"
        >
          Close
        </button>
      </div>
    </div>
  );
};
