import React, { useState } from "react";
import {
  Modal,
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  Text,
  ActivityIndicator,
} from "react-native";
import { Feather, FontAwesome } from "@expo/vector-icons";
import axios from "axios";
import * as FileSystem from "expo-file-system";
import Toast from "react-native-toast-message";

const { width, height } = Dimensions.get("window");

const ImagePreviewModal = ({ visible, imageUri, onConfirm, onRetake,portait,cloudinaryUpload }) => {
  const [faceDetected, setFaceDetected] = useState(false);
  const [documentDetected, setDocumentDetected] = useState(false);
  const [loading, setLoading] = useState(false);

  

  const analyzeImage = async () => {
    try {
      setLoading(true);
      if (!imageUri) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Please take an image",
        })
        return;
      }

      const apiKey = "AIzaSyB3NJmybh9GTPr69POFvJ7RdA_hVK2GHFw"; 
      const apiUrl = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;
      const base64ImageData = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const requestData = {
        requests: [
          {
            image: {
              content: base64ImageData,
            },
            features: [
              { type: "FACE_DETECTION" },
              { type: "TEXT_DETECTION" },
            ],
          },
        ],
      };

      const apiResponse = await axios.post(apiUrl, requestData);
      const responses = apiResponse.data.responses[0];
      console.log("API Response:", responses);

      const faces = responses.faceAnnotations || [];
      const texts = responses.textAnnotations || [];

      const highConfidenceFaces = faces.filter((face) => face.detectionConfidence >= 0.95);

      const hasHighConfidenceFace = highConfidenceFaces.length === 1;

      const highConfidenceTexts = texts.filter((text) => text.description.trim().length > 0);

      const hasHighConfidenceText = highConfidenceTexts.length > 0;

      const hasNumbers = texts.some((text) => /[0-9]/.test(text.description));

      const isNotHumanWriting = texts.every((text) => isMachineWritten(text));

      const isFacePhoto = faces.some((face) => face.headwearLikelihood === "VERY_UNLIKELY");

      const isValidDocument = faces.length === 1 &&  hasHighConfidenceFace && hasHighConfidenceText && hasNumbers && isNotHumanWriting && isFacePhoto;

      setFaceDetected(hasHighConfidenceFace);
      setDocumentDetected(hasHighConfidenceText && hasNumbers && isNotHumanWriting && isFacePhoto);

      if (isValidDocument) {
        // cloudinaryUpload(imageUri,"user_images")
        onConfirm();
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Document verified successfully",
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Document not verified successfully",
        });
        onRetake();
      }
    } catch (error) {
      console.error("Error analyzing image:", error);
    } finally {
      setLoading(false);
    }
  };

  const analyzeImageBack = async () => {
    try {
      setLoading(true);
      if (!imageUri) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Please take an image",
        });
        return;
      }
  
      const apiKey = "AIzaSyB3NJmybh9GTPr69POFvJ7RdA_hVK2GHFw"; 
      const apiUrl = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;
      const base64ImageData = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
  
      const requestData = {
        requests: [
          {
            image: {
              content: base64ImageData,
            },
            features: [
              { type: "FACE_DETECTION" }, 
              { type: "TEXT_DETECTION" }, 
            ],
          },
        ],
      };
  
      const apiResponse = await axios.post(apiUrl, requestData);
      const responses = apiResponse.data.responses[0];
      console.log("API Response (Face and Text Detection):", responses);
  
      const faces = responses.faceAnnotations || [];
  
      const hasFaces = faces.length > 0;
  
      const texts = responses.textAnnotations || [];
  
      const highConfidenceTexts = texts.filter((text) => text.description.trim().length > 0);
  
      const hasHighConfidenceText = highConfidenceTexts.length > 0;
  
      const hasNumbers = texts.some((text) => /[0-9]/.test(text.description));
  
      const isNotHumanWriting = texts.every((text) => isMachineWritten(text));
  
      const isValidDocument = !hasFaces && hasHighConfidenceText && hasNumbers && isNotHumanWriting;
  
      setDocumentDetected(hasHighConfidenceText && hasNumbers && isNotHumanWriting);
  
      if (isValidDocument) {
        onConfirm();
        // cloudinaryUpload(imageUri,"user_images")
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Document verified successfully",
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Document not verified successfully",
        });
        onRetake();
      }
    } catch (error) {
      console.error("Error analyzing image:", error);
    } finally {
      setLoading(false);
    }
  };
  
  
  const analyzeImageSelfie = async () => {
    try {
      setLoading(true);
      if (!imageUri) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Please take an image",
        })
        return;
      }
  
      const apiKey = "AIzaSyB3NJmybh9GTPr69POFvJ7RdA_hVK2GHFw"; // Replace with your actual API key
      const apiUrl = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;
      const base64ImageData = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
  
      const requestData = {
        requests: [
          {
            image: {
              content: base64ImageData,
            },
            features: [
              { type: "FACE_DETECTION" },
            ],
          },
        ],
      };
  
      const apiResponse = await axios.post(apiUrl, requestData);
      const responses = apiResponse.data.responses[0];
      console.log("API Response:", responses);
  
      const faces = responses.faceAnnotations || [];
  
      const highConfidenceFaces = faces.filter((face) => face.detectionConfidence >= 0.95);
      const hasHighConfidenceFace = highConfidenceFaces.length === 1;
  
      const isFacePhoto = faces.some((face) => face.headwearLikelihood === "VERY_UNLIKELY");
  
      const isValidDocument = faces.length === 1 && hasHighConfidenceFace && isFacePhoto;
  
      setFaceDetected(hasHighConfidenceFace);
      setDocumentDetected(isValidDocument);
  
      if (isValidDocument) {
        onConfirm();
        // cloudinaryUpload(imageUri,"user_images")
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Selfie verified successfully",
        });
      } else {
        console.log("Document not verified successfully.");
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Selfie not verified successfully",
        });
        onRetake();
      }
    } catch (error) {
      console.error("Error analyzing image:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleConfirm = () => {
    if(portait === "selfie"){
      analyzeImageSelfie()
    }
    if(portait === "license" || portait === "frontCardId" || portait === "passport"){
      analyzeImage()
    }
    if(portait === "backLicense" || portait === "backCardId" ){
      analyzeImageBack()
    }
  };

  const isMachineWritten = (text) => {
    return !/(cursive|handwriting|italic)/i.test(text.description); // Example criteria
  };

  return (
    <Modal visible={visible} transparent>
     
        <View style={styles.container}>
          <View style={styles.innerContainer}>
           { portait === "selfie"?<Text style={styles.instructions}>
           Make sure your face is well-lit, clearly visible, and fully within the frame
            </Text>:<Text style={styles.instructions}>
              Ensure the document is placed on a plain surface, is well-lit, and fits entirely within the frame
            </Text>}
            <View style={styles.imageContainer}>
              <Image source={{ uri: imageUri }} style={styles.image} resizeMode="contain" />
              {faceDetected && (
                <View style={[styles.detectionIndicator, styles.faceIndicator]} />
              )}
              {documentDetected && (
                <View style={[styles.detectionIndicator, styles.documentIndicator]} />
              )}
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={onRetake} style={styles.button}>
                <Feather name="x-circle" size={35} color="white" />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleConfirm} style={styles.button}>
                <FontAwesome name="check-circle" size={35} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator animating={true} size="large" color="#fff" />
        </View>
      ) :null}
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.93)",
    padding: 20
  },
  innerContainer: {
    backgroundColor: "transparent",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  image: {
    width: width - 40,
    height: height * 0.6,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    gap: 20,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  imageContainer: {
    borderRadius: 20,
    overflow: "hidden",
    position: "relative",
  },
  instructions: {
    color: "white",
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
  },
  detectionIndicator: {
    position: "absolute",
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "rgba(0, 255, 0, 0.5)",
  },
  faceIndicator: {
    top: 10,
    left: 10,
  },
  documentIndicator: {
    bottom: 10,
    right: 10,
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject, // Covering the entire screen
    zIndex: 1, // Ensure the loader appears above the modal content
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});

export default ImagePreviewModal;
