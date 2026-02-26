import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const defaultData = [
  { date: "2026-02-10", registrations: 5 },
  { date: "2026-02-11", registrations: 8 },
  { date: "2026-02-12", registrations: 3 },
  { date: "2026-02-13", registrations: 10 },
  { date: "2026-02-14", registrations: 6 },
  { date: "2026-02-15", registrations: 12 },
  { date: "2026-02-16", registrations: 7 },
];

export const fetchAnalyticsDataFromJson = createAsyncThunk(
  "analytics/fetchAnalyticsDataFromJson",
  async () => {
    const response = await fetch("/analytics.json");
    if (!response.ok) {
      throw new Error("Не вдалося завантажити JSON");
    }
    const data = await response.json();
    return data;
  }
);

export const fetchAnalyticsData = createAsyncThunk(
  "analytics/fetchAnalyticsData",
  async () => {
    return defaultData;
  }
);

const analyticsSlice = createSlice({
  name: "analytics",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalyticsData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnalyticsData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchAnalyticsData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(fetchAnalyticsDataFromJson.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnalyticsDataFromJson.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchAnalyticsDataFromJson.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const selectAnalyticsData = (state) => state.analytics.data;
export const selectAnalyticsLoading = (state) => state.analytics.loading;
export const selectAnalyticsError = (state) => state.analytics.error;

export default analyticsSlice.reducer;
