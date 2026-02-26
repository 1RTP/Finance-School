import { createSelector } from "@reduxjs/toolkit";
import { selectAllEvents } from "./eventsSlice";

export const makeSelectFilteredEvents = () =>
  createSelector(
    [selectAllEvents, (_, search) => search],
    (events, search) =>
      events.filter((event) =>
        event.title.toLowerCase().includes(search.toLowerCase())
      )
  );
