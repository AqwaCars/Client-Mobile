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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import axios from "axios";
import appConfig from "../appConfig";
import Toast from "react-native-toast-message";

const { width, height } = Dimensions.get("screen");

const NewLogin = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    validateEmail();
    validatePassword();
  }, [email, password]);

  const validateEmail = () => {
    const re = /\S+@\S+\.\S+/;
    const isValid = re.test(email);
    setEmailError(isValid ? "" : "Invalid email format");
  };

  const validatePassword = () => {
    let error = "";
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
    setPasswordError(error);
  };

  const submitLogin = async () => {
    // If both email and password are valid, proceed with login
    if (!emailError && !passwordError) {
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

          await AsyncStorage.setItem("userId", id.toString());
          await AsyncStorage.setItem("token", token);

          navigation.navigate("NewHome");
        }
      } catch (error) {
        if (error.response && error.response.status === 422) {
          console.log("422", error);
        } else {
          console.error("Error registering user:", error);
        }
      }
    } else {
      console.log("Verify email and password");
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
                  <Text style={styles.title}>Login</Text>
                </View>
                <View>
                  <TextInput
                    style={[styles.FirstInput, emailError ? styles.errorInput : null]}
                    placeholder="Enter Your Email"
                    placeholderTextColor={"#cccccc"}
                    onChangeText={(text) => setEmail(text)}
                    keyboardType="email-address"
                  />
                  {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
                  <TextInput
                    style={[styles.FirstInput, passwordError ? styles.errorInput : null]}
                    placeholder="Type Your Password"
                    placeholderTextColor={"#cccccc"}
                    secureTextEntry={!showPassword}
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                  />
                  {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
                  <TouchableOpacity
                    style={styles.eyeIconContainer}
                    onPress={togglePasswordVisibility}
                  >
                    <Feather name={showPassword ? "eye" : "eye-off"} size={20} color="#cccccc" />
                  </TouchableOpacity>
                </View>
                <Pressable style={styles.btnSignIn} onPress={submitLogin}>
                  <Text style={styles.textSignIn}>Sign In</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
};

export default NewLogin;

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
    gap: 30,
  },
  title: {
    paddingBottom: 20,
    fontSize: 28,
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
  eyeIconContainer: {
    position: "absolute",
    top: "70%",
    right: 10,
    transform: [{ translateY: -12 }],
  },
  btnSignIn: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 40,
    borderWidth: 1,
    borderColor: "white",
    width: width * 0.3,
    height: 50,
  },
  textSignIn: {
    justifyContent: "center",
    alignItems: "center",
    color: "white",
    fontWeight: "500",
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
});
