import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable, Dimensions, ScrollView, Image, LayoutAnimation, Modal, TouchableOpacity } from 'react-native';
import ArrowBack from '../assets/Svg/blackArrow.svg';
import UnderlinedInputs from '../components/UnderlinedInputs';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios  from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";

const { height, width } = Dimensions.get("screen");

const MyInformation = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const navigation = useNavigation()
console.log(currentPassword,newPassword,confirmNewPassword);
  const [modalVisible, setModalVisible] = useState(false);

 const changeCurrentPassword = (e)=>{
    setCurrentPassword(e)
  }
 const changeNewPassword = (e)=>{
    setNewPassword(e)
  }
 const changeConfirmNewPassword = (e)=>{
    setConfirmNewPassword(e)
  }

  const handleDeleteAccount = () => {
    setModalVisible(true);
  };

  const handleConfirmDelete = () => {
    setModalVisible(false);
  };

  const handleCancelDelete = () => {
    setModalVisible(false);
  };

  const verifyChangePassword = async () => {
    const id = await AsyncStorage.getItem("userId");
  
    try {
      const response = await axios.post(`http://${appConfig.PUBLIC_SERVER_IP}:5000/api/users/changePasswordCRMVerif`, {
        id,
        currentPassword,
        newPassword,
        confirmPassword: confirmNewPassword,
      });
  
      if (response.status === 200) {
        console.log(response.data.message);
        return;
      }
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
  
        if (status === 422 && data.error === 'New password and confirm password do not match') {
          Toast.show({
            type: 'error',
            text1: data.error,
          });
        } else if (status === 422 && data.error === 'Current password is incorrect') {
          Toast.show({
            type: 'error',
            text1: data.error,
          });
        } else if (status === 422 && data.error === 'New password must be different from current password') {
          Toast.show({
            type: 'error',
            text1: data.error,
          });
        } else {
          Toast.show({
            type: 'error',
            text1: 'An error occurred. Please try again later.',
          });
        }
      } else {
        Toast.show({
          type: 'error',
          text1: 'An error occurred. Please check your network connection and try again.',
        });
      }
    }
  };
  

  return (
    <View style={{ flex: 1, backgroundColor: 'white', paddingBottom: height * 0.05 }}>
      
        <Pressable style={styles.arrowContainer} onPress={()=>navigation.goBack()}>
        <Ionicons name="arrow-back-circle" size={45} color="black" />
        </Pressable>
      
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.title}>My information</Text>
          <UnderlinedInputs changeConfirmNewPassword={changeConfirmNewPassword} changeNewPassword={changeNewPassword} changeCurrentPassword={changeCurrentPassword} currentPassword={currentPassword} newPassword={newPassword} confirmNewPassword={confirmNewPassword} />
        </View>
      </ScrollView>
      <Pressable onPress={handleDeleteAccount} android_ripple={{ color: 'transparent' }}>
        <Text style={styles.deleteAccountText}>Delete account</Text>
      </Pressable>
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
            <Text style={styles.modalText}>Are you sure you want to delete your account?</Text>
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
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default MyInformation;

const styles = StyleSheet.create({
  arrowContainer: {
    paddingHorizontal: width*0.06,
    paddingVertical: height*0.06,
  },
  header: {
    borderBottomWidth: 0.2,
    borderBottomColor: '#ccc',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  container: {
    paddingHorizontal: width*0.05,
  },
  deleteAccountText: {
    color: 'red',
    fontWeight: '700',
    alignSelf: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 16,
    fontWeight:'600'
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    minWidth: 100,
    textAlign: 'center',
  },
  deleteButton: {
    backgroundColor: 'red',
  },
  cancelButton: {
    backgroundColor: 'gray',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
