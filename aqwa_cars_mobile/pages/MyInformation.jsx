import React, { useState, useContext,useEffect,useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Dimensions,
  ScrollView,
  Image,
  LayoutAnimation,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  Platform
} from "react-native";
import ArrowBack from "../assets/Svg/blackArrow.svg";
import UnderlinedInputs from "../components/UnderlinedInputs";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { err } from "react-native-svg";
import { LoginContext } from "../context/AuthContext.jsx";
import { parsePhoneNumberFromString, AsYouType } from "libphonenumber-js";
import PasswordDeleteAccountSheet from "../components/PasswordDeleteAccountSheet.jsx";
const { height, width } = Dimensions.get("screen");

const MyInformation = ({ route }) => {
  const navigation = useNavigation();
  const { logindata, setLoginData } = useContext(LoginContext);

  const userData = route.params.data;
  const [loading, setLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [editableUserData, setEditableUserData] = useState(userData);
  const [errors, setErrors] = useState({
    currentPassword: [],
    newPassword: [],
    confirmNewPassword: [],
  });
  const [modalVisibleDeletToken, setModalVisibleDeleteToken] = useState(false);
  ////////////////////////////////////////
  const [countryCode, setCountryCode] = useState("");
  const [callingCode, setCallingCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isValid, setIsValid] = useState(true);
  const refRBSheet = useRef()
console.log(currentPassword,newPassword,confirmNewPassword,countryCode,callingCode,phoneNumber);

  const handleToggleModal = (value)=>{
    setModalVisible(value)
  }

  const validatePhoneNumber = (number, country) => {
    if (number.trim() === "") {
      setIsValid(true);
      return;
    }
    try {
      const phoneNumberObj = parsePhoneNumberFromString(number, country);
      if (phoneNumberObj && phoneNumberObj.isValid()) {
        setIsValid(true);
      } else {
        setIsValid(false);
      }
    } catch (error) {
      setIsValid(false);
    }
  };

  const handlePhoneNumberChange = (text) => {
    setPhoneNumber(text);
    const formattedNumber = new AsYouType(countryCode).input(text);
    setPhoneNumber(formattedNumber);
    validatePhoneNumber(formattedNumber, countryCode);
  };

  const handleCountryCodeChange = (c) => {
    setCountryCode(c.cca2);
    setCallingCode(`+${c.callingCode[0]}`);
    validatePhoneNumber(phoneNumber, c.cca2);
  };

  useEffect(() => {
    validatePhoneNumber(phoneNumber, countryCode);
  }, [phoneNumber, countryCode]);

  useEffect(() => {
    if (userData?.phoneNumber) {
      const [code, ...numberParts] = userData.phoneNumber.split(" ");
      setCallingCode(code);
      setPhoneNumber(numberParts.join(" "));
      const phoneNumberObject = parsePhoneNumberFromString(
        userData.phoneNumber
      );
      if (phoneNumberObject) {
        setCountryCode(phoneNumberObject.country);
      }
    }
  }, [userData]);
  ///////////////////////////////////////
  const changeModalVisible = (value) => {
    setModalVisibleDeleteToken(value);
  };
  const handleErrors = (value) => {
    setErrors(value);
  };

  // const [isArchived,setIsArchived]=useState(userData.isArchived)
  // console.log('9esm el archive',userData.isArchived)

  const handleInputChange = (field, value) => {
    setEditableUserData((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const verifyChangePassword = async () => {
    const id = await AsyncStorage.getItem("userId");

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2:
          "Please enter current password, new password, and confirm password",
      });
      return;
    }

    if (newPassword !== confirmNewPassword) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "New password and confirm password do not match",
      });
      return;
    }

    if (
      errors.currentPassword.length > 0 ||
      errors.newPassword.length > 0 ||
      errors.confirmNewPassword.length > 0
    ) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Passwords do not meet the required criteria",
      });
      return;
    }

    try {
      const response = await axios.post(
        `http://${process.env.EXPO_PUBLIC_SERVER_IP}:5000/api/users/changePasswordCRMVerif`,
        {
          id,
          currentPassword,
          newPassword,
          confirmPassword: confirmNewPassword,
        }
      );

      if (response.status === 200) {
        // Toast.show({ type: 'success', text1: 'Success', text2: 'Password changed successfully' });
        setModalVisibleDeleteToken(true);
      }
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data.error;

        if (status === 400) {
          Toast.show({
            type: "error",
            text1: "Error",
            text2:
              "Please provide id, current password, new password, and confirm password",
          });
        } else if (status === 422) {
          if (message === "New password and confirm password do not match") {
            Toast.show({
              type: "error",
              text1: "Error",
              text2: "New password and confirm password do not match",
            });
          } else if (message === "Current password is incorrect") {
            Toast.show({
              type: "error",
              text1: "Error",
              text2: "Current password is incorrect",
            });
          } else if (
            message === "New password must be different from current password"
          ) {
            Toast.show({
              type: "error",
              text1: "Error",
              text2: "New password must be different from current password",
            });
          } else {
            Toast.show({
              type: "error",
              text1: "Error",
              text2: "Unprocessable Entity",
            });
          }
        } else if (status === 404) {
          Toast.show({
            type: "error",
            text1: "Error",
            text2: "User not found",
          });
        } else {
          Toast.show({
            type: "error",
            text1: "Error",
            text2: "Internal server error. Please try again later.",
          });
        }
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Network error. Please check your internet connection.",
        });
      }
    }
  };

  const updatePhoneNumber = async () => {
    const id = await AsyncStorage.getItem("userId");

    setLoading(true); 

    try {
      const response = await axios.put(`http://${process.env.EXPO_PUBLIC_SERVER_IP}:5000/api/users/updatePhoneNumber`, {
        id,
        phoneNumber: `${callingCode} ${phoneNumber}`
      });

      if (response.status === 200) {
        Toast.show({ type: 'success', text1: 'Success', text2: 'Phone updated successfully' });
        // await navigation.navigate("NewHome")
      }
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        if (status === 404) {
          Toast.show({ type: 'error', text1: 'Error', text2: 'User not found' });
        } else if (status === 400) {
          Toast.show({ type: 'error', text1: 'Error', text2: 'User ID and phone number are required' });
        } else {
          Toast.show({ type: 'error', text1: 'Error', text2: 'Internal server error. Please try again later.' });
        }
      } else {
        Toast.show({ type: 'error', text1: 'Error', text2: 'Network error. Please check your internet connection.' });
      }
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // const onUpdate = async () => {
  //   try {
  //     const Id = await AsyncStorage.getItem("userId");
  //     const response = await axios.put(
  //       `http://${process.env.EXPO_PUBLIC_SERVER_IP}:5000/api/users/update/${Id}`,
  //       editableUserData
  //     );

  //     if (response.status === 201) {
  //       if (JSON.stringify(editableUserData) === JSON.stringify(userData)) {
  //         Toast.show({
  //           type: "info",
  //           text1: "No Changes!",
  //           text2: "Your info remains the same.",
  //         });
  //       } else {
  //         Toast.show({
  //           type: "success",
  //           text1: "Updated!",
  //           text2: "Your info has been updated successfully!",
  //         });
  //         navigation.navigate("NewProfile");
  //       }
  //     }
  //   } catch (error) {
  //     if (error.response && error.response.status === 404) {
  //       Toast.show({
  //         type: "error",
  //         text1: "Couldn't update :(",
  //         text2: "Something went wrong. Please retry!",
  //       });
  //     } else {
  //       console.error("Error updating user data:", error);
  //       Toast.show({
  //         type: "error",
  //         text1: "Error!",
  //         text2:
  //           "An error occurred while updating user data. Please try again later!",
  //       });
  //     }
  //   }
  // };

  const handleApiError = (error) => {
    if (error.response) {
      const status = error.response.status;
      if (status === 404) {
        Toast.show({ type: 'error', text1: 'Error', text2: 'User not found' });
      } else if (status === 400) {
        Toast.show({ type: 'error', text1: 'Error', text2: 'User ID and phone number are required' });
      } else {
        Toast.show({ type: 'error', text1: 'Error', text2: 'Internal server error. Please try again later.' });
      }
    } else {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Network error. Please check your internet connection.' });
    }
  };

  const handleDeleteAccount = () => {
    // setModalVisible(true);
    refRBSheet.current.open()
  };
  const handleSubmit = async () => {
    const phone = `${callingCode} ${phoneNumber}`;
  
    const hasPhoneChanged = userData.phoneNumber !== phone;
    const hasPasswordChanged = currentPassword && newPassword && confirmNewPassword;
  
    if (!isValid) {
      Toast.show({
        type: "error",
        text1: "Phone number",
        text2: "Invalid phone number",
      });
      return;
    }
  
    if (currentPassword || newPassword || confirmNewPassword) {
      if (
        errors.currentPassword.length > 0 ||
        errors.newPassword.length > 0 ||
        errors.confirmNewPassword.length > 0
      ) {
        Toast.show({
          type: "error",
          text1: "Password fields",
          text2: "Passwords do not meet the required criteria",
        });
        return;
      }
  
      if (newPassword !== confirmNewPassword) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "New password and confirm password do not match",
        });
        return;
      }
    }
  
    if (!hasPhoneChanged && !hasPasswordChanged) {
      Toast.show({
        type: "info",
        text1: "No Changes",
        text2: "Your information remains the same.",
      });
      return;
    }
  
    setLoading(true);
  
    try {
      if (hasPhoneChanged) {
        await updatePhoneNumber();
      }
  
      if (hasPasswordChanged) {
        await verifyChangePassword();
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogOut = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      console.log("No token found");
      setLoading(false);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "No token found",
      });
      return;
    }

    try {
      const response = await axios.post(
        `http://${process.env.EXPO_PUBLIC_SERVER_IP}:5000/api/users/deconnection`,
        { token }
      );

      if (response.status === 200) {
        await AsyncStorage.removeItem("token");
        await AsyncStorage.removeItem("userId");
        await setLoginData(false);
        await navigation.navigate("Welcome");
        await console.log("deconnection LoginData:", logindata);
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Logged out successfully",
        });
      }
    } catch (error) {
      console.error("Error logging out:", error);
      if (error.response) {
        const { status, data } = error.response;
        if (status === 404) {
          console.log("Error logging out:", data.error);
          Toast.show({
            type: "error",
            text1: "Error",
            text2: "Token not found",
          });
        } else if (status === 403) {
          console.log("Error logging out:", data.error);
          Toast.show({
            type: "error",
            text1: "Error",
            text2: "Invalid token",
          });
        } else {
          console.log("Error logging out:", data.error);
          Toast.show({
            type: "error",
            text1: "Error",
            text2: "Unknown error occurred",
          });
        }
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Internal server error",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleErrorss = (error) => {
    if (error.response) {
      const status = error.response.status;
      if (status === 404) {
        Toast.show({ type: 'error', text1: 'Error', text2: 'User not found' });
        console.log("User not found");
      } else if (status === 500) {
        // Toast.show({ type: 'error', text1: 'Error', text2: 'Internal server error. Please try again later.' });
        console.log("Internal server error");
      } else {
        // Toast.show({ type: 'error', text1: 'Error', text2: 'An unknown error occurred. Please try again.' });
        console.log("Unknown error");
      }
    } else {
      // Toast.show({ type: 'error', text1: 'Error', text2: 'Network error. Please check your internet connection.' });
      console.log("Network error");
    }
  };

  const logoutFromDevices = async () => {

    setLoading(true); 
    const id = await AsyncStorage.getItem("userId")
    try {
      const response = await axios.post(`http://${process.env.EXPO_PUBLIC_SERVER_IP}:5000/api/users/idDeconnectionFromAllDevices`, { id });
  
      if (response.status === 200) {
        // Toast.show({
        //   type: 'success',
        //   text1: 'Success',
        //   text2: 'All devices logged out successfully!',
        // });
        console.log("All devices logged out successfully!");
      }
    } catch (error) {
      handleErrorss(error);
    } finally {
      setLoading(false)
    }
  };

  const handleConfirmDelete = async () => {
    try {
      const Id = await AsyncStorage.getItem("userId"); // Add await here
      console.log(Id);
      const deleted = await axios.put(
        `http://${process.env.EXPO_PUBLIC_SERVER_IP}:5000/api/users/update/${Id}`,
        { isArchived: true }
      );
      console.log(deleted);
      if (deleted.status === 201) {
        await logoutFromDevices()
        setModalVisible(false);
        // await handleLogOut();
        await AsyncStorage.removeItem("token");
        await AsyncStorage.removeItem("userId");
        await setLoginData(false);
        await navigation.navigate("Welcome");
        await console.log("deconnection LoginData:", logindata);
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Logged out successfully",
        });
      }
      
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancelDelete = () => {
    setModalVisible(false);
  };

  const changeCurrentPassword = (e) => {
    setCurrentPassword(e);
  };
  const changeNewPassword = (e) => {
    setNewPassword(e);
  };
  const changeConfirmNewPassword = (e) => {
    setConfirmNewPassword(e);
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
        paddingBottom: height * 0.05,
      }}
    >
      <View>
        <Pressable
          style={styles.arrowContainer}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back-circle" size={45} color="black" />
        </Pressable>
      </View>

      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.title}>My information</Text>
          <UnderlinedInputs
            userData={userData}
            editableUserData={editableUserData}
            onInputChange={handleInputChange}
            changeConfirmNewPassword={changeConfirmNewPassword}
            changeNewPassword={changeNewPassword}
            changeCurrentPassword={changeCurrentPassword}
            currentPassword={currentPassword}
            newPassword={newPassword}
            confirmNewPassword={confirmNewPassword}
            verifyChangePassword={verifyChangePassword}
            handleErrors={handleErrors}
            errors={errors}
            modalVisible={modalVisibleDeletToken}
            changeModalVisible={changeModalVisible}
            handlePhoneNumberChange={handlePhoneNumberChange}
            handleCountryCodeChange={handleCountryCodeChange}
            isValid={isValid}
            phoneNumber={phoneNumber}
            callingCode={callingCode}
            countryCode={countryCode}
          />
        </View>
      </ScrollView>
      <View
        // style={{
        //   gap: 60,
        // }}
        style={styles.containerButtum}
      >
        <Pressable
          onPress={handleDeleteAccount}
          android_ripple={{ color: "transparent" }}
          style={styles.btnDeleteAccount}
        >
          <Text style={styles.deleteAccountText}>Delete account</Text>
        </Pressable>
        <TouchableOpacity
          style={styles.find}
          // onPress={() => verifyChangePassword()}
          onPress={() => handleSubmit()}
        >
          <Text style={styles.textButton}>Submit</Text>
        </TouchableOpacity>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Are you sure you want to delete your account?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.deleteButton]}
                onPress={handleConfirmDelete}
              >
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={handleCancelDelete}
              >
                <Text style={styles.buttonTextCancel}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <PasswordDeleteAccountSheet refRBSheet={refRBSheet} handleToggleModal={handleToggleModal} />
    </View>
  );
};

export default MyInformation;

const styles = StyleSheet.create({
  arrowContainer: {
    resizeMode: "contain",
    paddingHorizontal: width * 0.06,
    paddingVertical:Platform.OS==="android"?height * 0.025: height * 0.06,
  },
  header: {
    borderBottomWidth: 0.2,
    borderBottomColor: "#ccc",
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  container: {
    paddingHorizontal: width * 0.05,
  },
  deleteAccountText: {
    color: "red",
    fontWeight: "700",
    alignSelf: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    alignContent: "center",
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    minWidth: 100,
    textAlign: "center",
  },
  deleteButton: {
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    width:"40%"
  },
  cancelButton: {
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    width:"40%"
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  find: {
    width: width * 0.93,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    height: height * 0.065,
    backgroundColor: "black",
    borderRadius: 15,
  },
  textButton: {
    color: "white",
    fontSize: 15,
    fontWeight: "700",
  },
  buttonTextCancel: {
    color: "black",
    fontSize: 15,
    fontWeight: "700",
  },
  btnDeleteAccount:{
    // paddingTop:50
  },
  containerButtum:{
    height:height*0.15,
    justifyContent:"space-around"
  }
});
