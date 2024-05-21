import React from 'react';
import { View, Text, Button, StyleSheet,Dimensions,Pressable } from 'react-native';
import LottieView from 'lottie-react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { useNavigation } from '@react-navigation/native';
const { height, width } = Dimensions.get("screen");

const ValidationSheet = (({refRBSheet}) => {
  const navigation = useNavigation();

  return (
    <RBSheet
      ref={refRBSheet}
      height={300}
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
          source={require('../assets/Done.json')}
          autoPlay
          loop={true}
          style={styles.lottie}
        />
        <Text style={styles.text}>Your request has been submitted successfully. Please wait for admin approval.</Text>
        <Pressable
        //   title="Go to NewHome"
          onPress={() => {
            refRBSheet.current.close();
            navigation.navigate('NewHome');
          }}
          style={styles.find}
        >
            <Text style={styles.textButton}>Go Home</Text>
            </Pressable>
      </View>
    </RBSheet>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  lottie: {
    width: 100,
    height: 100,
  },
  text: {
    fontSize: 16,
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

export default ValidationSheet;
