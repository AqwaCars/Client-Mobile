import React from 'react';
import { View, TextInput, StyleSheet,Dimensions, TouchableOpacity, Alert, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
const { height, width } = Dimensions.get("screen");

const UnderlinedInputs = () => {
  const handlePress = (field) => {
    Alert.alert('Contact Support', `Please contact support to edit the ${field} field.`);
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={() => handlePress('Name and Email')}>
        <View style={[styles.inputContainer, styles.disabledInputsContainer]}>
          <Text style={styles.title}>Name</Text>
          <View style={styles.inputWithIcon}>
            <Ionicons name="person-outline" size={24} color="black" style={styles.icon} />
            <TextInput style={styles.input} placeholder="Enter your name" underlineColorAndroid="transparent" editable={false} />
          </View>
          <Text style={styles.title}>Email</Text>
          <View style={styles.inputWithIcon}>
            <Ionicons name="mail-outline" size={24} color="black" style={styles.icon} />
            <TextInput style={styles.input} placeholder="Enter your email address" underlineColorAndroid="transparent" editable={false} />
          </View>
          <Text style={styles.note}>To update, please contact support.</Text>
        </View>
      </Pressable>
      <View style={styles.inputContainer}>
        <Text style={styles.title}>Phone Number</Text>
        <View style={styles.inputWithIcon}>
          <Ionicons name="call-outline" size={24} color="black" style={styles.icon} />
          <TextInput style={styles.input} placeholder="Enter your phone number" underlineColorAndroid="transparent" />
          <TouchableOpacity>
            <Ionicons name="create-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.title}>Password</Text>
        <View style={styles.inputWithIcon}>
          <Ionicons name="lock-closed-outline" size={24} color="black" style={styles.icon} />
          <TextInput style={styles.input} placeholder="Enter your password" secureTextEntry={true} underlineColorAndroid="transparent" />
          <TouchableOpacity>
            <Ionicons name="create-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: 'grey',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
  },
  note: {
    marginTop: 5,
    color: 'gray',
    fontSize:10,
    fontWeight:'900'
  },
  disabledInputsContainer: {
    backgroundColor: '#f2f2f2',
    paddingHorizontal: width*0.04,
    gap: 10,
    borderRadius:20,
    paddingVertical:height*0.02
  },
});

export default UnderlinedInputs;
