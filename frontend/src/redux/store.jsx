import { configureStore } from "@reduxjs/toolkit";
import inboxReducer  from "./reducers/inboxReducer.jsx";
import sentReducer  from "./reducers/sentReducer.jsx";

const store = configureStore({
  reducer: {
    inbox: inboxReducer,
    sent: sentReducer,
  },
});

export default store;
