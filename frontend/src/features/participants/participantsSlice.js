import { createSlice, createAsyncThunk, createEntityAdapter } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const participantsAdapter = createEntityAdapter({ selectId: (participant) => participant._id,});
const initialState = participantsAdapter.getInitialState({ loading: false, error: null, });

export const fetchParticipants = createAsyncThunk(
  "participants/fetchParticipants",
  async (eventId) => {
    const res = await fetch(`http://localhost:3000/api/participants/${eventId}`);
    if (!res.ok) throw new Error("Не вдалося завантажити учасників");
    return await res.json();
  }
);

// cursor
export const fetchParticipantsCursor = createAsyncThunk(
  "participants/fetchParticipantsCursor",
  async ({ eventId, lastId, limit = 5 }) => {
    const url = lastId
      ? `http://localhost:3000/api/participants/cursor/${eventId}?lastId=${lastId}&limit=${limit}`
      : `http://localhost:3000/api/participants/cursor/${eventId}?limit=${limit}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Не вдалося завантажити учасників");
    return await res.json();
  }
);
// cursor

export const addParticipantAsync = createAsyncThunk(
  "participants/addParticipantAsync",
  async (participant) => {
    const res = await fetch("http://localhost:3000/api/participants", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(participant),
    });
    if (!res.ok) throw new Error("Не вдалося додати учасника");
    return await res.json();
  }
);

export const addFakeParticipants = createAsyncThunk(
  "participants/addFakeParticipants",
  async (eventId, { dispatch }) => {
    const now = new Date().toISOString();
    const fakeParticipants = [
      { fullName: "Test1", email: "test1@gmail.com", eventId, createdAt: now },
      { fullName: "Test2", email: "test2@gmail.com", eventId, createdAt: now },
      { fullName: "Test3", email: "test3@gmail.com", eventId, createdAt: now },
      { fullName: "Test4", email: "test4@gmail.com", eventId, createdAt: now },
      { fullName: "Test5", email: "test5@gmail.com", eventId, createdAt: now },
      { fullName: "Test6", email: "test6@gmail.com", eventId, createdAt: now },
    ];

    for (const p of fakeParticipants) {
      await dispatch(addParticipantAsync(p));
    }

    return fakeParticipants;
  }
);

const participantsSlice = createSlice({
  name: "participants",
  initialState,
  reducers: {
    clearParticipants: participantsAdapter.removeAll,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchParticipants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchParticipants.fulfilled, (state, action) => {
        state.loading = false;
        participantsAdapter.setAll(state, action.payload);
      })
      .addCase(fetchParticipants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        toast.error("Помилка при завантаженні учасників!", { toastId: "loadError" });
      })

      // cursor
      .addCase(fetchParticipantsCursor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchParticipantsCursor.fulfilled, (state, action) => {
        state.loading = false;
        participantsAdapter.addMany(state, action.payload);
      })
      .addCase(fetchParticipantsCursor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        toast.error("Помилка при завантаженні учасників (cursor)!", { toastId: "cursorError" });
      })
      // cursor
      
      .addCase(addParticipantAsync.fulfilled, (state, action) => {
        participantsAdapter.addOne(state, action.payload);
        if (action.payload.source) {
          toast.success(`Учасника ${action.payload.fullName} додано!`, { toastId: "addParticipant" });
        }
      })
      .addCase(addFakeParticipants.fulfilled, (state) => {
        toast.success("Тестові учасники додані у MongoDB!", { toastId: "fakeParticipants" });
      });
  },
});

export const {
  selectAll: selectAllParticipants,
  selectById: selectParticipantById,
} = participantsAdapter.getSelectors((state) => state.participants);

export const selectFilteredParticipants = (state, searchTerm, eventId) => {
  const all = selectAllParticipants(state).filter((p) => p.eventId === eventId);
  if (!searchTerm) return all;

  const lower = searchTerm.toLowerCase();
  return all.filter((p) => {
    const name = p.fullName ? p.fullName.toLowerCase() : "";
    const email = p.email ? p.email.toLowerCase() : "";
    return name.includes(lower) || email.includes(lower);
  });
};

export const { clearParticipants } = participantsSlice.actions;
export default participantsSlice.reducer;
