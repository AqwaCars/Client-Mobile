import React, { useState } from "react";
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity } from "react-native";

export default function Options({ navigation }) {
  const [selectedOption, setSelectedOption] = useState("bestPrice"); // Initialize selectedOption with "bestPrice"

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => setSelectedOption("bestPrice")}>
          <View style={[styles.radio, selectedOption === "bestPrice" && styles.radioActive]}>
            <Text style={styles.radioLabel}>Best price</Text>
            <Text style={styles.radioDescription}>Pay now, cancel and rebook for a fee</Text>
            {selectedOption === "bestPrice" && <View style={[styles.radioInput, styles.radioInputActive]} />}
          </View>
        </TouchableOpacity>
        <View style={[styles.radio, styles.disabledRadio]}>
          <Text style={[styles.radioLabel, styles.disabledLabel]}>Stay flexible (disabled)</Text>
          <Text style={[styles.radioDescription, styles.disabledDescription]}>Pay at pick-up,free cancellation and rebooking anytime</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  radio: {
    backgroundColor: "#fff",
    marginBottom: 12,
    padding: 16,
    borderRadius: 25,
    alignItems: "flex-start",
    borderWidth: 2,
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  radioActive: {
    borderColor: "#8c52ff",
  },
  radioLabel: {
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 1.2,
    color: "black",
    textTransform: "uppercase",
    marginBottom: 8,
  },
  radioDescription: {
    fontSize: 15,
    fontWeight: "500",
    color: "#848a96",
  },
  radioInput: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 24,
    height: 24,
    borderRadius: 9999,
    borderWidth: 2,
    borderColor: "transparent",
  },
  radioInputActive: {
    backgroundColor: "#8c52ff",
  },
  disabledRadio: {
    opacity: 0.5, // Reduced opacity to indicate disabled state
  },
  disabledLabel: {
    color: "#ccc", // Change text color to indicate disabled state
  },
  disabledDescription: {
    color: "#ccc", // Change text color to indicate disabled state
  },
});
