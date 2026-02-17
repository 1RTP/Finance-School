import EventCard from "../components/EventCard";

function EventList({ events }) 
{
  if (events.length === 0) { return <p className="empty">Подій не знайдено</p>; }

  return (
    <div className="event-list">
      {events.map(event => ( <EventCard key={event.id} {...event} /> ))}
    </div>
  );
}

export default EventList;
