import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

const eventsAdapter = createEntityAdapter({
  selectId: (event) => event.id,
  sortComparer: (a, b) => a.date.localeCompare(b.date),
});

const eventsSlice = createSlice({
  name: 'events',
  initialState: eventsAdapter.getInitialState({ loading: false, error: null,}),
  reducers: {
    addEvent: eventsAdapter.addOne,
    addEvents: eventsAdapter.addMany,
    updateEvent: eventsAdapter.updateOne,
    removeEvent: eventsAdapter.removeOne,
    clearEvents: eventsAdapter.removeAll,
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
