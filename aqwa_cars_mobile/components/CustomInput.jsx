import { StyleSheet, Text, View, Animated } from "react-native";
import React, { useEffect, useState } from "react";
import { TextInput } from "react-native-paper";

const CustomInput = ({
  label,
  value,
  errorCondition,
  style,
  inputOnChange,
  keyboardType,
}) => {
  const [internalErrorMessage, setInternalErrorMessage] = useState("");
  const [error, setError] = useState(false);
  const shakeAnimation = new Animated.Value(0);

  const onChangeText = (newText) => {
    const errorResult = errorCondition(newText);
    setError(errorResult.error);
    setInternalErrorMessage(errorResult.errorMessage);
    inputOnChange(newText);
  };

  const shakeInput = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  };

  useEffect(() => {
    if (error) {
      shakeInput();
    }
  }, [error]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.inputContainer,
          { borderBottomColor: error ? "red" : "white" },
          {
            transform: [
              {
                translateX: shakeAnimation.interpolate({
                  inputRange: [-10, 10],
                  outputRange: [-5, 5],
                }),
              },
            ],
          },
        ]}
      >
        <TextInput
          label={label}
          value={value}
          onChangeText={onChangeText}
          style={[styles.input,style]}
          error={error}
          keyboardType={keyboardType}
          theme={{
            colors: {
              primary: "white",
              text: "white",
              background: "transparent",
            },
          }}
          underlineColor="transparent"
          selectionColor="white"
          underlineColorAndroid="transparent"
        />
      </Animated.View>
      {error && <Text style={styles.errorText}>{internalErrorMessage}</Text>}
    </View>
  );
};

export default CustomInput;

const styles = StyleSheet.create({
  container: {},
  inputContainer: {
    backgroundColor: "transparent",
    paddingHorizontal: 0,
    marginHorizontal: 0,
    width: "100%",
    paddingTop: 10,
    color:"white"
  },
  input: {
    color: "white",
    backgroundColor: "transparent",
    paddingHorizontal: 12,
    paddingVertical: 8,
    width: "100%",
    color:"white"

  },
  errorText: {
    color: "red",
    marginTop: 5,
  },
});