import Toast from "react-native-toast-message";

const showToast = (type, text1, text2) => {
    Toast.show({
      type: type,
      position: "top",
      text1: text1,
      text2: text2,
      visibilityTime: 4000,
      autoHide: true,
      topOffset: 80,
      bottomOffset: 40,
    });
  };
  

  
  export { showToast };
  