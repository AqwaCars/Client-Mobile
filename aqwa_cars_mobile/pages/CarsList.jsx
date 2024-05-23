import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, Dimensions, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import CarCard from '../components/CarCard';
import FilterButtons from '../components/FilterButtons';
import moment from 'moment';
import BottomSheets from '../components/BottomSheets';
import { useDispatch, useSelector } from 'react-redux';
import { CurrentTime, LocationRedux, MarkedDates, finishDate, startDate } from '../store/bookingSlice'



const { height, width } = Dimensions.get("screen");

const CarsList = () => {
  
  const navigation = useNavigation();
  const route = useRoute()
  const {filteredCars}= route.params


  const dispatch = useDispatch();
  const location = useSelector(LocationRedux)
  const selectedStartDate = useSelector(startDate)
  const selectedFinishDate = useSelector(finishDate)
  const currentTime = useSelector(CurrentTime)

  const markedDates = useSelector(MarkedDates)

  console.log('cars list ha',markedDates)
console.log('bro start',selectedStartDate)
console.log('broo finish',selectedFinishDate)

  
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const bottomSheetRef = useRef();


  const formattedStartDate = moment(selectedStartDate).format('D MMM');
  const formattedEndDate = moment(selectedFinishDate).format('D MMM');


  const handleOpenBottomSheet = () => {
    console.log('here we go yea')
    bottomSheetRef.current.open()
    console.log("bottom sheet",bottomSheetVisible)
  };


  

  

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color="black" style={styles.icon} />
        </Pressable>
      </View>
      <View style={{ alignItems: 'center' }}>
        <Pressable style={styles.update} onPress={handleOpenBottomSheet}>
          <View>
            <Text style={styles.location}>{location}</Text>
            <Text style={styles.date}>{`${formattedStartDate} | ${currentTime} - ${formattedEndDate} | ${currentTime}`}</Text>
          </View>
          <Ionicons name="create" size={24} color="black" style={styles.icon} />
        </Pressable>
        <FilterButtons />
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {filteredCars?.map((car) => (
          <CarCard key={car.id} car={car}/>
        ))}
      </ScrollView>
      <BottomSheets bottomSheetRef={bottomSheetRef} />
    </View>
  );
}

export default CarsList;

const styles = StyleSheet.create({
  container: {
    gap: 10,
    flex: 1,
    alignItems: 'center',
  },
  header: {
    marginTop: height * 0.06,
    alignItems: 'flex-start',
    width: width * 1,
    paddingHorizontal: width * 0.05,
  },
  update: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.015,
    alignItems: 'center',
    backgroundColor: "#ECECEC",
    width: width * 0.9,
    borderRadius: 15,
  },
  location: {
    fontSize: 13,
    fontWeight: '600',
  },
  date: {
    fontSize: 11,
  },
  scroll: {
    gap: 15,
    paddingBottom: height * 0.05,
  },
});
