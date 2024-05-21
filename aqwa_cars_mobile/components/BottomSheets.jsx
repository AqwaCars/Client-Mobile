import React,{useState,useContext,useEffect} from 'react';
import { StyleSheet, Text, View, Dimensions, Image, Platform, TextInput, TouchableOpacity, ImageBackground, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import RBSheet from "react-native-raw-bottom-sheet";
import ToggleSwitch from './ToggleSwitch';
const { width, height } = Dimensions.get("window");
import { useDispatch, useSelector } from 'react-redux';
import { CurrentTime, IsFocused, LocationModalVisible, LocationRedux, MarkedDates, ModalVisible, Predictions, ReturnLocation, ReturnModalVisible, ReturnPredictions, ShowAdditionalRow, finishDate, setIsFocused, setLocation, setLocationModalVisible, setMarkedDates, setModalVisible, setPredictions, setReturnLocation, setReturnModalVisible, setReturnPrediction, setSelectedFinishDate, setSelectedStartDate, setShowAdditionalRow, startDate,getAllCarByDate } from '../store/bookingSlice'
import { LoginContext } from '../context/AuthContext.jsx';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import Modal from 'react-native-modal';
import { Calendar } from 'react-native-calendars';
import ModalFooter from '../components/ModalFooter';
const backgroundHeight = Platform.OS === 'android' ? height * 0.59 : height * 0.6;
import axios from 'axios';

const BottomSheets = ({bottomSheetRef}) => {
  const dispatch= useDispatch()


  const { logindata, setLoginData } = useContext(LoginContext);
 
  const navigation = useNavigation();
  const modalVisible = useSelector(ModalVisible);
  const returnModalVisible = useSelector(ReturnModalVisible);
  const location = useSelector(LocationRedux);
  const returnLocation = useSelector(ReturnLocation);
  const predictions = useSelector(Predictions);
  const returnPredictions = useSelector(ReturnPredictions);
  const selectedStartDate = useSelector(startDate);
  const selectedFinishDate = useSelector(finishDate);
  const currentTime = useSelector(CurrentTime);
  const showAdditionalRow = useSelector(ShowAdditionalRow);
  const markedDates = useSelector(MarkedDates);
  const locationModalVisible = useSelector(LocationModalVisible);
  const isFocused = useSelector(IsFocused);
  const [loading, setLoading] = useState('');
  const [locationExists, setLocationExists] = useState(true);
  const [disabledDates, setDisabledDates] = useState({});
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    setDisabledDates(disablePastDates());
    // initializeDates();
  }, []);

  // const initializeDates = () => {
  //   const today = new Date();
  //   const tomorrow = new Date();
  //   tomorrow.setDate(today.getDate() + 1);

  //   const todayString = today.toISOString().split('T')[0];
  //   const tomorrowString = tomorrow.toISOString().split('T')[0];

  //   dispatch(setSelectedStartDate(todayString));
  //   dispatch(setSelectedFinishDate(tomorrowString));

  //   const initialMarkedDates = {
  //     [todayString]: { startingDay: true, selected: true, color: '#8c52ff', textColor: 'white' },
  //     [tomorrowString]: { endingDay: true, selected: true, color: '#8c52ff', textColor: 'white' }
  //   };

  //   dispatch(setMarkedDates(initialMarkedDates));
  // };

  const calendarTheme = {
    backgroundColor: '#ffffff',
    calendarBackground: '#ffffff',
    textSectionTitleDisabledColor: '#d9e1e8',
    selectedDayBackgroundColor: '#8c52ff',
    todayTextColor: '#8c52ff',
    arrowColor: '#8c52ff',
  };

  const disablePastDates = () => {
    const today = new Date();
    const disabledDates = {};
    const dateString = today.toISOString().split('T')[0];
    for (let i = 1; i < today.getDate(); i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const disabledDateString = date.toISOString().split('T')[0];
      disabledDates[disabledDateString] = { disabled: true, disableTouchEvent: true };
    }
    return disabledDates;
  };

  const onDayPress = (day) => {
    const selectedDate = new Date(day.dateString);

    if (!selectedStartDate) {
      dispatch(setSelectedStartDate(day.dateString));
      dispatch(setSelectedFinishDate(null));
      dispatch(setMarkedDates({
        [day.dateString]: { startingDay: true, selected: true, color: '#8c52ff', textColor: 'white' },
      }));
    } else if (!selectedFinishDate) {
      const startDate = new Date(selectedStartDate);
      const finishDate = new Date(day.dateString);

      if (finishDate >= startDate) {
        const datesToMark = {};
        const currentDate = new Date(startDate);

        while (currentDate <= finishDate) {
          const dateString = currentDate.toISOString().split('T')[0];
          const opacity = (currentDate > startDate && currentDate < finishDate) ? 0.3 : 1; // Set opacity for dates between start and end dates
          datesToMark[dateString] = { color: `rgba(140, 82, 255, ${opacity})`, textColor: 'white' };
          if (currentDate.getTime() === startDate.getTime()) {
            datesToMark[dateString].startingDay = true;
            datesToMark[dateString].selected = true;
          } else if (currentDate.getTime() === finishDate.getTime()) {
            datesToMark[dateString].endingDay = true;
            datesToMark[dateString].selected = true;
          }
          currentDate.setDate(currentDate.getDate() + 1);
        }

        dispatch(setSelectedFinishDate(day.dateString));
        dispatch(setMarkedDates({ ...markedDates, ...datesToMark }));
      } else {
        dispatch(setSelectedStartDate(day.dateString));
        dispatch(setSelectedFinishDate(null));
        dispatch(setMarkedDates({
          [day.dateString]: { startingDay: true, selected: true, color: '#8c52ff', textColor: 'white' },
        }));
      }
    } else {
      dispatch(setSelectedStartDate(null));
      dispatch(setSelectedFinishDate(null));
      dispatch(setMarkedDates({}));
    }
  };

  const openModal = () => {
    dispatch(setModalVisible(true));
  };

  const fetchAvailableCars = async () => {
    try {
      setLoading(true);
      const body = {
        startDate: selectedStartDate,
        endDate: selectedFinishDate,
      };
      const filteredCars = await dispatch(getAllCarByDate(body));
      console.log('Filtered Cars:', filteredCars.payload);
      navigation.navigate('CarsList', {
        filteredCars: filteredCars.payload
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
    if (!selectedFinishDate) {
      Toast.show({
        type: 'info',
        text1: 'Select Return Date',
        text2: 'Please select a return date to continue.',
      });
      return;
    }
    fetchAvailableCars();
  };

  const fetchLocations = async (searchText) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${searchText}&components=country:tn&key=${process.env.EXPO_PUBLIC_SERVER_IP_2}`
      );
      dispatch(setPredictions(response.data.predictions));
      dispatch(setReturnPrediction(response.data.predictions));

    } catch (error) {
      console.error('Error fetching locations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeText = async (text) => {
    dispatch(setLocation(text));
    if (text) {
      await fetchLocations(text);
    } else {
      dispatch(setPredictions([]));
    }
  };

  const handlePredictionPress = (item) => {
    console.log('Selected Location:', item);

    dispatch(setLocation(item.description));
    setLocationExists(true);
    dispatch(setPredictions([]));
    dispatch(setLocationModalVisible(false));
  };

  const handleReturnChangeText = async (text) => {
    dispatch(setReturnLocation(String(text)));
    if (text) {
      await fetchLocations(text);
    } else {
      dispatch(setReturnPrediction([]));
    }
  };

  const handleReturnPredictionPress = (item) => {
    console.log('Selected Return Location:', item);
    dispatch(setReturnLocation(item.description));
    dispatch(setReturnPrediction([]));
    dispatch(setReturnModalVisible(false));
  };

  const getLocation = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.coords.latitude},${location.coords.longitude}&key=${process.env.EXPO_PUBLIC_SERVER_IP_2}`);
      const json = response.data;
      if (json.results.length > 0) {
        const addressComponent1 = json.results[0].address_components[1].short_name;
        const addressComponent2 = json.results[0].address_components[2].short_name;
        const concatenatedAddress = addressComponent1 + ', ' + addressComponent2;
        dispatch(setLocation(concatenatedAddress));
        dispatch(setLocationModalVisible(false));
      } else {
        dispatch(setLocation('Location not found'));
      }
    } catch (error) {
      console.error('Error getting location:', error);
      setErrorMsg('Error getting location. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
    

  return (
    <RBSheet
  ref={bottomSheetRef}
  height={280}
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
            <View>
            <TouchableOpacity
        style={styles.secondRow}
        onPress={() => {
          dispatch(setLocationModalVisible(true));
          dispatch(setPredictions([]));
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
      </TouchableOpacity>

      </View>
            
          
              <Pressable style={styles.additionalRow} onPress={() => { dispatch(setReturnModalVisible(true)) }}>
                <Ionicons name="add" size={20} color="grey" />
                <TextInput
                  style={[styles.additionalText, { color: 'grey' }]}
                  editable={false}
                  value={returnLocation}
                  placeholder="Another Return Station"
                />
              </Pressable>
    
            <TouchableOpacity style={styles.thirdRow} onPress={openModal}>
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
                  <Text style={styles.textButton}>Show Offers</Text>
                )}
              </TouchableOpacity>
              {/* <Pressable onPress={() => navigation.navigate('Welcome')}>
                <Text style={styles.secondText}>Sign in or create account</Text>
              </Pressable> */}
            </View>
          </View>
        </View>
      </View>
      <Modal
        isVisible={modalVisible}
        swipeDirection={['down']}
        style={styles.modal}
        onSwipeComplete={() => dispatch(setModalVisible(false))}
        onBackdropPress={() => dispatch(setModalVisible(false))}>
        <View style={styles.modalContent}>
          <Text style={{
            fontSize: 21,
            fontWeight: '500',
            paddingTop: 10,
          }}>Select a Date</Text>
          <Calendar
            style={styles.calendar}
            enableSwipeMonths={true}
            onDayPress={onDayPress}
            markedDates={{
              ...disabledDates,
              ...markedDates,
            }}
            theme={calendarTheme}
            markingType='period'

          />
          <ModalFooter selectedStartDate={selectedStartDate} selectedFinishDate={selectedFinishDate} currentTime={currentTime} fetchAvailableCars={handleFindCars} setModalVisible={setModalVisible} />
        </View>
      </Modal>
      <Modal
        isVisible={locationModalVisible}
        swipeDirection={['down']}
        style={styles.modal}
        onSwipeComplete={() => dispatch(setLocationModalVisible(false))}
        onBackdropPress={() => dispatch(setLocationModalVisible(false))}
      >
        <View style={styles.modalContent2}>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search..."
              onChangeText={handleChangeText}
              onFocus={() => dispatch(setIsFocused(true))}
              onBlur={() => dispatch(setIsFocused(false))}
              autoFocus={true}
            />
            {location !== '' && (
              <TouchableOpacity
                style={styles.iconContainer}
                onPress={() => {
                  dispatch(setLocation(''));
                  dispatch(setPredictions([]));
                }}
              >
                <Ionicons name="close" size={20} color="black" style={styles.clearIcon} />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={() => {/* Handle search action */ }}
            >
              <Ionicons name="search" size={20} color="black" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.useLocationButton}
            onPress={() => { getLocation(); }}
          >
            {loading ? (
              <ActivityIndicator size="small" color="black" style={{ marginRight: 10 }} />
            ) : (
              <Ionicons name="location-outline" size={20} color="black" />
            )}
            <Text style={styles.useLocationButtonText}>
              {loading ? 'This may take some time' : 'Use My Current Location'}
            </Text>
          </TouchableOpacity>
          <FlatList
            data={predictions}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handlePredictionPress(item)}
                style={styles.predictionContainer}
              >
                <Text style={styles.predictionText}>{item.description}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.place_id}
          />
        </View>
      </Modal>
      <Modal
        isVisible={returnModalVisible}
        swipeDirection={['down']}
        style={styles.modal}
        onSwipeComplete={() => {
          dispatch(setReturnModalVisible(false));
        }}
        onBackdropPress={() => {
          dispatch(setReturnModalVisible(false));
        }}
      >
        <View style={styles.modalContent2}>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search..."
              onChangeText={handleReturnChangeText}
              onFocus={() => dispatch(setIsFocused(true))}
              onBlur={() => dispatch(setIsFocused(false))}
              autoFocus={true}
            />
            {returnLocation !== '' && (
              <TouchableOpacity
                style={styles.iconContainer}
                onPress={() => {
                  dispatch(setReturnLocation(''));
                  dispatch(setReturnPrediction([]));
                }}
              >
                <Ionicons name="close" size={20} color="black" style={styles.clearIcon} />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={() => {/* Handle search action */ }}
            >
              <Ionicons name="search" size={20} color="black" />
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator size="small" color="#0000ff" />
          ) : (
            <FlatList
              data={returnPredictions}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleReturnPredictionPress(item)}
                  style={styles.predictionContainer}
                >
                  <Text style={styles.predictionText}>{item.description}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.place_id}
            />
          )}
        </View>
      </Modal>
    </RBSheet>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  background: {
    width: width * 1,
    height: backgroundHeight,
    alignItems: 'center',
  },
  logo: {
    width: width * 0.7,
    height: height * 0.2
  },
  content: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: width * 1,
    // gap:-500
  },
  filterCardWrapper: {
    // flex: 1,
    // position: 'absolute',
    bottom: Platform.OS === 'android' ? 30 : 5,
    alignItems: 'center',
    justifyContent: 'center',
  
   
  },
  filterCard: {
    borderRadius: 20,
    // borderWidth: 0.6,
    width: width * 1,
    // height: height * 0.38,
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
    marginBottom: height * -0.01,
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
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    justifyContent: 'space-around',
    alignItems: 'center',
    height: height * 0.7,
  },
  calendar: {
    width: width * 1
  },
  markedDay: {
    backgroundColor: 'rgba(140, 82, 255, 0.5)',
    borderRadius: 10
  },
  markedDayText: {
    color: 'white'
  },
  firstText: {
    fontSize: 15,
    fontWeight: '600',
    // fontFamily:'leagueSpartan'
  },
  timeText: {
    fontSize: 13,
    fontWeight: '400',
  },
  BtnContainer: {
    alignItems: 'center',
    marginBottom: height * 0.02,
    gap: Platform.OS === "android" ? 17 : 7
  },
  secondText: {
    fontSize: 12,
    fontWeight: '500',
    textDecorationLine: 'underline'
  },
  additionalRow: {
    height: height * 0.078,
    paddingHorizontal: width * 0.05,
    flexDirection: 'row',
    // justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: "grey",
    // borderBottomWidth: 0.2,
  },
  additionalText: {
    fontSize: 15,
    fontWeight: '600',
  },
  loadingIndicator: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: height * 0.1,
  },

  prediction: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginBottom: 5,
  },
  predictionList: {
    maxHeight: 200,
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent2: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    height: height * 0.7,
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
  clearIcon: {
    marginRight: width * 0.08
  },
  predictionContainer: {
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginBottom: 10,
    padding: 10,
    // alignItems: 'center',
  },
  predictionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  useLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: '#f0f0f0',
    borderBottomWidth: 0.2,
    borderRadius: 5,
    paddingVertical: height * 0.02,
    marginBottom: 10,
  },
  useLocationButtonText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    paddingHorizontal: width * 0.065
  },
  loaderValidate: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
});

export default BottomSheets;
