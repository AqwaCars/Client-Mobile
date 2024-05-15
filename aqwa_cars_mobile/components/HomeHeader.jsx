import React, { useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Animated,Dimensions,Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
const { width, height } = Dimensions.get('window');

const HomeHeader = () => {
  const navigation = useNavigation();
  const fadeInAnim = useRef(new Animated.Value(0)).current;

  const animateGreetingText = () => {
    Animated.timing(fadeInAnim, {
      toValue: 1,
      duration: 2500, // Adjust the duration as needed
      useNativeDriver: true,
    }).start();
  };
  // Animation value for the header
  const headerAnim = new Animated.Value(0);

  // Function to animate the header
  const animateHeader = () => {
    Animated.timing(headerAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  // Call the animateHeader function when the component mounts
  useEffect(() => {
    animateHeader();
    animateGreetingText();

  }, []);

  // Interpolate the animation value for custom styles
  const headerStyles = {
    opacity: headerAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    }),
    transform: [
      {
        translateY: headerAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [-50, 0],
        }),
      },
    ],
  };

  return (
    <Animated.View style={[styles.container, headerStyles]}>
        <View style={styles.textCombo}>
      {/* <Text style={styles.hiText}>Welcome Back!</Text> */}
      <Animated.Text style={[styles.usernameText, { opacity: fadeInAnim }]}>
        Welcome Back!
      </Animated.Text>
      </View>
      
        <Image source={require('../assets/aqwaBlack.png')} style={styles.userIcon} />
      
    </Animated.View>
  );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        // justifyContent: 'space-between',
        alignItems:'flex-end',
        paddingHorizontal: 20,
        // paddingVertical: 10,
        backgroundColor: '#fff',
        // borderBottomWidth: 0.5,
        // borderBottomColor: '#ccc',
        height: height * 0.15,
        width: width * 1,

        ...Platform.select({
          ios: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 3,
          },
          android: {
            elevation: 5,
          },
        }),
      },
  hiText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000', 
  },
  usernameText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8c52ff', 
  },
  userIcon: {
    width: width*0.4,
    height: height*0.1,
    borderRadius: 100,
  },
  textCombo:{
    flexDirection:'row',
    paddingBottom:20,
    gap:5,
    maxWidth:"40%"
  }
});

export default HomeHeader;
