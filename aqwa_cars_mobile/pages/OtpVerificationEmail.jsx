import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import React, { useState, useRef,useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather, SimpleLineIcons } from '@expo/vector-icons';
const { width, height } = Dimensions.get("screen");
import axios from "axios"
import appConfig from "../appConfig";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";
import { saveEmailForgot,savePasswordUser } from "../store/userSlice";
import {LoginContext} from "../context/AuthContext.jsx"

const OtpVerificationFromEmail = () => {
  const navigation = useNavigation();
  const codeInputRefs = useRef([]);
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [codeError, setCodeError] = useState("");
  // const [email, setEmail] = useState("makhloufaymen.fr@gmail.com");
  const [loading, setLoading] = useState(false); 
  const { logindata, setLoginData } = useContext(LoginContext);

  const dispatch = useDispatch();

  const userEmail = (value) => {
    dispatch(saveEmailForgot(value));
  };
  const userPassword = (value) => {
    dispatch(savePasswordUser(value));
  };
  const email = useSelector((state) => state.user?.emailForget);
  const password = useSelector((state) => state.user?.passwordUser);
  const submitLogin = async () => {
    if ( email && password) {
      setLoading(true);
      try {
        const response = await axios.post(
          `http://${process.env.EXPO_PUBLIC_SERVER_IP}:5000/api/users/emailLogin`,
          {
            email: email,
            password: password,
          }
        );
  
        if (response.status === 200 && response.data.result && response.data.result.id) {
          const { id, token } = response.data.result;
         await userEmail("")
          await userPassword("")
  
          await AsyncStorage.setItem("userId", id.toString());
          await AsyncStorage.setItem("token", token);
          await setLoginData(true)
        await  navigation.navigate("NewHome");
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: 'Welcome, you are successfully logged in',
          });
        }
      } catch (error) {
        if (error.response) {
          if (error.response.status === 422) {
            Toast.show({
              type: 'error',
              text1: 'Error',
              text2: 'Invalid email or password',
            });
          } else if (error.response.status === 404) {
            Toast.show({
              type: 'error',
              text1: 'Error',
              text2: 'User not found',
            });
          } else if (error.response.status === 403 && error.response.data.error === "Account not verified. Please verify your email address") {
            Toast.show({
              type: 'error',
              text1: 'Error',
              text2: 'Account not verified. Please verify your email address',
            });
            await userEmail(email)

            await otpVerifSend()
            await navigation.navigate("OtpVerification");

          } else if (error.response.status === 403) {
            Toast.show({
              type: 'error',
              text1: 'Error',
              text2: 'Account is blocked or archived',
            });
          } else if (error.response.status === 500) {
            Toast.show({
              type: 'error',
              text1: 'Error',
              text2: 'Internal server error',
            });
          }
        } else {
          console.error("Error logging in:", error);
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'An error occurred, please try again later',
          });
        }
      } finally {
        setLoading(false);
      }
    } else {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter a valid email and password',
      });
    }
  };
  const handleCodeChange = async (text, index) => {
      const newCode = [...code];
      newCode[index] = text;
      setCode(newCode);
  
      const isCodeComplete = newCode.every((item) => item !== "");
      if (isCodeComplete) {
        const enteredCode = newCode.join("");
  
        try {
          setLoading(true);
          const response = await axios.post(
            `http://${process.env.EXPO_PUBLIC_SERVER_IP}:5000/api/users/verificationAccount`,
            {
              email,
              otpCode: enteredCode,
            }
          );
  
          if (response.status === 200) {
            console.log("Your code is correct ");
            setCode(["", "", "", "", "", ""]);
            codeInputRefs.current[0]?.focus();
            userEmail("")
            Toast.show({
              type: 'success',
              text1: 'Success',
              text2: 'Your email is verified ',
            });
            await submitLogin()
        
          }
        } catch (error) {
          if (error.response) {
            if (error.response.status === 404) {
              console.log("User not found");
              setCode(["", "", "", "", "", ""]);
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'User not found',
              });
              codeInputRefs.current[0]?.focus();
            } else if (error.response.status === 400) {
              console.log("Incorrect OTP code");
              setCode(["", "", "", "", "", ""]);
              codeInputRefs.current[0]?.focus();
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Incorrect OTP code',
              });
            }
          }
        } finally {
          setLoading(false);
        }
      } else if (text !== "") {
        codeInputRefs.current[index + 1]?.focus();
      }
    }

  const otpVerifSend = async () => {
    if (email) {
      try {
        setLoading(true); 
        const response = await axios.post(
          `http://${process.env.EXPO_PUBLIC_SERVER_IP}:5000/api/users/sendVerificationEmail`,
          { email }
        );

        if (response.status === 200) {
          console.log("Successfully OTP Verified")
          setCode(["", "", "", "", "", ""]);
          codeInputRefs.current[0]?.focus();
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: 'Code sent successfully',
          });
        }
      } catch (error) {
        if (error.response) {
          if (error.response.status === 404) {
            console.log("User not found");
            Toast.show({
              type: 'error',
              text1: 'Error',
              text2: 'User not found',
            });
          } else if (error.response.status === 500) {
            console.log("Failed to send email");
            Toast.show({
              type: 'error',
              text1: 'Error',
              text2: 'Failed to send email',
            });
          } else {
            console.log("Other error:", error);
          }
        } else {
          console.error("Network error:", error);
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Network error',
          });
        }
      } finally {
        setLoading(false); 
      }
    } else {
      console.log("Please enter a valid email");
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter a valid email',
      });
    }
  };

  return (
    <View>
      <LinearGradient
        locations={[0.2, 1]}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
        colors={["#321947", "#000000"]}
      >
        <ScrollView
          contentContainerStyle={styles.ScrollContainer}
          keyboardShouldPersistTaps="always"
        >
          <View
            style={{
              alignItems: "center",
              justifyContent: "space-evenly",
              height,
            }}
          >
            <View
              style={{
                height: height * 0.2,
              }}
            >
              <Image
                style={styles.img}
                source={require("../assets/aqwaWhite.png")}
              />
            </View>
            <View
              style={{
                height: height * 0.4,
              }}
            >
              <View style={styles.container}>
                <View style={styles.titleContainer}>
                  <Text style={styles.title}>Verify your account</Text>
                </View>
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoText}>
                    We've sent you a 6-digit code to your email.
                  </Text>
                </View>
                <View>
                  <View style={styles.codeInputContainer}>
                    {code.map((code, index) => (
                      <TextInput
                        key={index}
                        ref={(ref) => (codeInputRefs.current[index] = ref)}
                        style={styles.codeInput}
                        keyboardType="numeric"
                        maxLength={1}
                        value={code}
                        onChangeText={(text) => handleCodeChange(text, index)}
                      />
                    ))}
                  </View>
                  {codeError ? (
                    <Text style={styles.errorText}>{codeError}</Text>
                  ) : null}
                </View>
                <View style={styles.bigResendContainer}>
                  <TouchableOpacity style={styles.resendContainer} onPress={otpVerifSend}>
                    <Text style={styles.resendCodeText}>Have you not received the verification code?</Text>
                    <View style={styles.resendBtnContainer}>
                      <Text style={styles.resendText}>Resend</Text>
                      <Feather name="refresh-cw" size={13} color="gray" />
                    </View>
                  </TouchableOpacity>
                  <View style={styles.resendContainer}>
                    <TouchableOpacity style={styles.resendBtnContainer} onPress={()=>navigation.navigate("NewHome")}>
                      <Text style={styles.resendTextOne}>Press here to return to the home page</Text>
                      <SimpleLineIcons name="home" size={10} color="white" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
        {loading && ( 
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="white" />
        </View>
      )}
      </LinearGradient>
    </View>
  );
};

export default OtpVerificationFromEmail;

const styles = StyleSheet.create({
  ScrollContainer: {
    height,
    alignItems: "center",
    flexGrow: 1,
  },
  img: {
    height: height * 0.2,
    width: width,
  },
  container: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  title: {
    paddingBottom: 20,
    fontSize: 28,
    fontWeight: "bold",
    color: "white"
  },
  infoText: {
    paddingBottom: 20,
    paddingLeft: 8,
    paddingRight: 4,
    fontSize: 12,
    color: "gray",
    fontStyle: "italic",
  },
  resendBtnContainer:{
    justifyContent: "center",
    alignItems: "center",
    flexDirection:"row",
    gap:5
  },
  codeInputContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: -13,
  },
  codeInput: {
    borderBottomWidth: 2,
    borderBottomColor: "white",
    marginHorizontal: 5,
    width: 40,
    textAlign: "center",
    fontSize: 16,
    color:"white"
  },
  errorText: {
    color: "red",
    paddingLeft: "37%",
  },
  bigResendContainer:{
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 30,
    gap:170,
    width:"100%"
  },
  resendContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingRight: 10,
  },
  resendCodeText:{
    color: "gray",
  },
  resendText: {
    color: "gray",
    paddingLeft: 5,
  },
  resendTextOne: {
      color: "white",
      paddingLeft: 5,
      textDecorationLine: "underline",
      fontSize: 10,
      fontWeight: "400",
    },
    loader: {
      position: "absolute",
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
});
