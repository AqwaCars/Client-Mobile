import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import RBSheet from 'react-native-raw-bottom-sheet';

const { height, width } = Dimensions.get('window');

const StarRating = ({ rating, onChangeRating }) => {
  return (
    <View style={styles.starContainer}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity key={star} onPress={() => onChangeRating(star)}>
          <FontAwesome
            name={star <= rating ? 'star' : 'star-o'}
            size={40}
            color={'#FFD700'}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const ReviewSheet = ({ refRBSheet, isServiceFinished }) => {
  const [starCount, setStarCount] = useState(0);
  
  useEffect(() => {
    if (isServiceFinished && refRBSheet.current) {
      refRBSheet.current.open();
    }
  }, [isServiceFinished]);

  return (
    <RBSheet
      ref={refRBSheet}
      height={210}
      openDuration={250}
      closeDuration={250}
      closeOnDragDown={true}
      closeOnPressBack={true}
      closeOnPressMask={true}
      draggable={true}
      customStyles={{
        wrapper: {
          backgroundColor: "rgba(0,0,0,0.5)",
        },
        draggableIcon: {
          backgroundColor: "#d5d5d5",
          width: 60,
        },
        container: {
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
        },
      }}
    >
      <View style={styles.modalView}>
        <Text style={styles.title}>Rate Your Experience</Text>
        <StarRating rating={starCount} onChangeRating={setStarCount} />
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={() => refRBSheet.current.close()}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.submitButton} onPress={() => {
            alert(`Submitted ${starCount} stars!`);
            refRBSheet.current.close();
          }}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </RBSheet>
  );
};

const styles = StyleSheet.create({
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  starContainer: {
    flexDirection: 'row',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 30,
  },
  cancelButton: {
    flex: 1,
    marginRight: 10,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  submitButton: {
    flex: 1,
    marginLeft: 10,
    padding: 15,
    backgroundColor: '#000',
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ReviewSheet;
