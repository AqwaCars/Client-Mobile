import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
// import { process.env.EXPO_PUBLIC_SERVER_IP } from "../env";
import AsyncStorage from "@react-native-async-storage/async-storage";


const initialState = {
  data: {},
  loggedIn: false,
  status: "idle",
  error: null,
  reporter: {},
  oneUser: [{}],
  emailForget:"",
  passwordUser:""

};

const fetchUser = createAsyncThunk("user/fetchUser", async (token) => {
  try {
    const response = await axios.post(
      `http://${process.env.EXPO_PUBLIC_SERVER_IP}:5000/api/users/token`,
      {
        token: token,
      }
    );

    return response.data;
  } catch (err) {
    console.error(err);
  }
});

export const autoLogin = createAsyncThunk(
  "user/autoLogin",
  async (test, thunkAPI) => {
    try {
      const token = await AsyncStorage.getItem("UserToken");
      const response = await axios.post(
        `http://${process.env.EXPO_PUBLIC_SERVER_IP}:5000/api/users/reniewToken`,
        { token: token }
      );
      await AsyncStorage.setItem("UserToken", response.data);
      // const decoded = thunkAPI.dispatch(fetchUser(response.data));
      thunkAPI.dispatch(fetchUser(response.data));
    } catch (err) {
      console.error(err);
    }
  }
);

// import AsyncStorage from '@react-native-async-storage/async-storage';
export const MakeReport = createAsyncThunk(
  "user/createReport",
  async (inputForm) => {
    try {
      const task = await axios.post(
        `http://${process.env.EXPO_PUBLIC_SERVER_IP}:5000/api/report/create`,
        inputForm
      );
      return task.data;
    } catch (error) {
      console.error(JSON.stringify(error));
    }
  }
);
// export const SignUpClick = createAsyncThunk(
//   "user/SignUps",
//   async (data, thunkAPI) => {
//      try {
//       console.log("jiheeed",data);
//        const task = await axios.post(
//          `http://${process.env.EXPO_PUBLIC_SERVER_IP}:5000/api/users/SignUpUser`,
//          {
//            userName: data.userDetails.name,
//            phoneNumber: data.userDetails.phone,
//            password: data.userDetails.password,
//            email: data.userDetails.email,
//            dateOfBirth: data.userDetails.dateOfBirth,
//            selfie: data.picDetail.selfie,
//            drivingLicenseFront: data.picDetail.license,
//            drivingLicenseBack: data.picDetail.backLicense,
//            passport: data.picDetail.passport
//          }
//        );
 
//        const response = await axios.post(
//          `http://${process.env.EXPO_PUBLIC_SERVER_IP}:5000/api/users/emailLogin`,
//          {
//            email: data.userDetails.email,
//            password: data.userDetails.password,
//          }
//        );
 
//        // Dispatch fetchUser action with the response data
//        thunkAPI.dispatch(fetchUser(response.data));
 
//        // Store the token in a more secure storage
//        try {
//          await AsyncStorage.setItem("UserToken", JSON.stringify(response.data));
//        } catch (e) {
//          console.error(JSON.stringify(e));
//          return thunkAPI.rejectWithValue(e);
//        }
 
//        return task.data;
//      } catch (er) {
//        console.error("error coming from sign function", JSON.stringify(er));
//        return thunkAPI.rejectWithValue(er);
//      }
//   }
//  );
export const logUserOut = createAsyncThunk("user/logout", async () => {
  try {
    await AsyncStorage.removeItem("UserToken");
    // console.log("UserToken removed");
  } catch (e) {
    console.error("error coming from home", e);
  }
});
export const handleToken = createAsyncThunk("user/handleToken", async () => {
  try {
    const token = await AsyncStorage.getItem("UserToken");
    const UserData = await axios.post(
      `http://${process.env.EXPO_PUBLIC_SERVER_IP}:5000/api/users/token`,
      token
    );
    return UserData.data;
  } catch (er) {
    console.error(er);
  }
});
export const getOneById = createAsyncThunk("user/getOneById", async (id) => {
  try {
    const res = await axios.get(
      `http://${process.env.EXPO_PUBLIC_SERVER_IP}:5000/api/users/getOne/${id}`
    );

    return res.data;
  } catch (error) {
    console.log(error);
  }
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    saveEmailForgot:(state,action)=>{
      state.emailForget=action.payload
    },
    savePasswordUser:(state,action)=>{
      state.passwordUser=action.payload
    },
    // Add a logout action that resets the user state
    logoutUser: (state) => {
      state.status = "idle";
      state.data = null;
      state.loggedIn = false;
      state.error = null;
    },
    setUser: (state, action) => {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
        state.loggedIn = true;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(logUserOut.fulfilled, (state) => {
        state.loggedIn = false;
      })
      .addCase(handleToken.fulfilled, (state, action) => {
        state.reporter = action.payload;
      })
      .addCase(getOneById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOneById.fulfilled, (state, action) => {
        state.loading = false;
        state.oneUser = action.payload;
      })
      .addCase(getOneById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(autoLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(autoLogin.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(autoLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default userSlice.reducer;
export const selectUser = (state) => state.user.data;
export const logStatus = (state) => state.user.loggedIn;

export const OneUserbid = (state) => state.agency.oneUser;
export { fetchUser };
export const { logoutUser, setUser, saveEmailForgot,savePasswordUser} = userSlice.actions;
