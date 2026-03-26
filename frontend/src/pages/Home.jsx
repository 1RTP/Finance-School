import React, { useState } from "react";
import { useSelector } from "react-redux";
import Header from "./Header";
import EventsList from "../components/EventsList";
import SkeletonEventCard from "../components/SkeletonEventCard";

function Home() {
  const [search, setSearch] = useState("");

  const loading = useSelector((state) => state.events.loading);
  const error = useSelector((state) => state.events.error);
  const hasEvents = useSelector((state) => state.events.ids.length > 0);

  return (
    <div className="home">
      <Header search={search} setSearch={setSearch} />

      {loading && !hasEvents && (
        <div className="event-list">
          <SkeletonEventCard />
          <SkeletonEventCard />
          <SkeletonEventCard />
        </div>
      )}

      {error && <p className="error">{error}</p>}

      <EventsList search={search} />
    </div>
  );
}

export default Home;