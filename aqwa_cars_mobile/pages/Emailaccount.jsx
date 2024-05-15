import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather, SimpleLineIcons } from "@expo/vector-icons";
import axios from "axios";
import appConfig from "../appConfig";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";
import { saveEmailForgot } from "../store/userSlice";

const { width, height } = Dimensions.get("screen");

const Emailaccount = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch();

  const userEmail = () => {
    dispatch(saveEmailForgot(email));
  };

  const otpForgetSend = async () => {
    if (email && !emailError) {
      try {
        setLoading(true);
        const response = await axios.post(
          `http://${process.env.EXPO_PUBLIC_SERVER_IP}:5000/api/users/sendForgetCode`,
          { email }
        );

        if (response.status === 200) {
          userEmail();
          navigation.navigate("OtpForgotEmail");
          Toast.show({
            type: 'success',
            text1: 'Code sended',
            text2: 'Code sended, verify your email',
          });
          setEmail("");
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
            Toast.show({
              type: 'error',
              text1: 'Error',
              text2: 'Error',
            });
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

  useEffect(() => {
    validateEmail();
  }, [email]);

  const validateEmail = () => {
    const trimmedEmail = email.trim();
    const re = /^\S+@\S+\.\S+$/;
    const isValid = re.test(trimmedEmail);
    setEmail(trimmedEmail);
    setEmailError(isValid ? "" : trimmedEmail ? "Invalid email format" : "");
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
            <View style={{ height: height * 0.2 }}>
              <Image
                style={styles.img}
                source={require("../assets/aqwaWhite.png")}
              />
            </View>
            <View style={{ height: height * 0.4 }}>
              <View style={styles.container}>
                <View style={styles.titleContainer}>
                  <Text style={styles.title}>Forgot Your Password?</Text>
                </View>
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoText}>Email Address Needed</Text>
                </View>
                <View>
                  <TextInput
                    style={[
                      styles.FirstInput,
                      emailError ? styles.errorInput : null,
                    ]}
                    placeholder="Enter Your Email"
                    placeholderTextColor={"#cccccc"}
                    onChangeText={(text) => setEmail(text)}
                    keyboardType="email-address"
                    value={email}
                  />
                  {emailError ? (
                    <Text style={styles.errorText}>{emailError}</Text>
                  ) : null}
                </View>
                <View style={styles.contbtnTxt}>
                  <Pressable style={styles.btnSignIn} onPress={otpForgetSend}>
                    {loading ? (
                      <ActivityIndicator size="small" color="grey" />
                    ) : (
                      <Text style={styles.textSignIn}>Submit</Text>
                    )}
                  </Pressable>
                  <View style={styles.bigResendContainer}>
                    {/* <TouchableOpacity style={styles.resendBtnContainer}>
                      <View style={styles.resendContainer}>
                        <Text style={styles.resendCodeText}>
                          Have you not received the verification code?
                        </Text>
                        <View style={styles.contRes}>
                          <Text style={styles.resendTextOne}>Resend</Text>
                          <Feather name="refresh-cw" size={13} color="gray" />
                        </View>
                      </View>
                    </TouchableOpacity> */}
                  </View>
                </View>
                <View style={styles.resendContainer}>
                  {/* <Text style={styles.resendCodeText}>You would to try later?</Text> */}
                  <TouchableOpacity
                    style={styles.resendBtnContainer}
                    onPress={() => navigation.navigate("NewHome")}
                  >
                    <Text style={styles.resendText}>
                      Press here to return to the home page
                    </Text>
                    <SimpleLineIcons name="home" size={10} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
};

export default Emailaccount;

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
    justifyContent: "center",
    alignItems: "center",
    gap: 1,
  },
  title: {
    // paddingBottom: 5,
    fontSize: 25,
    fontWeight: "bold",
    color: "white",
  },
  FirstInput: {
    height: Dimensions.get("window").height * 0.05,
    width: width * 0.75,
    color: "white",
    marginBottom: 10,
    padding: 5,
    borderRadius: 5,
    borderColor: "gray",
    borderBottomWidth: 1,
    position: "relative",
  },
  FirstInputPass: {
    height: Dimensions.get("window").height * 0.05,
    width: width * 0.75,
    color: "white",
    padding: 5,
    borderRadius: 5,
    borderColor: "gray",
    borderBottomWidth: 1,
    position: "relative",
  },
  eyeIconContainer: {
    position: "absolute",
    top: "70%",
    right: 10,
    transform: [{ translateY: -12 }],
  },
  btnSignIn: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "white",
    width: width * 0.8,
    height: height * 0.065,
  },
  textSignIn: {
    justifyContent: "center",
    alignItems: "center",
    color: "white",
    fontWeight: "700",
    fontSize: 20,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
  },
  errorInput: {
    borderColor: "red",
  },
  resendContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-end",
    paddingRight: 10,
    width: "100%",
    // paddingBottom:30,
  },
  resendCodeText: {
    color: "gray",
  },
  resendTextOne: {
    color: "grey",
    paddingLeft: 5,
    textDecorationLine: "underline",
  },
  resendText: {
    color: "white",
    paddingLeft: 5,
    textDecorationLine: "underline",
    fontSize: 10,
    fontWeight: "400",
  },
  resendBtnContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 5,
  },
  bigResendContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 5,
    gap: 170,
    width: "100%",
  },
  resendContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingRight: 10,
  },
  resendCodeText: {
    color: "gray",
  },
  //   resendText: {
  //     color: "white",
  //     paddingLeft: 5,
  //   },
  infoText: {
    paddingBottom: 20,
    paddingLeft: 8,
    paddingRight: 4,
    fontSize: 12,
    color: "gray",
    fontStyle: "italic",
  },
  infoTextContainer: {
    justifyContent: "center",
    alignItems: "flex-start",
    width: "100%",
    paddingLeft: 10,
  },
  titleContainer: {
    justifyContent: "center",
    alignItems: "flex-start",
    width: "100%",
    paddingLeft: 20,
  },
  contRes: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  contbtnTxt: {
    justifyContent: "center",
    alignItems: "center",
    gap: 30,
    paddingTop: 20,
    paddingBottom: 100,
  },
});
