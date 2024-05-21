import React, { useEffect, useRef, useState } from "react";
import * as Font from "expo-font";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import ImagePreviewModal from "../components/ImagePreviewModal.jsx";
import {
  View,
  TextInput,
  StyleSheet,
  FlatList,
  Dimensions,
  Text,
  TouchableOpacity,
  Keyboard,
  ScrollView,
  Pressable,
  Button,
  Platform,
  Alert,
  Linking,
  Image as RNImage,
  ActivityIndicator
} from "react-native";

import { showToast } from "./../Helpers.js";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "react-native";
import Arrowright from "../assets/Svg/arrowright.svg";
import RotatableSvg from "../components/RotatedArrow";
import BackARrow from "../assets/Svg/backArrrow.svg";
import Add from "../assets/Svg/add-picture.svg";
import Change from "../assets/Svg/change-picture.svg";
import { Camera } from "expo-camera";
import * as CameraPermissions from "expo-camera";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useSelector, useDispatch } from "react-redux";
import { SignUpClick } from "../store/userSlice";
import { useNavigation } from "@react-navigation/native";
import appConfig from "../appConfig.js";
import { saveEmailForgot,savePasswordUser } from "../store/userSlice";
import Toast from "react-native-toast-message";

// import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons,MaterialIcons } from "@expo/vector-icons";
const { width, height } = Dimensions.get("screen");
const NewSignUp = () => {
  const flatListRef = useRef(null);
  const [fontLoaded, setFontLoaded] = useState(false);
  const [Ratio, setRatio] = useState(0);
  const [isCameraVisible, setIsCameraVisible] = useState(false);
  const [type, setType] = useState("");
  const [typeSelfie, setTypeSelfie] = useState("");
  // const [type, setType] = useState(CameraPermissions.CameraType.back);
  // const [typeSelfie, setTypeSelfie] = useState(
  //   CameraPermissions.CameraType.front
  // );
  const [activeIndex, setActiveIndex] = useState(0);
  const [Document, setDocument] = useState("");
  const [showImageModal, setShowImageModal] = useState(false);
  const [portait, setPortrait] = useState("");
  const [loading, setLoading] = useState(false);

  const [userDetails, setUserDetails] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
  });
  const [picsDetail, setPicsDetails] = useState({
    selfie: "bfdgef",
    license: "gfdgdf",
    backLicense: "gdfgd",
    passport: "gdfgdf",
  });
  console.log("piiiiiics", picsDetail);
  const [date, setDate] = useState(new Date());
  const [dateNow, setDateNow] = useState(new Date());
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [cameraPermission, setCameraPermission] = useState(null);
  const [capturedImage, setCapturedImage] = useState("");
  const [showImage, setShowImage] = useState(false);

  const userEmail = (value) => {
    dispatch(saveEmailForgot(value));
  };
  const userPassword = (value) => {
    dispatch(savePasswordUser(value));
  };
  const otpVerifSend = async () => {
    if (userDetails.email) {
      try {
        setLoading(true); 
        const response = await axios.post(
          `http://${process.env.EXPO_PUBLIC_SERVER_IP}:5000/api/users/sendVerificationEmail`,
          { email:userDetails.email }
        );

        if (response.status === 200) {
          console.log("Successfully OTP Verified")
        
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
  useEffect(() => {
    const handleCameraPermission = async () => {
      const { status } =
        await CameraPermissions.requestCameraPermissionsAsync();
      setCameraPermission(status);
      if (status === "granted") {
        return;
      } else if (status === "denied") {
        Alert.alert(
          "Camera Permission Required",
          "Please enable camera permissions in your device settings to use Aqwa-Cars.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Open Settings", onPress: openAppSettings },
          ]
        );
      } else {
        const { status: newStatus } =
          await Camera.requestCameraPermissionsAsync();
        setCameraPermission(newStatus);
        if (newStatus === "granted") {
          return;
        } else {
          Alert.alert(
            "Camera Permission Required",
            "Please enable camera permissions in your device settings.",
            [
              { text: "Cancel", style: "cancel" },
              { text: "Open Settings", onPress: openAppSettings },
            ]
          );
        }
      }
    };

    const openAppSettings = () => {
      Linking.openSettings().catch(() =>
        Alert.alert(
          "Unable to open settings.",
          "Please open settings manually to grant camera permission."
        )
      );
    };
    handleCameraPermission();
  }, []);

  const SignUpHandle = async () => {
    setLoading(true); // Start loader
  
    try {
      const response = await axios.post(
        `http://${process.env.EXPO_PUBLIC_SERVER_IP}:5000/api/users/SignUpUser`,
        {
          userName: userDetails.name,
          phoneNumber: userDetails.phone,
          password: userDetails.password,
          confirmPassword: userDetails.confirmPassword,
          email: userDetails.email,
          dateOfBirth: userDetails.dateOfBirth,
          selfie: picsDetail.selfie,
          drivingLicenseFront: picsDetail.license,
          drivingLicenseBack: picsDetail.backLicense,
          passport: picsDetail.passport,
        }
      );
  
      if (response.status === 201) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Registration Successfully done 😃!',
        });
        console.log("Successfully registered");
        await userEmail(userDetails.email);
        await userPassword(userDetails.password);
        await otpVerifSend();
        await navigation.navigate("OtpVerification");
      }
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        if (status === 409) {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: error.response.data.error || 'Conflict occurred. Please try again.',
          });
        } else if (status === 422) {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: error.response.data.error || 'Validation error. Please check your input.',
          });
        } else {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'An unexpected error occurred. Please try again.',
          });
        }
        // console.error("Error registering user:", error.response.data.error);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Network error. Please try again.',
        });
        // console.error("Network error:", error);
      }
    } finally {
      setLoading(false)
    }
  };
  

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
    setShow(false);
    if (currentDate) {
      const formattedDate = currentDate.toISOString().split("T")[0];
      setUserDetails({ ...userDetails, dateOfBirth: formattedDate });
      // console.log(formattedDate, "formdata");
    }
  };
  const onDismiss = () => {
    setShow(false);
  };
  // console.log(userDetails, "lllll");

  const showMode = () => {
    setShow(true);
  };
  const cameraRef = useRef(null);

  const takePicture = async (portrait) => {
    try {
      const { status } =
        await CameraPermissions.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Sorry, we need camera permissions to make this work!");
        return;
      }

      if (cameraRef.current) {
        const options = { quality: 0.5, base64: true };
        const data = await cameraRef.current.takePictureAsync(options);
        setCapturedImage(data.uri);
        setShowImageModal(true);
        // setIsCameraVisible(false);
      }
    } catch (error) {
      console.error("Error taking picture:", error);
    }
  };

  const handleConfirmImage = () => {
    setPicsDetails({ ...picsDetail, [portait]: capturedImage });
    console.log("Image confirmed:", capturedImage);
    setShowImageModal(false);
    setIsCameraVisible(false);
    setCapturedImage("");
  };

  const handleRetakePicture = () => {
    setShowImageModal(false);
    setIsCameraVisible(true);
    setCapturedImage("");
  };

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        "League-Spartan": require("../assets/fonts/LeagueSpartan-ExtraBold.ttf"),
      });
      setFontLoaded(true);
    };
    loadFonts();
  }, []);

  function isFormComplete(userDetails, picsDetail) {
    return (
      Object.values(userDetails).length === 6 &&
      Object.values(picsDetail).length === 4 &&
      Object.values(userDetails).every((value) => value !== "") &&
      Object.values(picsDetail).every((value) => value !== "")
    );
  }

  const [keyboardVisible, setKeyboardVisible] = useState(false);
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleUserChange = (field, value) => {
    setUserDetails({ ...userDetails, [field]: value });
  };

  const handlePics = (field, value) => {
    setPicsDetails({ ...picsDetail, [field]: value });
    setShowImageModal(false);
    setIsCameraVisible(false);
  };
  const handleCanceledPics = (field, value) => {
    setCapturedImage("");
    setShowImageModal(false);
    setIsCameraVisible(true);
  };

  const handleButtonPress = () => {
    if (activeIndex === 0) {
      setActiveIndex(1);
      flatListRef.current.scrollToIndex({ animated: true, index: 1 });
    } else if (activeIndex === 1) {
      setActiveIndex(0);
      flatListRef.current.scrollToIndex({ animated: true, index: 0 });
    } else {
      // console.log("Submitting form...");
      // Perform your submission logic here
    }
  };

  const handleScrollEnd = (e) => {
    const contentOffset = e.nativeEvent.contentOffset;
    const viewSize = e.nativeEvent.layoutMeasurement;
    const pageNum = Math.floor(contentOffset.x / viewSize.width);
    setActiveIndex(pageNum);
  };

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: false,
        aspect: [4, 3],
        quality: 1,
      });
      // console.log(result);
      if (!result.canceled) {
        setDocument(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image: ", error);
    }
  };

  if (!fontLoaded) {
    return null; // or a loading indicator
  }

  const renderItem = ({ item }) => {
    if (item.id === "User") {
      return (
        <LinearGradient
          locations={[0.2, 1]}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 0 }}
          colors={["#321947", "#000000"]}
          // style={styles.formContainer}
        >
          <ScrollView
            contentContainerStyle={styles.ScrollContainer}
            keyboardShouldPersistTaps="always"
          >
            <View
              style={{
                alignItems: "center",
                justifyContent: "space-evenly",
                // backgroundColor:"red",
                height,
              }}
            >
              <View
                style={{
                  height: height * 0.2,
                  // backgroundColor:"green"
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
                  // backgroundColor:"yellow"
                }}
              >
                <TextInput
                  style={styles.FirstInput}
                  placeholder="Username"
                  placeholderTextColor={"#cccccc"}
                  onChangeText={(text) => handleUserChange("name", text)}
                  value={userDetails.name}
                />
                <TextInput
                  style={styles.FirstInput}
                  placeholder="Enter Your  Email"
                  placeholderTextColor={"#cccccc"}
                  onChangeText={(text) => handleUserChange("email", text)}
                  value={userDetails.email}
                  keyboardType="email-address"
                />
                <TextInput
                  style={styles.FirstInput}
                  placeholder="Type Your Phone Number"
                  placeholderTextColor={"#cccccc"}
                  onChangeText={(text) => handleUserChange("phone", text)}
                  value={userDetails.phone}
                  keyboardType="phone-pad"
                />

                <TouchableOpacity onPress={showMode} style={styles.birthBtn}>
                  <Text style={styles.birthText}>
                    {!userDetails.dateOfBirth
                      ? "Select your date"
                      : userDetails.dateOfBirth}
                  </Text>
                </TouchableOpacity>
                {show && (
                  <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={onChange}
                    onDismiss={onDismiss}
                  />
                )}
                <TextInput
                  style={styles.FirstInput}
                  placeholder="Type Your Password"
                  placeholderTextColor={"#cccccc"}
                  onChangeText={(text) => handleUserChange("password", text)}
                  value={userDetails.password}
                  keyboardType="default"
                  secureTextEntry={true}
                />
                <TextInput
                  style={styles.FirstInput}
                  placeholder="Confirm Your Password"
                  placeholderTextColor={"#cccccc"}
                  onChangeText={(text) =>
                    handleUserChange("confirmPassword", text)
                  }
                  value={userDetails.confirmPassword}
                  keyboardType="default"
                  secureTextEntry={true}
                />
              </View>
            </View>
          </ScrollView>
        </LinearGradient>
      );
    } else if (item.id === "Pics") {
      return (
        <LinearGradient
          locations={[0.2, 1]}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 0 }}
          colors={["#321947", "#000000"]}
          // style={styles.formContainer}
        >
          <ScrollView
            contentContainerStyle={styles.ScrollContainer}
            keyboardShouldPersistTaps="always"
          >
            <View
              style={{
                alignItems: "center",
                justifyContent: "space-evenly",
                // backgroundColor:"red",
                height,
              }}
            >
              <View
                style={{
                  height: height * 0.2,
                  // backgroundColor:"green"
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
                  // backgroundColor:"yellow",
                  justifyContent: "center",
                }}
              >
                <Pressable
                  delayPressIn={0}
                  style={styles.inputContainer}
                  onPress={() => {
                    setType("front");
                    setPortrait("selfie");
                    setIsCameraVisible(true);
                  }}
                >
                  <View
                    style={{
                      paddingBottom: height * 0.007,
                    }}
                  >
                    {picsDetail.selfie ? <Change /> : <Add />}
                  </View>
                  {/* <View style={styles.inputContainer}> */}
                  <TextInput
                    style={[
                      styles.input,
                      {
                        opacity: picsDetail.selfie ? 0.5 : 1,
                      },
                      {
                        backgroundColor: picsDetail.selfie
                          ? "transparent" 
                          : "transparent",
                      },
                    ]}
                    placeholder={
                      picsDetail.selfie
                        ? "Tap here to change Image  ☑️"
                        : "Take a Selfie"
                    }
                    placeholderTextColor={
                      picsDetail.selfie ? "#cccccc" : "#cccccc"
                    } 
                    editable={false} 
                  />
                  {!picsDetail.selfie && (
                    <Text
                      style={{
                        color: "white",
                        position: "absolute",
                        right: 5,
                        top: -15,
                      }}
                    >
                      *
                    </Text>
                  )}
                  {/* </View> */}
                </Pressable>
                <Pressable
                  style={styles.inputContainer}
                  onPress={() => {
                    setType("back");
                    setPortrait("license");
                    setIsCameraVisible(true);
                  }}
                >
                  <View
                    style={{
                      paddingBottom: height * 0.007,
                    }}
                  >
                    {picsDetail.license ? <Change /> : <Add />}
                  </View>
                  <TextInput
                    style={[
                      styles.input,
                      { opacity: picsDetail.license ? 0.5 : 1 },
                    ]}
                    placeholder={
                      picsDetail.license
                        ? "Tap here to change Image  ☑️"
                        : " photo of your Driving License "
                    }
                    placeholderTextColor={"#cccccc"}
                    // keyboardType="email-address"
                    editable={false} // Make the TextInput not editable
                  />
                  {!picsDetail.license && (
                    <Text
                      style={{
                        color: "white",
                        position: "absolute",
                        right: 5,
                        top: -15,
                      }}
                    >
                      *
                    </Text>
                  )}
                </Pressable>
                <Pressable
                  style={styles.inputContainer}
                  onPress={() => {
                    setType("back");
                    setPortrait("backLicense");
                    setIsCameraVisible(true);
                  }}
                >
                  <View
                    style={{
                      paddingBottom: height * 0.007,
                    }}
                  >
                    {picsDetail.backLicense ? <Change /> : <Add />}
                  </View>
                  <TextInput
                    style={[
                      styles.input,
                      { opacity: picsDetail.backLicense ? 0.5 : 1 },
                    ]}
                    placeholder={
                      picsDetail.backLicense
                        ? "Tap here to change Image  ☑️"
                        : " photo of the back of your driving license "
                    }
                    placeholderTextColor={"#cccccc"}
                    // keyboardType="email-address"
                    editable={false} // Make the TextInput not editable
                  />
                  {!picsDetail.backLicense && (
                    <Text
                      style={{
                        color: "white",
                        position: "absolute",
                        right: 5,
                        top: -15,
                      }}
                    >
                      *
                    </Text>
                  )}
                </Pressable>
                <Pressable
                  style={styles.inputContainer}
                  onPress={() => {
                    setType("back");
                    setPortrait("passport");
                    setIsCameraVisible(true);
                  }}
                >
                  <View
                    style={{
                      paddingBottom: height * 0.007,
                    }}
                  >
                    {picsDetail.passport ? <Change /> : <Add />}
                  </View>
                  <TextInput
                    style={[
                      styles.input,
                      { opacity: picsDetail.passport ? 0.5 : 1 },
                    ]}
                    placeholder={
                      picsDetail.passport
                        ? "Tap here to change Image  ☑️"
                        : " photo of your Passport  "
                    }
                    placeholderTextColor={"#cccccc"}
                    // keyboardType="email-address"
                    editable={false} // Make the TextInput not editable
                  />
                  {!picsDetail.passport && (
                    <Text
                      style={{
                        color: "white",
                        position: "absolute",
                        right: 5,
                        top: -15,
                      }}
                    >
                      *
                    </Text>
                  )}
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </LinearGradient>
      );
    }
  };

  return (
    <>
      {!isCameraVisible && (
        <LinearGradient
          locations={[0.1, 0.9]}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 0 }}
          colors={["#321947", "#000000"]}
          style={styles.container}
        >
          <FlatList
            ref={flatListRef}
            data={[{ id: "User" }, { id: "Pics" }]}
            renderItem={renderItem}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            onMomentumScrollEnd={handleScrollEnd}
          />
          {keyboardVisible ? null : (
            <Pressable
              activeOpacity={0.5}
              style={[styles.FlatBtn, { backgroundColor: "#321947" }]} // Adjusted to use a solid color
              onPress={() =>
                isFormComplete(userDetails, picsDetail)
                  ? SignUpHandle()
                  : handleButtonPress()
              }
            >
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "flex-end",
                  flexDirection: "row",
                  backgroundColor: "transparent",
                }}
              >
                {isFormComplete(
                  userDetails,
                  picsDetail
                ) ? null : activeIndex === 1 ? (
                  <RotatableSvg rotation={180} />
                ) : null}
                <Text
                  style={{
                    color: "#fff",
                    backgroundColor: "transparent",
                    fontSize: 18,
                    fontFamily: "League-Spartan",
                    paddingBottom: height * 0.01,
                  }}
                >
                  {isFormComplete(userDetails, picsDetail)
                    ? "Submit"
                    : activeIndex === 0
                      ? "Next"
                      : activeIndex === 1
                        ? "Previous"
                        : null}
                </Text>
                {isFormComplete(userDetails, picsDetail) ? (
                  <Arrowright />
                ) : activeIndex === 0 ? (
                  <Arrowright />
                ) : null}
              </View>
            </Pressable>
          )}
          {loading && ( 
          <View style={styles.loader}>
            <ActivityIndicator size="large" color="white" />
          </View>
        )}
        </LinearGradient>
      )}
   
  {isCameraVisible && (
      <View style={styles.containerCCamera}>
    <View style={styles.cameraContainer}>
      <Camera
        ref={cameraRef}
        style={styles.camera}
        type={type}
        ratio="16:9"
      />
      {showImageModal && (
        <ImagePreviewModal
          visible={showImageModal}
          imageUri={capturedImage}
          onConfirm={handleConfirmImage}
          onRetake={handleRetakePicture}
        />
      )}
      <TouchableOpacity
          style={styles.cancelButtonContainer}
          onPress={() => setIsCameraVisible(false)}
        >
          <MaterialIcons name="cancel" size={24} color="white" />
        </TouchableOpacity>
          <View style={styles.buttonContainer}>
        {/* <TouchableOpacity onPress={() => setIsCameraVisible(false)}>
        <MaterialIcons name="cancel" size={24} color="white" />
        </TouchableOpacity> */}
        <TouchableOpacity
          style={styles.captureButton}
          onPress={() => takePicture(portait)}
        >
          <MaterialCommunityIcons
            name="camera-iris"
            size={75}
            color="white"
          />
        </TouchableOpacity>
      </View>
       
    </View>
   
</View>
  )}

    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: width * 0.8,
    borderColor: "gray",
    borderBottomWidth: 1,
    height: height * 0.03,
    marginBottom: height * 0.03,
  },
  FlatBtn: {
    height: height * 0.08,
    width: width,
    // paddingRight:width*.15,
    // borderBottomEndRadius: 100,
    // backgroundColor:"red",
    // borderBottomLeftRadius: 100,
    // backgroundColor: "transparent",
    alignItems: "center",
    // justifyContent: "flex-end",
    // flexDirection: "row",
    // borderTopColor: "#000000",
    // justifyContent: "center",
    paddingBottom: height * 0.005,
    paddingLeft: width * 0.6,
  },
  formContainer: {
    width: Dimensions.get("window").width,
    height: height,
    padding: 20,
    alignItems: "center",
    justifyContent: "space-evenly",
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
  },
  input: {
    height: Dimensions.get("window").height * 0.05,
    width: width * 0.75,

    color: "white",
    marginBottom: 10,
    padding: 5,
    borderRadius: 5,
  },
  cameraButton: {
    alignItems: "center",
    width: width * 0.75,
    backgroundColor: "#fff",
    padding: height * 0.01,
    borderRadius: 100,
    // marginTop: 10,
    borderColor: "#000000",
    borderWidth: 0.5,
  },
  cameraButtonText: {
    fontSize: 16,
  },
  img: {
    height: height * 0.2,
    width: width,
  },
  ScrollContainer: {
    height,
    alignItems: "center",
    // justifyContent: "space-evenly",
    flexGrow: 1,
  },
  birthBtn:{
    height: Dimensions.get("window").height * 0.05,
    width: width * 0.75,
    color: "white",
    marginBottom: 10,
    padding: 5,
    borderRadius: 5,
    borderColor: "gray",
    borderBottomWidth: 1,
  },
  birthText: {
    color: "white",
  },
  containerCCamera: {
    flex: 1,
    // height,
    // width
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'space-between',
  },
  camera: {
    // flex: 1,
    width: width, 
    height: height * 0.8 
  },
  buttonContainer: {
    height:height*0.2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems:"center",
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: 'rgba(34, 34, 34, 0.9)', 
  },
  cancelButton: {
    color: '#fff',
    fontSize: 18,
  },
  captureButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)', 
    // paddingHorizontal: 20,
    // paddingVertical: 10,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    height:90,
    width:90,
  },
  cancelButtonContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
  },
  loader: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
});

export default NewSignUp;
