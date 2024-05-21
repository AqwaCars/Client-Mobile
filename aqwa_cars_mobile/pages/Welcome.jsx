import React, { useEffect, useState, useRef , useContext } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
  Dimensions,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Animated,
  Platform, // Import Animated
} from "react-native";
import * as Font from "expo-font";
import back1 from "../assets/back1.png";
import back2 from "../assets/back2.png";
import back3 from "../assets/back3.png";
import back4 from "../assets/back4.png";
import blackLogo from "../assets/aqwaBlack.png";
import whiteLogo from "../assets/aqwaWhite.png";
import { useNavigation } from "@react-navigation/native";
import {LoginContext} from "../context/AuthContext.jsx"

const { width, height } = Dimensions.get("screen");
const Welcome = () => {
  const [fontLoaded, setFontLoaded] = useState(false);
  const [image, setImage] = useState(back1);
  const [Loading, setLoading] = useState(false);
  const [Loading2, setLoading2] = useState(false);
  const [Loading3, setLoading3] = useState(false);
  const [logo, setLogo] = useState(whiteLogo);
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(1)).current; // Define fadeAnim using useRef
  const { logindata,setLoginData } = useContext(LoginContext);

  console.log('skkou skou ',logindata)
  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        "League-Spartan": require("../assets/fonts/LeagueSpartan-Medium.ttf"),
      });
      setFontLoaded(true);
    };

    loadFonts();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setImage((currentImage) =>
        currentImage === back1
          ? back2
          : currentImage === back2
          ? back3
          : currentImage === back3
          ? back4
          : back1
      );
    }, 4000);

    return () => clearInterval(timer); 
  }, []);

  useEffect(() => {
    if (Platform.OS === "ios") {
      const timer = setTimeout(() => {
        setLogo(image === back2 || image === back4 ? blackLogo : whiteLogo);
      }, 200); // Delay of 1 second
      return () => clearTimeout(timer);
    } else {
      setLogo(image === back2 || image === back4 ? blackLogo : whiteLogo);
    }
  }, [image]);
  if (!fontLoaded) {
    return null; 
  }
  return (
    <View style={{ flex: 1 }}>
      <ImageBackground source={image} style={styles.image}>
        <View style={styles.topContainer}>
          <Image
            style={{
              height: height * 0.23,
              width: width * 0.9,
              marginBottom: height * 0.2,
            }}
            source={logo}
          />
        </View>
        <View style={styles.botContainer}>
          <TouchableOpacity
            onPress={() => {
              setLoading(true);
              setTimeout(() => {
                navigation.navigate("newSignUp");
                setLoading(false);
              }, 100);
            }}
            activeOpacity={0.7}
            style={styles.button}
          >
            {Loading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.text}>Sign Up </Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setLoading2(true);
              setTimeout(() => {
                navigation.navigate("newLogIn");
                setLoading2(false);
              }, 100);
            }}
            activeOpacity={0.7}
            style={styles.button2}
          >
            {Loading2 ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.text}>Log In </Text>
            )}
          </TouchableOpacity>
          <TouchableWithoutFeedback
            style={{
              height: height * 0.3,
            }}
            onPress={() => {
              setLoading3(true);
              setTimeout(() => {
                navigation.navigate("SignUpAgency");
                setLoading3(false);
              }, 100);
            }}
          >
            {Loading3 ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text
                style={{
                  // textDecorationLine: "underline",
                  fontFamily: "League-Spartan",
                  color: "white", // Text color
                  textShadowColor: "black", // Stroke color
                  textShadowOffset: { width: -1, height: -1 }, // Offset for the shadow
                  textShadowRadius: 0.1, // Blur radius for the shadow
                }}
              >
                Sign Up As An Agency
              </Text>
            )}
          </TouchableWithoutFeedback>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  topContainer: {
    flex: 0.5,
    // width:width*2,
    // height:height*.8,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor:"red"
  },
  botContainer: {
    // marginTop:height*.2,
    flex: 0.5,
    // backgroundColor:"yellow",
    height: height * 0.3,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: height * 0.06,
  },
  button: {
    backgroundColor: "#8c52ff",
    width: width * 0.85,
    height:height*.053,
    justifyContent:"center",
    alignItems: "center",
    padding: 10,
    margin: 10,
    borderRadius: 5,
  },
  button2: {
    backgroundColor: "#000000",
    width: width * 0.85,
    alignItems: "center",
    padding: 10,
    margin: 10,
    borderRadius: 5,
  },
  text: {
    fontFamily: "League-Spartan",
    fontSize: 18,
    color: "white",
  },
});

export default Welcome;
