import { createSlice } from "@reduxjs/toolkit";
import { dummyListings } from "../../assets/assets";



const listingSlice = createSlice({
  name: "listing",
  initialState: {
    listings: dummyListings,
    userListings: dummyListings,
    balance: {
      earned: 0,
      withdrawn: 0,
      available: 0
    }
  },

  reducers: {
    setListings: (state, action) => {
      state.listings = action.payload;
    },
    setUserListings: (state, action) => {
      state.userListings = action.payload;
    },
    setBalance: (state, action) => {
      state.balance = action.payload;
    }
  }

})

export const { setListings, setUserListings, setBalance } = listingSlice.actions
export default listingSlice.reducer
