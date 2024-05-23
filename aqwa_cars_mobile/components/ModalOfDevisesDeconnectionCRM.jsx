import { StyleSheet, Text, View, Modal, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from "@react-navigation/native";
import Toast from 'react-native-toast-message';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ModalOfDevisesDeconnectionCRM = ({ modalVisible, changeModalVisible, currentPassword, newPassword, confirmNewPassword, errors }) => {
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
    setLoading(true);
    try {
      const id = await AsyncStorage.getItem('userId');
      const token = await AsyncStorage.getItem('token');
      const response = await axios.post(`http://${process.env.EXPO_PUBLIC_SERVER_IP}:5000/api/users/IdDeconnectionFromDevices`, { id, token });

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
      setLoading(false);
    }
  };

  const changePassword = async () => {
    setLoading(true);
    try {
      const id = await AsyncStorage.getItem('userId');
      if (!currentPassword || !newPassword || !confirmNewPassword) {
        Toast.show({ type: 'error', text1: 'Error', text2: 'Please enter current password, new password, and confirm password' });
        setLoading(false);
        return;
      }

      if (newPassword !== confirmNewPassword) {
        Toast.show({ type: 'error', text1: 'Error', text2: 'New password and confirm password do not match' });
        setLoading(false);
        return;
      }

      if (errors.currentPassword.length > 0 || errors.newPassword.length > 0 || errors.confirmNewPassword.length > 0) {
        Toast.show({ type: 'error', text1: 'Error', text2: 'Passwords do not meet the required criteria' });
        setLoading(false);
        return;
      }

      const response = await axios.post(
        `http://${process.env.EXPO_PUBLIC_SERVER_IP}:5000/api/users/changePasswordCRM`,
        {
          id,
          currentPassword,
          newPassword,
          confirmPassword: confirmNewPassword
        }
      );

      if (response.status === 200) {
        Toast.show({ type: 'success', text1: 'Success', text2: 'Password changed successfully' });
        navigation.navigate("NewHome");
      }
    } catch (error) {
      handleErrors(error);
    } finally {
      setLoading(false);
    }
  };

  const changePasswordWithLogout = async () => {
    setLoading(true);
    try {
      if (!newPassword || !confirmNewPassword || !currentPassword) {
        Toast.show({ type: 'error', text1: 'Error', text2: 'Please enter current password, new password and confirm password' });
        setLoading(false);
        return;
      }

      if (newPassword !== confirmNewPassword) {
        Toast.show({ type: 'error', text1: 'Error', text2: 'New password and confirm password do not match' });
        setLoading(false);
        return;
      }

      if (errors.currentPassword.length > 0 || errors.newPassword.length > 0 || errors.confirmNewPassword.length > 0) {
        Toast.show({ type: 'error', text1: 'Error', text2: 'Passwords do not meet the required criteria' });
        setLoading(false);
        return;
      }

      const id = await AsyncStorage.getItem('userId');
      const response = await axios.post(
        `http://${process.env.EXPO_PUBLIC_SERVER_IP}:5000/api/users/changePasswordCRM`,
        {
          id,
          currentPassword,
          newPassword,
          confirmPassword: confirmNewPassword
        }
      );

      if (response.status === 200) {
        Toast.show({ type: 'success', text1: 'Success', text2: 'Password changed successfully' });
        await logoutFromDevices();
        navigation.navigate("NewHome");
      }
    } catch (error) {
      handleErrors(error);
    } finally {
      setLoading(false);
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
                  <Text style={styles.modalText}>Do you want to log out from all other devices?</Text>
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
    fontWeight: "500"
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
