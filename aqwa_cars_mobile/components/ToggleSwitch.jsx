import React, { useState } from 'react';
import { Switch, View, StyleSheet,Dimensions } from 'react-native';
const { width, height } = Dimensions.get("window");
const ToggleSwitch = ({ isEnabled, onToggle }) => {
  const toggleSwitch = () => {
    onToggle(!isEnabled);
  };

  return (
    <View style={styles.toggle}>
      <Switch
        trackColor={{ false: "#ccc", true: "#8c52ff" }}
        thumbColor={isEnabled ? "#fff" : "#fff"}
        ios_backgroundColor="#ccc"
        onValueChange={toggleSwitch}
        value={isEnabled}
        style={styles.toggleSwitch}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  toggle: {
    // position: 'relative',
    width: width*0.17,
    // height: height*0.01,
    // backgroundColor:'red'
  },
  toggleSwitch: {
    // position: 'absolute',
    // top: 0,
    // left: 0,
  },
});

export default ToggleSwitch;