import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type UiState = {
  orderFilter: string;
  revenueRange: "today" | "7d" | "30d" | "lifetime";
  consultMode: "book" | "rx";
};

const initialState: UiState = { orderFilter: "all", revenueRange: "7d", consultMode: "book" };

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setOrderFilter(state, action: PayloadAction<string>) {
      state.orderFilter = action.payload;
    },
    setRevenueRange(state, action: PayloadAction<UiState["revenueRange"]>) {
      state.revenueRange = action.payload;
    },
    setConsultMode(state, action: PayloadAction<UiState["consultMode"]>) {
      state.consultMode = action.payload;
    },
  },
});

export const { setOrderFilter, setRevenueRange, setConsultMode } = uiSlice.actions;
export const uiReducer = uiSlice.reducer;
