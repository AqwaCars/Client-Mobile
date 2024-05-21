import React, { useState,useContext } from 'react';
import { StyleSheet, Text, View, Pressable, Dimensions, ScrollView, Image, LayoutAnimation, Modal, TouchableOpacity,ActivityIndicator } from 'react-native';
import ArrowBack from '../assets/Svg/blackArrow.svg';
import UnderlinedInputs from '../components/UnderlinedInputs';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from "react-native-toast-message";
import { err } from 'react-native-svg';
import {LoginContext} from "../context/AuthContext.jsx"

const { height, width } = Dimensions.get("screen");

const MyInformation = ({route}) => {
  const navigation = useNavigation()
  const { logindata,setLoginData } = useContext(LoginContext);

  const userData= route.params.data
  const [loading, setLoading] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [editableUserData, setEditableUserData] = useState(userData);
  // const [isArchived,setIsArchived]=useState(userData.isArchived)
  // console.log('9esm el archive',userData.isArchived)

  const handleInputChange = (field, value) => {
    setEditableUserData(prevState => ({
      ...prevState,
      [field]: value,
    }));
  };



  const onUpdate = async () => {
    try {
      const Id = await AsyncStorage.getItem('userId');
      const response = await axios.put(`http://${process.env.EXPO_PUBLIC_SERVER_IP}:5000/api/users/update/${Id}`, editableUserData);
      
      if (response.status === 201) {
        if (JSON.stringify(editableUserData) === JSON.stringify(userData)) {
          Toast.show({
            type: 'info',
            text1: 'No Changes!',
            text2: 'Your info remains the same.',
          });
        } else {
  
          Toast.show({
            type: 'success',
            text1: 'Updated!',
            text2: 'Your info has been updated successfully!',
          });
          navigation.navigate('NewProfile')
        }
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {

        Toast.show({
          type: 'error',
          text1: 'Couldn\'t update :(',
          text2: 'Something went wrong. Please retry!',
        });
      } else {
        console.error('Error updating user data:', error);
        Toast.show({
          type: 'error',
          text1: 'Error!',
          text2: 'An error occurred while updating user data. Please try again later!',
        });
      }
    }
  };
  

  const handleDeleteAccount = () => {
    setModalVisible(true);
  };


  const handleLogOut = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      console.log('No token found');
      setLoading(false);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'No token found',
      });
      return;
    }

    try {
      const response = await axios.post(`http://${process.env.EXPO_PUBLIC_SERVER_IP}:5000/api/users/deconnection`, { token });

      if (response.status === 200) {
        await AsyncStorage.removeItem("token");
        await AsyncStorage.removeItem("userId");
        await setLoginData(false)
       await navigation.navigate('Welcome');
        await console.log("deconnection LoginData:",logindata);
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Logged out successfully',
        });
      }
    } catch (error) {
      console.error('Error logging out:', error);
      if (error.response) {
        const { status, data } = error.response;
        if (status === 404) {
          console.log('Error logging out:', data.error);
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Token not found',
          });
        } else if (status === 403) {
          console.log('Error logging out:', data.error);
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Invalid token',
          });
        } else {
          console.log('Error logging out:', data.error);
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Unknown error occurred',
          });
        }
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Internal server error',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      const Id = await AsyncStorage.getItem('userId'); // Add await here
      console.log(Id);
      const deleted = await axios.put(`http://${process.env.EXPO_PUBLIC_SERVER_IP}:5000/api/users/update/${Id}`, { isArchived: true });
      console.log(deleted);
      if (deleted.status === 201) {
        setModalVisible(false);
       await handleLogOut();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancelDelete = () => {
    setModalVisible(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white', paddingBottom: height * 0.05 }}>
      <View>
        <Pressable style={styles.arrowContainer} onPress={()=>navigation.goBack()}>
        <Ionicons name="arrow-back-circle" size={45} color="black" />
        </Pressable>
        </View>
      
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.title}>My information</Text>
          <UnderlinedInputs userData={userData} editableUserData={editableUserData} onInputChange={handleInputChange} />
        </View>
      </ScrollView>
      <View style={{
        gap:60
      }}>
      <Pressable onPress={handleDeleteAccount} android_ripple={{ color: 'transparent' }}>
        <Text style={styles.deleteAccountText}>Delete account</Text>
      </Pressable>
      <TouchableOpacity style={styles.find} onPress={()=>onUpdate(editableUserData)}>
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
    resizeMode:'contain',
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
  find: {
    width: width * 0.93,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf:'center',
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
