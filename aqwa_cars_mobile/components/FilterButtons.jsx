import React, { useState } from 'react';
import { View, FlatList, Text, Pressable, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons from expo/vector-icons

const { height, width } = Dimensions.get("screen");

const FilterButtons = () => {
  const [selectedButton, setSelectedButton] = useState(null); // State to keep track of selected button

  // Sample data for buttons
  const buttonsData = [
    { id: '1', title: 'Filter & Sort', icon: 'options' }, // Add icon name for each button
    { id: '2', title: 'Automatic Transmission', icon: 'car' },
    { id: '3', title: 'Economic Class', icon: 'cash' },
    { id: '4', title: 'Luxury Car', icon: 'star' },
  ];

  // Render individual button item
  const renderButton = ({ item }) => (
    <Pressable
      style={[
        styles.button,
        selectedButton === item.id && { backgroundColor: '#8c52ff' } // Change background color if button is selected
      ]}
      onPress={() => handleButtonPress(item.id)} // Call handleButtonPress function when button is pressed
    >
      {/* Ionicons component for the icon */}
      <Ionicons name={item.icon} size={20} color={selectedButton === item.id ? 'white' : 'black'} style={styles.icon} />
      <Text style={[styles.buttonText, selectedButton === item.id && { color: 'white' }]}>
        {item.title}
      </Text>
    </Pressable>
  );

  // Function to handle button press
  const handleButtonPress = (buttonId) => {
    setSelectedButton(buttonId); // Update selectedButton state with the id of the pressed button
    console.log('Selected Button:', buttonId); // Log the selected button
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={buttonsData}
        renderItem={renderButton}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width * 0.9,
    marginTop: 20,
    marginBottom: 10,
  },
  button: {
    flexDirection: 'row', // Align icon and text horizontally
    backgroundColor: '#ECECEC',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginRight: 10,
    height: height * 0.05,
    alignItems: 'center', // Align items vertically in the center
  },
  buttonText: {
    fontWeight: 'bold',
    marginLeft: 5, // Add some space between icon and text
  },
  icon: {
    marginRight: 5, // Add some space between icon and text
  },
});

export default FilterButtons;