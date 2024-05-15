import { createSlice} from "@reduxjs/toolkit";



const initialState = {
    room:{},
}


const chatSlice = createSlice({
    name: 'chat',
    initialState: initialState,
    reducers: {
        setRoom: (state, action) =>{
            state.room = action.payload;
        }
    }
})

export default chatSlice.reducer;
export const { setRoom  } = chatSlice.actions;