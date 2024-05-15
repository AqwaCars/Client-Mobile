import {
  Image,
  StyleSheet,
  View,
  Dimensions,
  TextInput,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Logo from "../assets/tempLogo.png";
import PasswordIcon from "../assets/Svg/lock.svg";
import { useEffect, useState } from "react";
import axios from "axios";
import Open from "../assets/Svg/eyeOpen.svg";
import Close from "../assets/Svg/eyeClose.svg";
import AsyncStorage from "@react-native-async-storage/async-storage";
const { width, height } = Dimensions.get("screen");
import FiraMonoBold from "../assets/fonts/FiraMono-Bold.ttf";
import FiraMonoMedium from "../assets/fonts/FiraMono-Medium.ttf";
import * as Font from "expo-font";
const ResetPassword = ({ navigation }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [inputsChecked, setInputsChecked] = useState(false);
  const [passWordStrengthError, setPassWordStrengthError] = useState(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState(null);
  const [eyeState1, setEyeState1] = useState(true);
  const [isSecure1, setIsSecure1] = useState(true);
  const [eyeState2, setEyeState2] = useState(true);
  const [isSecure2, setIsSecure2] = useState(true);

  const handleComfirmPassword = () => {
    if (newPassword !== confirmNewPassword) {
      setConfirmPasswordError(
        "The password and confirm password do not match."
      );
      return false;
    }
    setConfirmPasswordError(null);
    return true;
  };



  const handlePasswordStrength = () => {
    var regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
    if (newPassword.length < 8 && !regex.test(newPassword)) {
      setPassWordStrengthError("Try a stronger password");
      return false;
    }
    setPassWordStrengthError(null);
    return true;
  };

  const handleInputs = () => {
    if (!!newPassword && !!confirmNewPassword) {
      return setInputsChecked(true);
    }
    return setInputsChecked(false);
  };

  const handlePasswordUpdate = async () => {
    try {
      if (!handleComfirmPassword()) {
        return;
      }
      setConfirmPasswordError(null);
      if (!handlePasswordStrength()) {
        return;
      }
      // Retrieve the value
      const storedValue = await AsyncStorage.getItem("id");

      if (storedValue !== null) {
        // Delete the value
        await AsyncStorage.removeItem("id");
      } else {
        Alert.alert("Something went wrong");
        return;
      }
      axios.put(
        `http://${process.env.EXPO_PUBLIC_SERVER_IP}:5000/api/users/update/${storedValue}`,
        { password: newPassword }
      );
      navigation.navigate("Login");
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    handleInputs();
  }, [newPassword, confirmNewPassword]);

  return (
    <ScrollView style={styles.resetPage}>
      <View style={styles.logoContainer}>
        <Image source={Logo} alt="logo" style={styles.logo} />
      </View>
      <View style={styles.inputsContainer}>
        <View>
          <PasswordIcon style={styles.inputIcon} />
          <TextInput
            autoCapitalize="none"
            onChangeText={(content) => setNewPassword(content.trim())}
            placeholder="insert your new password"
            style={
              !passWordStrengthError
                ? styles.Input
                : { ...styles.Input, borderColor: "red", borderWidth: 1 }
            }
            secureTextEntry={isSecure1}
          />
          {!eyeState1 ? (
            <Open
              style={styles.eye}
              onPress={() => {
                setEyeState1(!eyeState1), setIsSecure1(!isSecure1);
              }}
            />
          ) : (
            <Close
              style={styles.eye}
              onPress={() => {
                setEyeState1(!eyeState1), setIsSecure1(!isSecure1);
              }}
            />
          )}
        </View>
        <View style={styles.passwordErrorContainer}>
          <Text style={styles.error}>
            {passWordStrengthError ? passWordStrengthError : null}
          </Text>
        </View>
        <View>
          <PasswordIcon style={styles.inputIcon} />
          <TextInput
            autoCapitalize="none"
            onChangeText={(content) => setConfirmNewPassword(content.trim())}
            placeholder="repeat your new password"
            style={
              !confirmPasswordError
                ? styles.Input
                : { ...styles.Input, borderColor: "red", borderWidth: 1 }
            }
            secureTextEntry={isSecure2}
          />
          {!eyeState2 ? (
            <Open
              style={styles.eye}
              onPress={() => {
                setEyeState2(!eyeState2), setIsSecure2(!isSecure2);
              }}
            />
          ) : (
            <Close
              style={styles.eye}
              onPress={() => {
                setEyeState2(!eyeState2), setIsSecure2(!isSecure2);
              }}
            />
          )}
        </View>
        <View style={styles.passwordErrorContainer}>
          <Text style={styles.error}>
            {confirmPasswordError ? confirmPasswordError : null}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.confirmBtnContainer}
        activeOpacity={0.8}
        onPress={handlePasswordUpdate}
        disabled={!inputsChecked}
      >
        <LinearGradient
          colors={
            inputsChecked ? ["#6C77BF", "#4485C5"] : ["#88b4e2", "#88b4e2"]
          }
          locations={[0, 1]}
          style={styles.confirmBtn}
        >
          <Text style={styles.confirmBtnContent}>Confirm password</Text>
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  resetPage: {
    flex: 1,
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.02,
  },
  logoContainer: {
    padding: 50,
  },
  logo: {
    height: height * 0.15,
    width: width * 0.61,
  },
  inputsContainer: {
    gap: height * 0.025,
  },
  inputIcon: {
    position: "absolute",
    top: 13,
    left: "2%",
    width: "10%",
    height: 20,
    zIndex: 1,
  },
  Input: {
    backgroundColor: "#eef1f8",
    borderRadius: 5,
    height: 50,
    paddingLeft: 40,
    zIndex: 0,
  },
  eye: {
    position: "absolute",
    top: 15,
    right: "3%",
    width: "10%",
    height: 20,
    zIndex: 1,
  },
  passwordErrorContainer: {
    textAlign: "left",
    justifyContent: "center",
  },
  error: {
    color: "red",
   
  },
  confirmBtnContainer: {
    width: "100%",
  },
  confirmBtn: {
    borderRadius: 10,
    height: 50,
    width: "100%",
    color: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  confirmBtnContent: {
    color: "white",
    fontSize: 18,

  },
});

export default ResetPassword;
