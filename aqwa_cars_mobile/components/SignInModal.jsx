import React from 'react';
import { View, Text, Button, StyleSheet, Pressable,Dimensions } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
const { height, width } = Dimensions.get("screen");

const SignInModal =(({bottomSheetRef}) => {
  const navigation = useNavigation();

  return (
    <RBSheet
      ref={bottomSheetRef}
      closeDuration={250}
      draggable={true}
      closeOnDragDown={true}
      closeOnPressBack={true}
      closeOnPressMask={true}
      height={400}
      openDuration={250}
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
          source={require('../assets/Warning.json')}
          autoPlay
          loop={true}
          style={styles.lottie}
        />
        <Text style={styles.text}>You're not Signed-in.Please consider registering or signing-in</Text>
        <Pressable
        //   title="Go to NewHome"
          onPress={() => {
            bottomSheetRef.current.close();
            navigation.navigate('Welcome');
          }}
          style={styles.find}
        >
            <Text style={styles.textButton}>Go to welcome page</Text>
            </Pressable>
      </View>
    </RBSheet>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    
  },
  lottie: {
    width: width*0.6,
    height: height*0.2,
  },
  text: {
    fontSize: 16,
    fontWeight:'900',
    textAlign: 'center',
    marginVertical: 20,
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

export default SignInModal;
