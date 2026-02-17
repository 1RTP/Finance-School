import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import eventsReducer from "./features/events/eventsSlice";
import participantsReducer from "./features/participants/participantsSlice";
import themeReducer from "./features/theme/themeSlice";
import analyticsReducer from "./features/analytics/analyticsSlice";

const participantsPersistConfig = {
  key: "participants",
  storage,
};

const analyticsPersistConfig = {
  key: "analytics",
  storage,
};

const persistedParticipantsReducer = persistReducer(participantsPersistConfig, participantsReducer);
const persistedAnalyticsReducer = persistReducer(analyticsPersistConfig, analyticsReducer);

const store = configureStore({
  reducer: {
    events: eventsReducer,
    participants: persistedParticipantsReducer,
    theme: themeReducer,
    analytics: persistedAnalyticsReducer,
  },
});

export const persistor = persistStore(store);
export default store;
