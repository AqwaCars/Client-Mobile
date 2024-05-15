import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import IdentifierIcon from "../assets/Svg/user-normal.svg";
import Logo from "../assets/tempLogo.png";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FiraMonoBold from "../assets/fonts/FiraMono-Bold.ttf";
import FiraMonoMedium from "../assets/fonts/FiraMono-Medium.ttf";
import * as Font from "expo-font";
const { width, height } = Dimensions.get("screen");

const ForgotPassword = ({ navigation }) => {
  const [identifier, setIdentifier] = useState("");
  const [inputChecked, setInputChecked] = useState(false);
  const [fullCode, setFullCode] = useState([]);
  const [received, setReceived] = useState(null);
  const [error, setError] = useState(null);
  // useEffect(() => {
  //   const loadFonts = async () => {
  //     await Font.loadAsync({
  //       "FiraMono-Bold": FiraMonoBold,
  //       "FiraMono-Medium": FiraMonoMedium,
  //     });
  //   };

  //   loadFonts();
  // }, []);
  const handleSubmit = async () => {
    try {
      if (identifierValidation(identifier) !== "email") {
        return setError("please provide a valid email address");
      }
      const response = await axios.get(
        `http://${process.env.EXPO_PUBLIC_SERVER_IP}:5000/api/users/getOneByEmail/${identifier}`
      );
      // console.log("response: ", response.data);
      if (response.data === "user exists") {
        const response = await axios.post(
          `http://${process.env.EXPO_PUBLIC_SERVER_IP}:5000/api/users/sendResetPasswordConfirmationCode`,
          { email: identifier }
        );
        const userInfo = await axios.get(
          `http://${process.env.EXPO_PUBLIC_SERVER_IP}:5000/api/users/getInfoByMail/${identifier}`
        );
        // console.log("userInfo: ", userInfo.data);
        await AsyncStorage.setItem("id", JSON.stringify(userInfo.data.id));
        setReceived(response.data);
      }
      setError(null);
    } catch (err) {
      if (err.response.status == "404") {
        setError("user does not exist");
      } else {
        console.error(err.message);
      }
    }
  };

  const inputValidation = () => {
    if (!identifier) {
      setInputChecked(false);
    } else {
      setInputChecked(true);
    }
  };

  const identifierValidation = (identifier) => {
    const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,7}\b/;
    if (emailPattern.test(identifier)) {
      return "email";
    }
  };

  const inputRefs = Array(5)
    .fill()
    .map((_, i) => ({ ref: useRef(null), key: i }));

  const handleTextChange = (text, index) => {
    fullCode[index] = text;
    setFullCode([...fullCode]);
    if (text.length === 1 && index < inputRefs.length - 1) {
      inputRefs[index + 1].current.focus();
    } else if (text.length === 0 && index > 0) {
      setFullCode(fullCode.slice(0, fullCode.length - 1));
      inputRefs[index - 1].current.focus();
    }
  };

  const handleVerifyCode = () => {
    if (fullCode.join("") != received) {
      // console.log("Invalid Code", received, " ", fullCode.join(""));
      return setError("Invalid Code");
    }
    setError(null);
    navigation.navigate("ResetPassword");
  };

  useEffect(() => {
    inputValidation();
  }, [identifier]);

  return (
    <View style={styles.forgotPasswordPage}>
      <View style={styles.logoContainer}>
        <Image source={Logo} alt="logo" style={styles.logo} />
      </View>
      <View style={styles.inputContainer}>
        {!received ? (
          <View>
            <IdentifierIcon style={styles.inputIcon} />
            <TextInput
              autoCapitalize="none"
              onChangeText={(content) => setIdentifier(content.trim())}
              placeholder="insert your email address"
              style={styles.identifierInput}
            />
          </View>
        ) : (
          <View style={styles.confirmIdentityPage}>
            <View style={styles.inputsContainer}>
              {inputRefs.map((ref, index) => (
                <TextInput
                  key={index}
                  style={styles.codeInput}
                  keyboardType="numeric"
                  maxLength={1}
                  onChangeText={(text) => handleTextChange(text, index)}
                  ref={ref}
                />
              ))}
            </View>
            <View style={styles.identifierErrorContainer}>
              <Text style={styles.error}>
                {error === "Invalid Code" ? error : null}
              </Text>
            </View>
          </View>
        )}
        <View style={styles.identifierErrorContainer}>
          <Text style={styles.error}>
            {error === "user does not exist" ||
            error === "please provide a valid email address"
              ? error
              : null}
          </Text>
        </View>
        {!received ? (
          <TouchableOpacity
            style={styles.submitBtnContainer}
            activeOpacity={0.8}
            onPress={handleSubmit}
            disabled={!inputChecked}
          >
            <LinearGradient
              colors={
                inputChecked ? ["#6C77BF", "#4485C5"] : ["#88b4e2", "#88b4e2"]
              }
              locations={[0, 1]}
              style={styles.submitBtn}
            >
              <Text style={styles.submitBtnContent}>Send the code</Text>
            </LinearGradient>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.submitBtnContainer}
            activeOpacity={0.8}
            onPress={handleVerifyCode}
            disabled={!inputChecked}
          >
            <LinearGradient
              colors={
                inputChecked ? ["#6C77BF", "#4485C5"] : ["#88b4e2", "#88b4e2"]
              }
              locations={[0, 1]}
              style={styles.submitBtn}
            >
              <Text style={styles.submitBtnContent}>Verify Code</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

ForgotPassword.navigationOptions = {
  title: "ForgotPassword",
};

const styles = StyleSheet.create({
  forgotPasswordPage: {
    display: "flex",
    flexDirection: "column",
    padding: 20,
    alignItems: "center",
    backgroundColor: "white",
    flex: 1,
    gap: 50,
  },
  logoContainer: {
    padding: 50,
  },
  logo: {
    height: height * 0.15,
    width: width * 0.61,
  },
  inputContainer: {
    position: "relative",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  inputIcon: {
    position: "absolute",
    top: 13,
    left: "2%",
    width: "10%",
    height: 20,
    zIndex: 1,
  },
  identifierInput: {
    backgroundColor: "#eef1f8",
    borderRadius: 5,
    height: 50,
    paddingLeft: 40,
    zIndex: 0,
  },
  identifierErrorContainer: {
    textAlign: "left",

  },
  error: {
    color: "red",
  },
  submitBtnContainer: {
    width: "100%",
  },
  submitBtn: {
    borderRadius: 10,
    height: 50,
    width: "100%",
    color: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  submitBtnContent: {
    color: "white",
    fontSize: 18,
  },
  confirmIdentityPage: {
    display: "flex",
    flexDirection: "column",
    paddingHorizontal: width * 0.1,
    paddingVertical: height * 0.1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    flex: 1,
    gap: 30,
  },
  inputsContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  codeInput: {
    backgroundColor: "#eef1f8",
    borderRadius: 5,
    height: height * 0.06,
    width: "19%",
    zIndex: 0,
    // paddingHorizontal: width * 0.05,
    textAlign: "center",
    fontSize: 24,
  },
});
export default ForgotPassword;
