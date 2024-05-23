import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Dimensions, Pressable, TextInput, TouchableOpacity } from 'react-native';
import LottieView from 'lottie-react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { Feather } from 'react-native-vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios  from 'axios';
import Toast from 'react-native-toast-message';
const { height, width } = Dimensions.get("screen");

const PasswordDeleteAccountSheet = ({ refRBSheet,handleToggleModal }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState(""); 

  const verifPasswordDelete = async () => {
    const id = await AsyncStorage.getItem("userId");
    try {
      const response = await axios.post(`http://${process.env.EXPO_PUBLIC_SERVER_IP}:5000/api/users/verifPassword`, {
        id: id,
        pass: password
      });
      if (response.status === 200) {
        await setPassword("")
        await refRBSheet.current.close();
        await handleToggleModal(true)
        await Toast.show({ type: 'success', text1: 'Success', text2: 'Password is correct' });
      }
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        if (status === 400) {
          Toast.show({ type: 'error', text1: 'Error', text2: 'Please provide your password' });
          await setPassword("")
        } else if (status === 404) {
          Toast.show({ type: 'error', text1: 'Error', text2: 'User not found' });
          await setPassword("")
        } else if (status === 422) {
          Toast.show({ type: 'error', text1: 'Error', text2: 'Password is incorrect' });
          await setPassword("")
        } else {
          Toast.show({ type: 'error', text1: 'Error', text2: 'Something went wrong. Please try again later' });
          await setPassword("")
        }
      } else {
        Toast.show({ type: 'error', text1: 'Error', text2: 'Network error. Please check your internet connection' });
      }
    }
  }

  const handlePasswordChange = (text) => {
    setPassword(text);
  };

  return (
    <RBSheet
      ref={refRBSheet}
      height={360}
      openDuration={250}
      closeDuration={250}
      closeOnDragDown={true}
      closeOnPressBack={true}
      closeOnPressMask={true}
      customStyles={{
        wrapper: {
          backgroundColor: "rgba(0,0,0,0.5)",
        },
        draggableIcon: {
          backgroundColor: "#d5d5d5",
          width: 60,
        },
        container: {
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
        },
      }}
    >
      <View style={styles.container}>
        <LottieView
          source={require('../assets/animations/passwordDelete.json')}
          autoPlay
          loop={true}
          style={styles.lottie}
        />
        <Text style={styles.text}>Provide your password to proceed with the account deletion</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.FirstInputPass}
            placeholder="Type Your Password"
            placeholderTextColor={"#cccccc"}
            secureTextEntry={!showPassword}
            onChangeText={handlePasswordChange} // Pass the handlePasswordChange function to onChangeText
            value={password} // Bind the value of the input field to the password state
          />
          <TouchableOpacity
            style={styles.eyeIconContainer}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Feather
              name={showPassword ? "eye" : "eye-off"}
              size={20}
              color="#cccccc"
            />
          </TouchableOpacity>
        </View>
        <Pressable
          onPress={() => {
            // refRBSheet.current.close();
            verifPasswordDelete()
          }}
          style={styles.find}
        >
          <Text style={styles.textButton}>Delete Account</Text>
        </Pressable>
      </View>
    </RBSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  lottie: {
    width: 150,
    height: 150,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    paddingBottom: 20,
    fontWeight: "500"
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "95%",
    marginBottom: 20,
    borderColor: "gray",
    borderBottomWidth: 1,
    position: "relative",
  },
  FirstInputPass: {
    flex: 1,
    height: Dimensions.get("window").height * 0.05,
    color: "black",
    padding: 5,
    borderRadius: 5,
    width:"80%"
  },
  eyeIconContainer: {
    position: "absolute",
    top: "50%",
    right: 10,
    transform: [{ translateY: -12 }],
  },
  find: {
    width: width * 0.93,
    alignItems: 'center',
    justifyContent: 'center',
    height: height * 0.065,
    backgroundColor: 'black',
    borderRadius: 15,
  },
  textButton: {
    color: 'white',
    fontSize: 15,
    fontWeight: '700',
  },
});

export default PasswordDeleteAccountSheet;
