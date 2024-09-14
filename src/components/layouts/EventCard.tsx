import useUser from '@/app/hooks/useUser';
import { useUpdateRsvpStatusMutation } from '@/redux/apiSlice/eventSlice';
import { formatDate } from 'date-fns';
import { Check, MapPin, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

const EventCard = ({
  event,
  type = 'unknown',
}: {
  event: any;
  type?: string;
}) => {
  const { activeUser } = useUser();
  const [map] = useUpdateRsvpStatusMutation();
  const { push } = useRouter();

  const handleEventStatus = async (e: string) => {
    if (!e) return;
    try {
      await map({
        userIds: [Number(activeUser?.id)],
        eventId: String(event.id),
        status: e,
        userId: activeUser?.id,
      }).unwrap();
      toast.success('Event status updated successfully');
    } catch (error) {
      console.log({ error });
      toast.error(error?.data?.error ?? 'Something went wrong');
    }
  };

  return (
    <div
      onClick={() => {
        type !== 'user' ? push(`/events/${event.id}`) : undefined;
      }}
      className="border border-gray-300 rounded-md p-2 flex flex-col gap-2 w-[300px] hover:scale-95 transition-all duration-300 ease-in-out"
    >
      <h2 className="font-bold text-lg">{event.name}</h2>
      <p>{event.description}</p>
      <div className="flex items-center gap-2">
        <MapPin />
        <p>{event.location}</p>
      </div>
      <p className="self-end">
        {formatDate(new Date(event.date), 'dd/MM/yyyy')}
      </p>
      {type === 'user' && (
        <>
          <div className="flex items-center gap-2">
            <p>Status: {event.attendees[event.attendees.length - 1].status}</p>
          </div>

          {event.attendees[event.attendees.length - 1].status === 'pending' && (
            <div className="flex flex-col gap-2">
              Are you attending this event?
              <div className="self-end flex gap-3">
                <Check
                  onClick={() => handleEventStatus('accepted')}
                  className="text-green-500"
                />
                <X
                  onClick={() => handleEventStatus('declined')}
                  className="text-red-500"
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
export default EventCard;
