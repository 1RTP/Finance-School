import { createSlice, createAsyncThunk, createEntityAdapter } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const participantsAdapter = createEntityAdapter();
const initialState = participantsAdapter.getInitialState({ loading: false, error: null,});

export const fetchParticipants = createAsyncThunk(
  "participants/fetchParticipants",
  async (eventId) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const now = new Date().toISOString();
        const fakeParticipants = [
          { id: `${eventId}-1`, fullName: "Test1", email: "test1@gmail.com", eventId, createdAt: now },
          { id: `${eventId}-2`, fullName: "Test2", email: "test2@gmail.com", eventId, createdAt: now },
          { id: `${eventId}-3`, fullName: "Test3", email: "test3@gmail.com", eventId, createdAt: now },
          { id: `${eventId}-4`, fullName: "Test4", email: "test4@gmail.com", eventId, createdAt: now },
          { id: `${eventId}-5`, fullName: "Test5", email: "test5@gmail.com", eventId, createdAt: now },
          { id: `${eventId}-6`, fullName: "Test6", email: "test6@gmail.com", eventId, createdAt: now },
        ];

        if (Math.random() > 0.1) {
          resolve(fakeParticipants);
        } else {
          reject(new Error("Помилка при завантаженні учасників"));
        }
      }, 1500);
    });
  }
);

const participantsSlice = createSlice({
  name: "participants",
  initialState,
  reducers: {
    addParticipant: (state, action) => {
      const participant = {
        ...action.payload,
        createdAt: action.payload.createdAt || new Date().toISOString(),
      };
      participantsAdapter.addOne(state, participant);
      toast.success("Учасник успішно доданий!");
    },
    removeParticipant: (state, action) => {
      participantsAdapter.removeOne(state, action.payload);
      toast.info("Учасник видалений.");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchParticipants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchParticipants.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        participantsAdapter.upsertMany(state, action.payload);
        toast.success("Учасники завантажені успішно!");
      })
      .addCase(fetchParticipants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        toast.error("Помилка при завантаженні учасників!");
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

export const { addParticipant, removeParticipant } = participantsSlice.actions;
export default participantsSlice.reducer;
