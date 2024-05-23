import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Dimensions, TouchableOpacity, Alert, Text, Pressable } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import CountryPicker from "react-native-country-picker-modal";
import ModalOfDevisesDeconnectionCRM from './ModalOfDevisesDeconnectionCRM';
const { height, width } = Dimensions.get("screen");

const UnderlinedInputs = ({ userData ,changeConfirmNewPassword, changeNewPassword, changeCurrentPassword, currentPassword, newPassword, confirmNewPassword, handleErrors,errors,modalVisible,changeModalVisible, countryCode,callingCode,phoneNumber,isValid,handleCountryCodeChange,handlePhoneNumberChange }) => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const handlePress = (field) => {
    Alert.alert('Contact Support', `Please contact support to edit the ${field} field.`);
  };
  
  const validateCurrentPassword = (password) => {
    let errorList = [];
    if (password && password.length < 8) errorList.push('Password must be at least 8 characters.');
    if (password && !/[a-z]/.test(password)) errorList.push('Password must include at least 1 lowercase letter.');
    if (password && !/[A-Z]/.test(password)) errorList.push('Password must include at least 1 uppercase letter.');
    if (password && !/\W/.test(password)) errorList.push('Password must include at least 1 symbol.');
    return errorList;
  };
  const validateNewPassword = (password) => {
    let errorList = [];
    if (password && password.length < 8) errorList.push('Password must be at least 8 characters.');
    if (password && !/[a-z]/.test(password)) errorList.push('Password must include at least 1 lowercase letter.');
    if (password && !/[A-Z]/.test(password)) errorList.push('Password must include at least 1 uppercase letter.');
    if (password && !/\W/.test(password)) errorList.push('Password must include at least 1 symbol.');
    if (password && password === currentPassword) errorList.push('New password should be different from current password.');
    return errorList;
  };
  const validateConfirmNewPassword = (password) => {
    let errorList = [];
    if (password && password !== newPassword) errorList.push('Passwords do not match.');
    return errorList;
  };
  
  useEffect(() => {
    handleErrors({
      currentPassword: validateCurrentPassword(currentPassword),
      newPassword: validateNewPassword(newPassword),
      confirmNewPassword: validateConfirmNewPassword(confirmNewPassword),
    });
  }, [currentPassword, newPassword, confirmNewPassword]);
  // const handleSubmit = () => {
  //   if (!currentPassword || !newPassword || !confirmNewPassword) {
  //     Alert.alert('Error', 'All password fields are required.');
  //     return;
  //   }

  //   const { currentPassword: currentPasswordError, newPassword: newPasswordError, confirmNewPassword: confirmNewPasswordError } = errors;

  //   if (currentPasswordError.length > 0 || newPasswordError.length > 0 || confirmNewPasswordError.length > 0) {
  //     Alert.alert('Error', 'Please correct the errors before submitting.');
  //   } else {
  //     Alert.alert('Success', 'Passwords are valid!');
  //   }
  // };

  


  return (
    <View style={styles.container}>
      <Pressable onPress={() => handlePress('Name and Email')}>
        <View style={[styles.inputContainer, styles.disabledInputsContainer]}>
          <Text style={styles.title}>Name</Text>
          <View style={styles.inputWithIcon}>
            <Ionicons name="person-outline" size={24} color="black" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              underlineColorAndroid="transparent"
              editable={false}
              value={userData?.userName}
            />
          </View>
          <Text style={styles.title}>Email</Text>
          <View style={styles.inputWithIcon}>
            <Ionicons name="mail-outline" size={24} color="black" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Enter your email address"
              underlineColorAndroid="transparent"
              editable={false}
              value={userData?.email}
            />
          </View>
          <Text style={styles.note}>To update, please contact support.</Text>
        </View>
      </Pressable>
      <View style={styles.inputContainer}>
        <Text style={styles.title}>Phone Number</Text>
        <View style={styles.inputWithIcon}>
          <Ionicons name="call-outline" size={24} color="black" style={styles.icon} />
          <CountryPicker
            withCallingCode
            withFilter
            withFlag
            withAlphaFilter
            countryCode={countryCode}
            onSelect={handleCountryCodeChange}
            containerButtonStyle={styles.FirstInputPhonePicker}
          />
          <Text style={{ color: "black" }}>{callingCode}</Text>
          <TextInput
            style={styles.inputPhone}
            onChangeText={handlePhoneNumberChange}
            value={phoneNumber}
            placeholder="Enter your phone number"
            placeholderTextColor={"#cccccc"}
            keyboardType="phone-pad"
            blurOnSubmit={false}
            underlineColorAndroid="transparent"
          />
          <TouchableOpacity>
            <Ionicons name="create-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>
          {!isValid && phoneNumber.trim() !== "" && (
            <Text style={styles.errorText}>Invalid phone number</Text>
          )}
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.title}>Current Password</Text>
        <View style={styles.inputWithIcon}>
          <Ionicons name="lock-closed-outline" size={24} color="black" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            secureTextEntry={!showCurrentPassword}
            underlineColorAndroid="transparent"
            value={currentPassword}
            onChangeText={changeCurrentPassword}
          />
          <TouchableOpacity onPress={() => setShowCurrentPassword(!showCurrentPassword)}>
            <Feather name={showCurrentPassword ? "eye" : "eye-off"} size={20} color="#cccccc" />
          </TouchableOpacity>
        </View>
        {errors.currentPassword.length > 0 && <Text style={styles.errorText}>{errors.currentPassword[0]}</Text>}
        <Text style={styles.title}>New Password</Text>
        <View style={styles.inputWithIcon}>
          <Ionicons name="lock-closed-outline" size={24} color="black" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Enter your new password"
            secureTextEntry={!showNewPassword}
            underlineColorAndroid="transparent"
            value={newPassword}
            onChangeText={changeNewPassword}
          />
          <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
            <Feather name={showNewPassword ? "eye" : "eye-off"} size={20} color="#cccccc" />
          </TouchableOpacity>
        </View>
        {errors.newPassword.length > 0 && <Text style={styles.errorText}>{errors.newPassword[0]}</Text>}
        <Text style={styles.title}>Confirm New Password</Text>
        <View style={styles.inputWithIcon}>
          <Ionicons name="lock-closed-outline" size={24} color="black" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Confirm your new password"
            secureTextEntry={!showConfirmNewPassword}
            underlineColorAndroid="transparent"
            value={confirmNewPassword}
            onChangeText={changeConfirmNewPassword}
          />
          <TouchableOpacity onPress={() => setShowConfirmNewPassword(!showConfirmNewPassword)}>
            <Feather name={showConfirmNewPassword ? "eye" : "eye-off"} size={20} color="#cccccc" />
          </TouchableOpacity>
        </View>
        {errors.confirmNewPassword.length > 0 && <Text style={styles.errorText}>{errors.confirmNewPassword[0]}</Text>}
      </View>
    {/* <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity> */}
        <ModalOfDevisesDeconnectionCRM  modalVisible={modalVisible} changeModalVisible={changeModalVisible} currentPassword={currentPassword} newPassword={newPassword} confirmNewPassword={confirmNewPassword} errors={errors} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  inputContainer: {
    marginBottom: 20,
    gap: 10,
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
  inputPhone: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
    paddingLeft:10
  },
  note: {
    marginTop: 5,
    color: 'gray',
    fontSize: 10,
    fontWeight: '900',
  },
  disabledInputsContainer: {
    backgroundColor: '#f2f2f2',
    paddingHorizontal: width * 0.04,
    gap: 10,
    borderRadius: 20,
    paddingVertical: height * 0.02,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
  submitButton: {
    backgroundColor: 'black',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default UnderlinedInputs;
