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
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Toast from 'react-native-toast-message'; 

import axios from "axios";
import appConfig from "../appConfig";
import { useDispatch, useSelector } from "react-redux";
import { saveEmailForgot } from "../store/userSlice";
const { width, height } = Dimensions.get("screen");

const ChangePassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const userEmail = (value) => {
    dispatch(saveEmailForgot(value));
  };
  const email = "makhloufaymen.fr@gmail.com";

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  useEffect(() => {
    validatePassword();
    validateConfirmPassword();
  }, [password, confirmPassword]);

  const validatePassword = () => {
    let error = "";
    if (password.length > 0) {
      if (password.length < 8) {
        error = "Password must be at least 8 characters long";
      } else if (!/[a-z]/.test(password)) {
        error = "Password must contain at least one lowercase letter";
      } else if (!/[A-Z]/.test(password)) {
        error = "Password must contain at least one uppercase letter";
      } else if (!/\d/.test(password)) {
        error = "Password must contain at least one digit";
      } else if (!/[@$!%*?&]/.test(password)) {
        error = "Password must contain at least one special character";
      }
    }
    setPasswordError(error);
  };

  const validateConfirmPassword = () => {
    let error = "";
    if (confirmPassword.length > 0) {
      if (confirmPassword !== password) {
        error = "Passwords do not match";
      }
    }
    setConfirmPasswordError(error);
  };

  const changePassword = async (email, newPass, confirmPass) => {
    if (!newPass || !confirmPass) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Please enter new password and confirm password' });
      return;
    }
    
    if (newPass !== confirmPass) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'New password and confirm password do not match' });
      return;
    }

    if (passwordError || confirmPasswordError) {
      // Display error messages if there are validation errors
      Toast.show({ type: 'error', text1: 'Error', text2: 'Passwords do not meet the required criteria' });
      return;
    }

    try {
      const response = await axios.post(
        `http://${process.env.EXPO_PUBLIC_SERVER_IP}:5000/api/users/changePassword`,
        {
          email: email,
          newPassword: newPass,
          confirmPassword: confirmPass,
        }
      );

      if (response.status === 200) {
        navigation.navigate("newLogIn");
        userEmail("")
        setPassword("")
        setConfirmPassword("")
        console.log("Successfully changed password");
      }
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        if (status === 400) {
          Toast.show({ type: 'error', text1: 'Error', text2: 'Please provide new password, and confirm password' });
        } else if (status === 422) {
          if (error.response.data.error === "Please choose a different password") {
            Toast.show({ type: 'error', text1: 'Error', text2: 'Please choose a different password' });
          } else {
            Toast.show({ type: 'error', text1: 'Error', text2: 'Passwords do not match or are invalid.' });
          }
        } else if (status === 404) {
          Toast.show({ type: 'error', text1: 'Error', text2: 'User not found' });
        } else {
          Toast.show({ type: 'error', text1: 'Error', text2: 'Internal server error. Please try again later.' });
        }
      } else {
        Toast.show({ type: 'error', text1: 'Error', text2: 'Network error. Please check your internet connection.' });
      }
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
          <View style={{ alignItems: "center", justifyContent: "space-evenly", height }}>
            <View style={{ height: height * 0.2 }}>
              <Image style={styles.img} source={require("../assets/aqwaWhite.png")} />
            </View>
            <View style={{ height: height * 0.4 }}>
              <View style={styles.container}>
                <View style={styles.titleContainer}>
                  <Text style={styles.title}>Change your password</Text>
                </View>
                <View>
                  <TextInput
                    style={[styles.inputPass, passwordError ? styles.errorInput : null]}
                    placeholder="Type New Password"
                    placeholderTextColor={"#cccccc"}
                    secureTextEntry={!showNewPassword}
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                  />
                  <Pressable
                    style={styles.eyeIconContainer}
                    onPress={toggleNewPasswordVisibility}
                  >
                    <Feather name={showNewPassword ? "eye" : "eye-off"} size={20} color="#cccccc" />
                  </Pressable>
                </View>
                  {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
                <View>
                  <TextInput
                    style={[styles.inputPass, confirmPasswordError ? styles.errorInput : null]}
                    placeholder="Confirm Your Password"
                    placeholderTextColor={"#cccccc"}
                    secureTextEntry={!showConfirmPassword}
                    onChangeText={(text) => setConfirmPassword(text)}
                    value={confirmPassword}
                  />
                  <View>
                    
                  </View>
                  <Pressable
                    style={styles.eyeIconContainer}
                    onPress={toggleConfirmPasswordVisibility}
                  >
                    <Feather name={showConfirmPassword ? "eye" : "eye-off"} size={20} color="#cccccc" />
                  </Pressable>
                </View>
                  {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}
                <View style={styles.pressableBtnSubmit}>
                  <Pressable style={styles.btnSubmit} onPress={()=>changePassword(email,password,confirmPassword)}>
                    <Text style={styles.textSubmit}>Submit</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
};

export default ChangePassword;

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
    gap: 10,
  },
  title: {
    paddingBottom: 20,
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
  },
  inputPass: {
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
    top: "50%",
    right: 10,
    transform: [{ translateY: -12 }],
  },
  btnSubmit: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "white",
    width: width * 0.80,
    height: height*0.065,
  },
  textSubmit: {
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
  pressableBtnSubmit:{
    justifyContent: "center",
    alignItems: "center",
    paddingTop:40
  },
});
