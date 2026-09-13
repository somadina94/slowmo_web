import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CHECKOUT_DEFAULTS, CheckoutDraft, skuForQty } from "../../lib/checkout";

const checkoutSlice = createSlice({
  name: "checkout",
  initialState: CHECKOUT_DEFAULTS,
  reducers: {
    patchDraft(state, action: PayloadAction<Partial<CheckoutDraft>>) {
      Object.assign(state, action.payload);
      if (action.payload.qty) {
        state.sku = skuForQty(action.payload.qty);
      }
    },
    resetDraft() {
      return { ...CHECKOUT_DEFAULTS };
    },
  },
});

export const { patchDraft, resetDraft } = checkoutSlice.actions;
export const checkoutReducer = checkoutSlice.reducer;
