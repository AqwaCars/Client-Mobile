import React from 'react';
import { Modal, View, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { Feather, FontAwesome6 } from '@expo/vector-icons';
const { width, height } = Dimensions.get("window");

const ImagePreviewModal = ({ visible, imageUri, onConfirm, onRetake }) => {
  return (
    <Modal visible={visible} transparent>
      <View style={styles.container}>
        <View style={styles.innerContainer}>
        <View style={styles.imageContainer}>
            <Image source={{ uri: imageUri }} style={styles.image} resizeMode="contain" />
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={onRetake} style={styles.button}>
              <Feather name="x-circle" size={35} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={onConfirm} style={styles.button}>
              <FontAwesome6 name="circle-check" size={35} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.93)', // Set the background color to transparent
    padding: 20,
  },
  innerContainer: {
    backgroundColor: 'transparent',
    borderRadius: 10,
    padding: 20,
  },
  image: {
    width: width - 40, 
    height: height * 0.7, 
    // borderRadius: 30,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    gap: 20,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  imageContainer: {
    borderRadius: 20, // Set border radius to 20
    // overflow: 'hidden', // Ensure the image stays within the bounds of the container
  },
});

export default ImagePreviewModal;
