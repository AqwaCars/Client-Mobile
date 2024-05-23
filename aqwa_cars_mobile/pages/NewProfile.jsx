import React, { useState,useContext, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Pressable, Dimensions, ScrollView, Image, ImageBackground, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import NavTab from '../components/NavBar';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import Toast from 'react-native-toast-message';
const { height, width } = Dimensions.get("screen");
import {LoginContext} from "../context/AuthContext.jsx"
import { useDispatch, useSelector } from 'react-redux';
import { getOneById } from '../store/userSlice.js';
import ReviewSheet from '../components/ReviewSheet.jsx';
const NewProfile = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
 const refRBSheet = useRef()
  const [loading, setLoading] = useState(false);
  const  [data,setData] = useState({})
  const { logindata,setLoginData } = useContext(LoginContext);


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


  const getUser = async () => {
    try {
      const Id = await AsyncStorage.getItem('userId');
      console.log("chawchaw", Id);
      const getData = await dispatch(getOneById(Id))
      setData(getData.payload)
    } catch (error) {
      console.error("Error retrieving user ID:", error);
    }
  }

  useEffect ( ()=>{
    getUser()
  },[])



  return (
    <View style={{ flex: 1 }}>
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      <ScrollView contentContainerStyle={styles.scroll}>
        <ImageBackground resizeMode='cover' style={styles.bg} source={require('../assets/profilePic.jpeg')}>
          <Pressable style={styles.arrowContainer} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back-circle" size={45} color="white" />
          </Pressable>
          <Image style={styles.logo} source={require('../assets/aqwaBlack.png')} />
          { logindata ? <View style={styles.secondRow}>
            <Text style={styles.title}>Hello,</Text>
            <Text style={styles.title}>{data?.userName}</Text>
          </View> : <View style={styles.secondRow}>
            <Text style={styles.title}>Welcome,</Text>
            <Text style={styles.title}>To aqwa cars</Text>
          </View> }
        </ImageBackground>
        {logindata ?<Text style={styles.information}>Personal Information</Text> : null}
        {logindata ? <View style={styles.container}>
          <Pressable style={styles.button} onPress={() => navigation.navigate('BookingHistory')}>
            <Ionicons name="calendar" size={25} color="black" />
            <Text style={styles.titleIcon}>Bookings</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={() => navigation.navigate('MyInformation',{data})}>
            <Ionicons name="person" size={25} color="black" />
            <Text style={styles.titleIcon}>My Information</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={handleLogOut}>
            <Ionicons name="log-out" size={25} color="black" />
            <Text style={styles.titleIcon}>Logout</Text>
          </Pressable> 
        </View>: null}
        <Text style={styles.information}>Support</Text>
        <View style={styles.container}>
          <Pressable style={styles.button} onPress={() => navigation.navigate('FAQS')}>
            <Ionicons name="help-circle" size={25} color="black" />
            <Text style={styles.titleIcon}>FAQs</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={()=>refRBSheet.current.open()}>
            <Ionicons name="book" size={25} color="black" />
            <Text style={styles.titleIcon}>Legal</Text>
          </Pressable>
        </View>
        <ReviewSheet refRBSheet={refRBSheet}/>
      </ScrollView>
      <NavTab />
    </View>
  );
};

export default NewProfile;

const styles = StyleSheet.create({
  bg: {
    height: height * 0.4,
    overflow: 'hidden',
    justifyContent: 'space-between'
  },
  arrowContainer: {
    paddingHorizontal: width * 0.06,
    paddingVertical: height * 0.06
  },
  footerDetails: {
    fontSize: 12,
    color: 'white',
    fontWeight: "300",
  },
  logo: {
    position: 'absolute',
    top: -10,
    left: 60,
    width: width * 0.7,
    height: height * 0.2
  },
  title: {
    fontSize: 22,
    color: 'white',
    fontWeight: '900',
    textShadowColor: 'black',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  secondRow: {
    height: height * 0.078,
    paddingHorizontal: width * 0.05,
    gap: 5,
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e0e0e0',
    width: width * 0.4,
    height: height * 0.15,
    margin: 10,
    borderRadius: 10,
  },
  titleIcon: {
    marginTop: 8,
    fontSize: 16,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '500'
  },
  information: {
    fontSize: 22,
    color: 'black',
    fontWeight: '900',
    paddingHorizontal: width * 0.06,
    paddingVertical: height * 0.015
  },
  scroll: {
    paddingBottom: height * 0.05,
  }
});
