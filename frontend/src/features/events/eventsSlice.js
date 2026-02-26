import { createSlice, createEntityAdapter, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchEvents = createAsyncThunk("events/fetchEvents", async () => {
  const res = await fetch("http://localhost:3000/api/events");
  if (!res.ok) {
    throw new Error("Не вдалося завантажити події");
  }
  return await res.json();
});

const eventsAdapter = createEntityAdapter({
  selectId: (event) => event.id,
  sortComparer: (a, b) => a.date.localeCompare(b.date),
});

const eventsSlice = createSlice({
  name: "events",
  initialState: eventsAdapter.getInitialState({
    loading: false,
    error: null,
  }),
  reducers: {
    addEvent: eventsAdapter.addOne,
    addEvents: eventsAdapter.addMany,
    updateEvent: eventsAdapter.updateOne,
    removeEvent: eventsAdapter.removeOne,
    clearEvents: eventsAdapter.removeAll,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        eventsAdapter.setAll(state, action.payload);
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const {
  addEvent,
  addEvents,
  updateEvent,
  removeEvent,
  clearEvents,
} = eventsSlice.actions;

export const {
  selectAll: selectAllEvents,
  selectById: selectEventById,
  selectIds: selectEventIds,
} = eventsAdapter.getSelectors((state) => state.events);

export default eventsSlice.reducer;
