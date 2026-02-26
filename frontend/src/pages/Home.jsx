import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Header from "./Header";
import EventList from "./EventList";
import { fetchEvents } from "../features/events/eventsSlice";
import { makeSelectFilteredEvents } from "../features/events/eventsSelectors";
import SkeletonEventCard from "../components/SkeletonEventCard";

function Home() {
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const selectFilteredEvents = makeSelectFilteredEvents();
  
  const filteredEvents = useSelector((state) =>
    selectFilteredEvents(state, search)
  );

  const loading = useSelector((state) => state.events.loading);
  const error = useSelector((state) => state.events.error);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

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
