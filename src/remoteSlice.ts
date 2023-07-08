import { createSlice } from "@reduxjs/toolkit";

export const remoteSlice = createSlice({
  name: "remote",
  initialState: {
    enterCliked: 0,
    nextClicked: 0,
    prevClicked: 0,
  },
  reducers: {
    remoteEnterClicked: (state) => {
      state.enterCliked = state.enterCliked + 1;
    },
    remoteNextClicked: (state) => {
      state.nextClicked = state.nextClicked + 1;
    },
    remotePrevClicked: (state) => {
      state.prevClicked = state.prevClicked + 1;
    },
  },
});

// Action creators are generated for each case reducer function
export const { remoteEnterClicked, remoteNextClicked, remotePrevClicked } =
  remoteSlice.actions;

export default remoteSlice.reducer;
