import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import EventCard from "./EventCard";
import { fetchEventsCursor, selectEventIds, selectAllEvents, } from "../features/events/eventsSlice";

function EventsList({ search = "" }) {
  const dispatch = useDispatch();
  const allEvents = useSelector(selectAllEvents);
  const eventIds = useSelector(selectEventIds);
  const loading = useSelector((state) => state.events.loading);
  const error = useSelector((state) => state.events.error);
  const [hasMore, setHasMore] = useState(true);
  const initialLoadedRef = useRef(false);
  const lastId = eventIds.length > 0 ? eventIds[eventIds.length - 1] : null;

  const filteredIds = search.trim() ? allEvents 
    .filter((e) => e.title.toLowerCase().includes(search.toLowerCase()))
    .map((e) => e._id) : eventIds;

  const loadMore = () => {
    if (loading || !hasMore) return;
    dispatch(fetchEventsCursor({ lastId: lastId ?? undefined, limit: 5 }))
      .unwrap()
      .then((data) => {
        if (data.length < 5) setHasMore(false);
      })
      .catch(() => setHasMore(false));
  };

  useEffect(() => {
    if (initialLoadedRef.current) return;
    initialLoadedRef.current = true;

    dispatch(fetchEventsCursor({ limit: 5 }))
      .unwrap()
      .then((data) => {
        if (data.length < 5) setHasMore(false);
      })
      .catch(() => setHasMore(false));
  }, []);

  return (
    <div className="event-list">
      {filteredIds.map((id) => (
        <EventCard key={id} _id={id} />
      ))}

      {error && <p className="error">{error}</p>}

      <div style={{ textAlign: "center", marginTop: "20px" }}>
        {loading && <p>Завантаження...</p>}
        {!hasMore && !search && <p>Більше подій немає</p>}
        {hasMore && !loading && !search && (
          <button onClick={loadMore} className="main-button">
            Завантажити ще
          </button>
        )}
      </div>
    </div>
  );
}

export default EventsList;