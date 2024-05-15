import React from 'react';
import { View, TextInput, StyleSheet,Dimensions, Image, Text } from 'react-native';
import Tunisia from '../assets/Svg/Tunisia.svg';
const { height, width } = Dimensions.get("screen");

const PhoneInput = () => {
  return (
    <View style={styles.phoneInput}>
      <View style={styles.flagContainer}>
        <Tunisia width={30} height={20} style={styles.flagIcon} />
        <Text style={styles.countryCode}>+216</Text>
      </View>
      <TextInput
        style={styles.input}
        keyboardType="phone-pad"
        placeholder="Phone Number"
        maxLength={8} // Excluding country code
      />
    </View>
  );
};

const styles = StyleSheet.create({
  phoneInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 40,
  },
  flagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  flagIcon: {
    marginRight: 5,
  },
  countryCode: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    flex: 1,
    height: height*0.06,
  },
});

export default PhoneInput;
