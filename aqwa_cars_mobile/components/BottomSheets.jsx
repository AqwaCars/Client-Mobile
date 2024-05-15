import React,{useState} from 'react';
import { StyleSheet, Text, View, Dimensions, Image, Platform, TextInput, TouchableOpacity, ImageBackground, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import RBSheet from "react-native-raw-bottom-sheet";
import ToggleSwitch from './ToggleSwitch';
const { width, height } = Dimensions.get("window");
import { useDispatch, useSelector } from 'react-redux';
import { CurrentTime, IsFocused, LocationModalVisible, LocationRedux, MarkedDates, ModalVisible, Predictions, ReturnLocation, ReturnModalVisible, ReturnPredictions, ShowAdditionalRow, finishDate, setIsFocused, setLocation, setLocationModalVisible, setMarkedDates, setModalVisible, setPredictions, setReturnLocation, setReturnModalVisible, setReturnPrediction, setSelectedFinishDate, setSelectedStartDate, setShowAdditionalRow, startDate,getAllCarByDate } from '../store/bookingSlice'

const BottomSheets = ({bottomSheetRef}) => {


    const modalVisible = useSelector(ModalVisible)
  const returnModalVisible = useSelector(ReturnModalVisible)
  const location = useSelector(LocationRedux)
  const returnLocation = useSelector(ReturnLocation)
  const predictions = useSelector(Predictions)
  const returnPredictions = useSelector(ReturnPredictions)
  const selectedStartDate = useSelector(startDate)
  const selectedFinishDate = useSelector(finishDate)
  const currentTime = useSelector(CurrentTime)
  const showAdditionalRow = useSelector(ShowAdditionalRow)
  const markedDates = useSelector(MarkedDates)
  const locationModalVisible = useSelector(LocationModalVisible)
  const isFocused = useSelector(IsFocused)
  const [loading, setLoading] = useState('')
  const [locationExists, setLocationExists] = useState(true);

    const fetchAvailableCars = async () => {
        try {
          setLoading(true);
          const body = {
            startDate: selectedStartDate,
            endDate: selectedFinishDate,
          };
          const filteredCars = await dispatch(getAllCarByDate(body));
          console.log('Filtered Cars:', filteredCars.payload);
          navigation.navigate('CarsList', { filteredCars: filteredCars.payload
            , markedDates: markedDates,
            location:location,body,
            selectedStartDate,
            setSelectedStartDate,
            selectedFinishDate,
            setSelectedFinishDate,
            currentTime
    
          });
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };
    
    
      const handleFindCars = () => {
        if (!location) {
          setLocationExists(false);
          return;
        }
        fetchAvailableCars();
      };
    

  return (
    <RBSheet
  ref={bottomSheetRef}
  height={350}
  openDuration={250}
  closeDuration={250}
  draggable={true}
  closeOnDragDown={true}
  closeOnPressBack={true}
  closeOnPressMask={true}
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
  onClose={() => console.log("Bottom sheet closed")}
 
>
      <View style={styles.container}>
      <View style={styles.filterCardWrapper}>
          <View style={styles.filterCard}>
            <View style={styles.firstRow}>
              <Text style={styles.firstText}>Different return station</Text>
              <ToggleSwitch isEnabled={showAdditionalRow} onToggle={setShowAdditionalRow} />
            </View>
            <View>
            <Pressable
        style={styles.secondRow}
        onPress={() => {
          setLocationModalVisible(true);
          setPredictions([]);
        }}
      >
        <Ionicons name="car-outline" size={25} color="grey" />
        {location ? (
          <Text style={styles.firstText}>{location}</Text>
        ) : (
          <TextInput
            style={[styles.additionalText, { color: 'grey' }]}
            editable={false}
            placeholder="Choose Pick-up Station"
          />
        )}
      </Pressable>

      </View>
            
            {showAdditionalRow && (
              <Pressable style={styles.additionalRow} onPress={()=>{setReturnModalVisible(true)}}>
                <Ionicons name="add" size={20} color="grey" />
                <TextInput
                  style={[styles.additionalText, { color: 'grey' }]}
                  editable={false}
                  value={returnLocation}
                  placeholder="Another Return Station"
                />
              </Pressable>
            )}
            <TouchableOpacity style={styles.thirdRow} onPress={() => setModalVisible(true)}>
              <View style={styles.date}>
                <Ionicons name="calendar-outline" size={25} color="grey" />
                <View style={styles.column}>
                  <Text style={styles.firstText}>{selectedStartDate ? `From ${selectedStartDate} -` : " pick a date"}</Text>
                  <Text style={styles.firstText}>{selectedFinishDate ? `To      ${selectedFinishDate}` : " pick a date"}</Text>
                </View>
              </View>
              <View style={styles.time}>
                <Ionicons name="time-outline" size={25} color="grey" />
                <Text style={styles.timeText}>{`${currentTime}`}</Text>
              </View>
            </TouchableOpacity>
            <View style={styles.BtnContainer}>
              <TouchableOpacity style={styles.find} onPress={handleFindCars}>
                {loading ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Text style={styles.textButton}>Book a car</Text>
                )}
              </TouchableOpacity>
              <Pressable onPress={() => navigation.navigate('Welcome')}>
                <Text style={styles.secondText}>Sign in or create account</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </RBSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    height: "90%",
    width: width * 1,
    gap:20
  },
  btnContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 25,
    width: "100%",
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#dedede",
    borderRadius: 100,
    height: height * 0.05,
    width: width * 0.11,
  },
  text: {
    fontSize: 18,
    fontWeight: "600",
  },
  
  filterCardWrapper: {
    flex: 1,
    position:'absolute',
    bottom:30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterCard: {
    borderRadius: 20,
    width: width * 1,

    backgroundColor: 'white',
  },
  firstRow: {
    height: height * 0.078,
    paddingHorizontal: width * 0.05,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // borderBottomWidth: 0.2,
    borderBottomColor: "grey"
  },
  secondRow: {
    height: height * 0.078,
    paddingHorizontal: width * 0.05,
    flexDirection: 'row',
    gap: 5,
    marginBottom:height*-0.01,
    // borderBottomWidth: 0.2,
    borderBottomColor: "grey",
    alignItems: "center"
  },
  thirdRow: {
    flexDirection: 'row',
    // borderBottomWidth: 0.2,
    borderBottomColor: "grey",
  },
  date: {
    gap: 5,
    flexDirection: 'row',
    alignItems: 'center',
    width: width * 0.65,
    height: height * 0.078,
    paddingLeft: 20,
    // borderRightWidth: 0.2
  },
  time: {
    gap: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: width * 0.08,
  },
  find: {
    width: width * 0.93,
    alignItems: 'center',
    justifyContent: 'center',
    height: height * 0.065,
    backgroundColor: 'black',
    borderRadius: 15,

  },
  textButton: {
    color: 'white',
    fontSize: 15,
    fontWeight: '700',
  },
  BtnContainer: {
    alignItems: 'center',
    marginBottom: height * 0.02,
    gap: Platform.OS === "android" ? 17 : 7
  },
});

export default BottomSheets;
