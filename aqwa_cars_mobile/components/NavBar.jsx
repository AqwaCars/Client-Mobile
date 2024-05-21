import React, { useState, useEffect,useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Animated, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {LoginContext} from '../context/AuthContext.jsx'
const { width, height } = Dimensions.get("window");

const NavTab = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [slideAnim] = useState(new Animated.Value(0)); // Initialize slideAnim with 0
  const position = {
    NewHome: 0,
    Search: width * 0.25,
    BookingHistory: width * 0.5,
    NewProfile: width * 0.75,
  };
  const { logindata, setLoginData } = useContext(LoginContext);

  const verifyUser = async () => {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      console.log('No token found');
      const tok =await AsyncStorage.removeItem("token");
      const id = await AsyncStorage.removeItem("userId");
      await setLoginData(false);
      console.log('prrrrr',id,tok)
      // await navigation.navigate("Welcome");
    } else {
      try {
        const response = await axios.post(`http://${process.env.EXPO_PUBLIC_SERVER_IP}:5000/api/users/VerifyUser`, { token });
        if (response.status === 200) {
          setLoginData(true);
        }
      } catch (error) {
        if (error.response) {
          const { status, data } = error.response
          if (status === 404) {
            await AsyncStorage.removeItem("token");
            await AsyncStorage.removeItem("userId");
            await setLoginData(false);
            await navigation.navigate("Welcome");
          }
        } else {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Internal server error',
          });
          
        }
      }
    }

  };
  useEffect(() => {
  
    verifyUser();
  }, []);
  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: position[route.name],
      useNativeDriver: false,
      bounciness: 10,
    }).start();
    verifyUser();

  }, [route, slideAnim, position]);

  const handlePress = (tabName) => {
    navigation.navigate(tabName);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.tab} onPress={() => handlePress('NewHome')}>
        <Icon name="home" size={20} color={route.name === 'NewHome' ? '#8c52ff' : '#bdbdbd'} />
        {route.name === 'NewHome' && <Text style={[styles.tabText, { color: '#8c52ff' }]}>Home</Text>}
      </TouchableOpacity>
      <TouchableOpacity style={styles.tab} onPress={() => handlePress('Search')}>
        <Icon name="search" size={20} color={route.name === 'Search' ? '#8c52ff' : '#bdbdbd'} />
        {route.name === 'Search' && <Text style={[styles.tabText, { color: '#8c52ff' }]}>Search</Text>}
      </TouchableOpacity>
      <TouchableOpacity style={styles.tab} onPress={() => handlePress('BookingHistory')}>
        <Icon name="history" size={20} color={route.name === 'BookingHistory' ? '#8c52ff' : '#bdbdbd'} />
        {route.name === 'BookingHistory' && <Text style={[styles.tabText, { color: '#8c52ff' }]}>History</Text>}
      </TouchableOpacity>
      <TouchableOpacity style={styles.tab} onPress={() => handlePress('NewProfile')}>
        <Icon name="person" size={20} color={route.name === 'NewProfile' ? '#8c52ff' : '#bdbdbd'} />
        {route.name === 'NewProfile' && <Text style={[styles.tabText, { color: '#8c52ff' }]}>Profile</Text>}
      </TouchableOpacity>
      <Animated.View style={[styles.tabIndicator, { transform: [{ translateX: slideAnim }]}]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ebebeb',
    height: height * 0.09,
    width: width * 1,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    width: width * 0.25,
    height: height * 0.1
  },
  tabText: {
    fontSize: 14,
    marginTop: 4,
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#8c52ff',
    height: 3,
    width: width * 0.25,
  },
});

export default NavTab;
