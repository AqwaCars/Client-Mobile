import { StyleSheet, Text, View, Modal, TouchableOpacity,ActivityIndicator } from 'react-native';
import React,{useState} from 'react';
import { useNavigation } from "@react-navigation/native";
import Toast from 'react-native-toast-message'; 
import axios from 'axios';

const ModalOfDevisesDeconnectionCRM = ({ modalVisible, changeModalVisible, email, newPass, confirmPass, userEmail, changeEmailPassStates, passwordError, confirmPasswordError }) => {
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();
  const handleErrors = (error) => {
    if (error.response) {
      const status = error.response.status;
      if (status === 404) {
        Toast.show({ type: 'error', text1: 'Error', text2: 'User not found' });
      } else if (status === 500) {
        Toast.show({ type: 'error', text1: 'Error', text2: 'Internal server error. Please try again later.' });
      } else {
        Toast.show({ type: 'error', text1: 'Error', text2: 'An unknown error occurred. Please try again.' });
      }
    } else {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Network error. Please check your internet connection.' });
    }
  };
  const logoutFromDevices = async () => {
    setLoading(true); // Start loading
    try {
      const response = await axios.post(`http://${process.env.EXPO_PUBLIC_SERVER_IP}:5000/api/users/deconnectionFromDevices`, { email });
  
      if (response.status === 200) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'All devices logged out successfully!',
        });
      }
    } catch (error) {
      handleErrors(error);
    } finally {
      setLoading(false); // Stop loading
    }
  };
  

  const changePassword = async () => {
    if (!newPass || !confirmPass) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Please enter new password and confirm password' });
      return;
    }
  
    if (newPass !== confirmPass) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'New password and confirm password do not match' });
      return;
    }
  
    if (passwordError || confirmPasswordError) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Passwords do not meet the required criteria' });
      return;
    }
  
    setLoading(true);
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
        await userEmail("");
        await changeEmailPassStates("");
        await navigation.navigate("newLogIn");
      }
    } catch (error) {
      handleErrors(error);
    } finally {
      setLoading(false); // Stop loading
    }
  };
  

  const changePasswordWithLogout = async () => {
    if (!newPass || !confirmPass) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Please enter new password and confirm password' });
      return;
    }
  
    if (newPass !== confirmPass) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'New password and confirm password do not match' });
      return;
    }
  
    if (passwordError || confirmPasswordError) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Passwords do not meet the required criteria' });
      return;
    }
  
    setLoading(true); // Start loading
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
        await logoutFromDevices();
        await userEmail("");
        await changeEmailPassStates("");
      }
    } catch (error) {
      handleErrors(error);
    } finally {
      setLoading(false); // Stop loading
    }
  };
  

  return (
    <View style={styles.container}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          changeModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalBackground}>
          <View style={styles.centeredView}>
          <View style={styles.modalView}>
  {loading ? (
    <ActivityIndicator size="large" color="#0000ff" />
  ) : (
    <>
      <Text style={styles.modalText}>Do you want to log out from all devices?</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.yesButton}
          onPress={() => {
            changeModalVisible(!modalVisible);
            changePasswordWithLogout();
          }}
        >
          <Text style={styles.textStyle}>Yes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.noButton}
          onPress={() => {
            changeModalVisible(!modalVisible);
            changePassword();
          }}
        >
          <Text style={styles.textStyleNo}>No</Text>
        </TouchableOpacity>
      </View>
    </>
  )}
</View>

          </View>
        </View>
      </Modal>
    </View>
  );
}

export default ModalOfDevisesDeconnectionCRM

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredView: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
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
    textAlign: 'center',
    fontWeight:"500"
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  yesButton: {
    backgroundColor: 'black',
    borderRadius: 10,
    padding: 10,
    elevation: 6,
    marginHorizontal: 10,
    width: "40%"
  },
  noButton: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    elevation: 6,
    marginHorizontal: 10,
    width: "40%",
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  textStyleNo: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
