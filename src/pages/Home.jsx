import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Header from "./Header";
import EventList from "./EventList";
import { selectAllEvents, addEvents } from "../features/events/eventsSlice";
import eventsData from "../data/events";
import SkeletonEventCard from "../components/SkeletonEventCard";

function Home() {
  const dispatch = useDispatch();
  const events = useSelector(selectAllEvents);
  const loading = useSelector((state) => state.events.loading);
  const error = useSelector((state) => state.events.error);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (events.length === 0) {
      dispatch(addEvents(eventsData));
    }
  }, [dispatch, events.length]);

  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="home">
      <Header search={search} setSearch={setSearch} />

      {loading && (
        <div className="event-list">
          <SkeletonEventCard />
          <SkeletonEventCard />
          <SkeletonEventCard />
        </div>
      )}

      {error && <p className="error">{error}</p>}

      {!loading && !error && <EventList events={filteredEvents} />}
    </div>
  );
}

export default Home;
