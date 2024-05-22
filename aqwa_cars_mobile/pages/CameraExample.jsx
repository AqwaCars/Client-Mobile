import React, { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Alert, Image } from "react-native";
import { Camera } from "expo-camera";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("screen");

const CameraExample = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back); // Set default camera to back
  const [isCameraVisible, setIsCameraVisible] = useState(false);
  const cameraRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Camera access is needed to take pictures.');
      }
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setCapturedImage(photo.uri);
      setIsCameraVisible(false);
    }
  };

  return (
    <View style={styles.container}>
      {isCameraVisible ? (
        <Camera
          ref={cameraRef}
          style={styles.camera}
          type={type}
          ratio="16:9"
        >
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.captureButton}
              onPress={takePicture}
            >
              <MaterialCommunityIcons name="camera-iris" size={75} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButtonContainer}
              onPress={() => setIsCameraVisible(false)}
            >
              <MaterialCommunityIcons name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </Camera>
      ) : (
        <TouchableOpacity
          style={styles.openCameraButton}
          onPress={() => setIsCameraVisible(true)}
        >
          <Text style={styles.text}>Open Camera</Text>
        </TouchableOpacity>
      )}
      {capturedImage && (
        <View style={styles.imageContainer}>
          <Text>Image Captured!</Text>
          <Image source={{ uri: capturedImage }} style={styles.capturedImage} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  camera: {
    width: width,
    height: height * 0.8,
    justifyContent: "flex-end",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
  },
  captureButton: {
    alignSelf: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  cancelButtonContainer: {
    alignSelf: "flex-end",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  openCameraButton: {
    alignSelf: "center",
    padding: 20,
    backgroundColor: "#007AFF",
    borderRadius: 10,
  },
  text: {
    color: "white",
    fontSize: 20,
  },
  imageContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  capturedImage: {
    width: 200,
    height: 200,
    marginTop: 10,
  },
});

export default CameraExample;
