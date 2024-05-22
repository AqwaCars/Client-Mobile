import React, { useState } from 'react';
import { Pressable, View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; // Assuming you're using React Navigation
import NavTab from '../components/NavBar';

const { width, height } = Dimensions.get('window');

const AdvancedSearch = () => {
  const navigation = useNavigation(); // Hook for navigation
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFuelType, setSelectedFuelType] = useState('');
  const [selectedCarClass, setSelectedCarClass] = useState('');
  const [selectedTransmission, setSelectedTransmission] = useState('');
  const [IsFocused,setIsFocused]=useState(false)

  const fuelTypes = ['Diesel', 'Electric', 'Gasoline'];
  const carClasses = ['Economy', 'Compact', 'Premium ', 'SUV'];
  const transmissions = ['Automatic', 'Manual'];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: 'white',
    },
    searchBarContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'white',
      padding: 10,
      borderRadius: 10,
      marginBottom: 20,
      borderWidth:0.2
    },
    searchBar: {
      flex: 1,
      color: 'black',
      marginLeft: 10,
    },
    instructionsContainer: {
      marginBottom: 20,
    },
    instructionsText: {
      color: 'black',
      fontSize: 16,
      textAlign: 'center',
    },
    filterContainer: {
      marginBottom: 20,
    },
    filterTitle: {
      color: 'black',
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    buttonRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    button: {
      backgroundColor: '#ECECEC',
      padding: 10,
      borderRadius: 10,
      margin: 5,
    },
    buttonText: {
      color: 'black',
    },
    selectedButton: {
      backgroundColor: '#8c52ff',
      // borderColor: '#8c52ff',
      // borderWidth: 1,
    },
    selectedButtonText: {
      color: 'white',
    },
    searchButton: {
      width:width*0.9,
      backgroundColor: 'black',
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
      marginVertical: height*0.02,
    },
    searchButtonText: {
      color: 'white',
      fontSize: 18,
      fontWeight: 'bold',
    },
    arrowContainer: {
      paddingHorizontal: width * 0.06,
      paddingVertical: height * 0.02,
    },
    titleContainer:{
      marginTop:height*0.06,
      // alignItems:'center',
      paddingVertical: height * 0.02,
      paddingHorizontal: width * 0.06,
      justifyContent:'center',
      alignSelf:'flex-start'
    },
    Title:{
      fontSize: 22,
      color: 'black',
      fontWeight: '900',
     
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    searchInput: {
      flex: 1,
      height: height * 0.06,
      borderColor: IsFocused ? '#8c52ff' : 'gray',
      borderWidth: IsFocused ? 1.5 : 0.6,
      borderRadius: 15,
      paddingHorizontal: 10,
      paddingRight: 40,
    },
    iconContainer: {
        position: 'absolute',
        right: 10,
        flexDirection: 'row',
        alignItems: 'center',
        height: '100%',
      },
    
  });
  const handleFuelTypePress = (type) => {
    setSelectedFuelType(type);
  };

  const handleCarClassPress = (carClass) => {
    setSelectedCarClass(carClass);
  };

  const handleTransmissionPress = (type) => {
    setSelectedTransmission(type);
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white',
        alignItems:'center'
     }}>
      <View style={styles.titleContainer}>
        {/* <Pressable style={styles.arrowContainer} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-circle" size={45} color="black" />
        </Pressable> */}
        <Text style={styles.Title}>Advanced Search</Text>
      </View>
      <ScrollView style={styles.container}>
        <View style={styles.searchContainer}>
        <View
                style={styles.iconContainer}
              >
                <Ionicons name="search" size={20} color="black" style={styles.clearIcon} />
              </View>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for cars..."
            placeholderTextColor="grey"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={() => (setIsFocused(true))}
              onBlur={() => (setIsFocused(false))}
              autoFocus={true}
          />
        </View>
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsText}>Use the filters below to narrow down your car rental search.</Text>
        </View>
        <View style={styles.filterContainer}>
          <Text style={styles.filterTitle}>Fuel Type</Text>
          <View style={styles.buttonRow}>
            {fuelTypes.map((type) => (
              <TouchableOpacity
                key={type}
                style={[styles.button, selectedFuelType === type && styles.selectedButton]}
                onPress={() => handleFuelTypePress(type)}
              >
                <Text style={[styles.buttonText, selectedFuelType === type && styles.selectedButtonText]}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={styles.filterContainer}>
          <Text style={styles.filterTitle}>Car Class</Text>
          <View style={styles.buttonRow}>
            {carClasses.map((carClass) => (
              <TouchableOpacity
                key={carClass}
                style={[styles.button, selectedCarClass === carClass && styles.selectedButton]}
                onPress={() => handleCarClassPress(carClass)}
              >
                <Text style={[styles.buttonText, selectedCarClass === carClass && styles.selectedButtonText]}>
                  {carClass}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={styles.filterContainer}>
          <Text style={styles.filterTitle}>Transmission</Text>
          <View style={styles.buttonRow}>
            {transmissions.map((type) => (
              <TouchableOpacity
                key={type}
                style={[styles.button, selectedTransmission === type && styles.selectedButton]}
                onPress={() => handleTransmissionPress(type)}
              >
                <Text style={[styles.buttonText, selectedTransmission === type && styles.selectedButtonText]}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
        <TouchableOpacity style={styles.searchButton}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      <NavTab/>
    </View>
  );
};


export default AdvancedSearch;
