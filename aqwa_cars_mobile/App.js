import { createStackNavigator } from "@react-navigation/stack";

import { NavigationContainer } from "@react-navigation/native";

import store from "./store/store";
import React,{ useContext } from "react";
import { Provider, useDispatch } from "react-redux";
import ForgotPassword from "./pages/ForgotPassword.jsx";
("DO NOT TOUCH THIS IMPORT OR CHANGE ANYTHING ABOUT IT");
import { StripeProvider } from "@stripe/stripe-react-native";
import Welcome from "./pages/Welcome.jsx";
import NewHome from "./pages/NewHome.jsx";
import NewCarDetails from "./pages/NewCarDetails.jsx";
import NewSignUp from "./pages/NewSignUp.jsx";
import NewLogIn from "./pages/NewLogIn.jsx"
import NewProfile from "./pages/NewProfile.jsx";
import TermsAndConditions from "./pages/TermsAndConditions.jsx";
import ReviewAndBook from "./pages/ReviewAndBook.jsx";
import BookingHistory from "./pages/BookingHistory.jsx";
import MyInformation from "./pages/MyInformation.jsx";
import FAQS from "./pages/FAQS.jsx";
import CarsList from "./pages/CarsList.jsx";
import OtpVerificationEmail from "./pages/OtpVerificationEmail.jsx";
import LocationModal from "./components/LocationModal.jsx";
import Emailaccount from "./pages/Emailaccount.jsx";
import OtpForgotEmail from "./pages/OtpForgotEmail.jsx"
import ChangePassword from "./pages/ChangePassword.jsx";
import Toast from 'react-native-toast-message';
import Context from "./context/AuthContext.jsx";
import ReviewSheet from "./components/ReviewSheet.jsx";
const Stack = createStackNavigator();

function App() {

  return (
    <Context>
    <Provider store={store}>
      <StripeProvider
        publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHBLE_KEY}
      >
        
        <NavigationContainer>
          <Stack.Navigator initialRouteName="NewHome">
            <Stack.Screen
              name="CarsList"
              component={CarsList}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ReviewSheet"
              component={ReviewSheet}
              options={{ headerShown: false }}
            />
             <Stack.Screen
              name="MyInformation"
              component={MyInformation}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="LocationModal"
              component={LocationModal}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ReviewAndBook"
              component={ReviewAndBook}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="FAQS"
              component={FAQS}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="NewCarDetails"
              component={NewCarDetails}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="TermsAndConditions"
              component={TermsAndConditions}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="NewProfile"
              component={NewProfile}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="BookingHistory"
              component={BookingHistory}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="newSignUp"
              component={NewSignUp}
              options={{
                headerShown: false,
                headerStatusBarHeight: 0,
              }}
            />
            <Stack.Screen
              name="newLogIn"
              component={NewLogIn}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="NewHome"
              component={NewHome}
              options={{ headerShown: false }}
            />
            {/* {(props) => <Home {...props} style={globalStyles.global} />} */}
            <Stack.Screen
              name="Welcome"
              component={Welcome}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="forgotPassword"
              component={ForgotPassword}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="OtpVerification"
              component={OtpVerificationEmail}
              options={{ headerShown: false }}
            />
              <Stack.Screen
              name="EmailAccount"
              component={Emailaccount}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="OtpForgotEmail"
              component={OtpForgotEmail}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ChangePassword"
              component={ChangePassword}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
          <Toast/>
        </NavigationContainer>
      </StripeProvider>
    </Provider>
    </Context>
  );
}

export default App;
