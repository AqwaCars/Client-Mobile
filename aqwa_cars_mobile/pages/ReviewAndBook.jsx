import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet, Text, View, Pressable, Dimensions, KeyboardAvoidingView, ScrollView, Image, LayoutAnimation, TextInput,
} from 'react-native';
import ArrowBack from '../assets/Svg/blackArrow.svg';
import { Ionicons } from '@expo/vector-icons';
import Tick from '../assets/Svg/tick.svg';
import PhoneInput from '../components/PhoneInput';
import { useSelector, useDispatch } from 'react-redux';
import {
  CarId, CreateBooking, CurrentTime, LocationRedux, MarkedDates, ReturnLocation, finishDate, startDate,
} from '../store/bookingSlice';
import { getOnecarById } from '../store/carFetch';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getOneById } from '../store/userSlice';
import ValidationSheet from '../components/ValidationSheet.jsx';

const { height, width } = Dimensions.get('screen');

const ReviewAndBook = ({ route }) => {
  const dispatch = useDispatch();
  const [showDetails, setShowDetails] = useState(false);
  const [carData, setCarData] = useState({});
  const [data, setData] = useState({});
  const [additionalDetails, setAdditionalDetails] = useState({
    companyName: '',
    streetAddress: '',
    postalCode: '',
    city: '',
    flighNumber: '',
  });
  const total = route.params.total;

  const carId = useSelector(CarId);
  const location = useSelector(LocationRedux);
  const returnLocation = useSelector(ReturnLocation);
  const currentTime = useSelector(CurrentTime);
  const start = useSelector(startDate);
  const finish = useSelector(finishDate);
  const refRBSheet = useRef();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const formattedStartDate = `Date: ${formatDate(start)}`;
  const formattedFinishDate = `Date: ${formatDate(finish)}`;

  const markedDates = useSelector(MarkedDates);

  const markedDatesArray = Object.entries(markedDates).map(([dateString, dateInfo]) => ({
    date: dateString,
    ...dateInfo,
  }));

  const getUser = async () => {
    try {
      const Id = await AsyncStorage.getItem('userId');
      const getData = await dispatch(getOneById(Id));
      setData(getData.payload);
    } catch (error) {
      console.error('Error retrieving user ID:', error);
    }
  };

  const fetchCarDetails = async () => {
    const carData = await dispatch(getOnecarById(carId));
    setCarData(carData.payload);
  };

  const handlePress = () => {
    setShowDetails(!showDetails);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };

  useEffect(() => {
    fetchCarDetails();
    getUser();
  }, []);

  const handleTextChange = (fieldName, text) => {
    setAdditionalDetails((prevState) => ({
      ...prevState,
      [fieldName]: text,
    }));
  };

  const handleCreateBooking = async () => {
    try {
      
      dispatch(CreateBooking({
        from: location,
        to: returnLocation,
        startDate: start,
        endDate: finish,
        time: currentTime,
        companyName: additionalDetails.companyName,
        address: additionalDetails.streetAddress,
        postalCode: additionalDetails.postalCode,
        flightNumber: additionalDetails.flighNumber,
        city: additionalDetails.city,
        name: data.userName,
        Email: data.email,
        phoneNumber: data.phoneNumber,
        amount: total,
        UserId: data.id,
        CarId: carData.id,
        companyName: additionalDetails.companyName,
      }));
      refRBSheet.current.open();
      
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: 'white' }} behavior="padding">
      <View style={styles.header}>
        <Pressable style={styles.arrowContainer}>
          <ArrowBack />
        </Pressable>
      </View>
      <ScrollView style={styles.info}>
        <Text style={styles.title}>Review and book</Text>
        <Pressable onPress={handlePress} style={styles.viewMore}>
          <View style={styles.carContainer}>
            <Image source={require('../assets/profilePic.jpeg')} style={styles.carImage} />
            <View style={styles.carDetails}>
              <Text style={styles.title}>{carData?.brand} {carData?.model}</Text>
              <Text style={styles.description}>or similar | convertible</Text>
              <Text style={styles.duration}>{markedDatesArray?.length} Rental day(s)</Text>
            </View>
            <Ionicons name={showDetails ? 'chevron-up-circle-outline' : 'chevron-down-circle-outline'} size={24} color="black" style={styles.arrowIcon} />
          </View>
          {showDetails && (
            <View style={styles.additionalDetails}>
              <View style={styles.detailsSection}>
                <Ionicons name="location-outline" size={24} color="black" style={styles.icon} />
                <View style={styles.detailsText}>
                  <Text style={styles.detailsTitle}>Pickup Station</Text>
                  <Text style={styles.detailsInfo}>{location}</Text>
                  <Text style={styles.detailsInfo}>{formattedStartDate}</Text>
                  <Text style={styles.detailsInfo}>Time: {currentTime}</Text>
                </View>
              </View>
              <View style={styles.detailsSection}>
                <Ionicons name="return-down-back-outline" size={24} color="black" style={styles.icon} />
                <View style={styles.detailsText}>
                  <Text style={styles.detailsTitle}>Return Station</Text>
                  <Text style={styles.detailsInfo}>{returnLocation ? returnLocation : 'Same as Pickup station'}</Text>
                  <Text style={styles.detailsInfo}>{formattedFinishDate}</Text>
                  <Text style={styles.detailsInfo}>Time: {currentTime}</Text>
                </View>
              </View>
              <View style={styles.bookingOverview}>
                <Text style={styles.detailsTitle}>Booking Overview</Text>
                <View style={styles.options}>
                  <View style={styles.option}>
                    <Tick />
                    <Text>Additional driver : Yes</Text>
                  </View>
                  <View style={styles.option}>
                    <Tick />
                    <Text>Unlimited Kms : Yes</Text>
                  </View>
                </View>
              </View>
            </View>
          )}
        </Pressable>
        <Text style={styles.title}>Driver Details</Text>
        <View style={styles.driverInfo}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputTitle}>Company Name (optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Company Name"
              value={additionalDetails?.companyName}
              onChangeText={(text) => handleTextChange('companyName', text)}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputTitle}>Full name</Text>
            <TextInput
              style={styles.disabledInput}
              placeholder="Full name"
              value={data.userName}
              editable={false}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputTitle}>Email</Text>
            <TextInput
              editable={false}
              value={data.email}
              style={styles.disabledInput}
              placeholder="Email"
              keyboardType="email-address"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputTitle}>Phone Number</Text>
            <PhoneInput phoneNumber={data.phoneNumber} />
          </View>
        </View>
        <View style={styles.creditCard}>
          <Text style={styles.title}>What credit card would you like to pay with?</Text>
          <Pressable style={styles.addCreditCardButton}>
            <Ionicons name="card-outline" size={24} color="black" style={styles.cardIcon} />
            <Text style={styles.addCreditCardText}>Add Credit Card</Text>
          </Pressable>
        </View>
        <View style={styles.addressContainer}>
          <Text style={styles.title}>Invoicing address</Text>
          <View style={styles.driverInfo}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputTitle}>Street address</Text>
              <TextInput
                style={styles.input}
                placeholder="Example: Street 123C"
                value={additionalDetails.streetAddress}
                onChangeText={(text) => handleTextChange('streetAddress', text)}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputTitle}>Postal code</Text>
              <TextInput
                style={styles.input}
                placeholder="Postal code"
                value={additionalDetails.postalCode}
                onChangeText={(text) => handleTextChange('postalCode', text)}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputTitle}>City</Text>
              <TextInput
                value={additionalDetails.city}
                onChangeText={(text) => handleTextChange('city', text)}
                style={styles.input}
                placeholder="City"
              />
            </View>
          </View>
        </View>
        <View style={styles.flight}>
          <View style={styles.flightContainer}>
            <Ionicons name="warning-outline" size={24} color="black" />
            <View style={styles.text}>
              <Text style={styles.flightTitle}>Recommended for your station</Text>
              <Text style={styles.detailsText}>For Frankfurt Airport, we highly recommend adding a flight Number
                in case of delay or flight cancellation.
              </Text>
            </View>
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputTitle}>Flight number</Text>
            <TextInput
              value={additionalDetails.flighNumber}
              onChangeText={(text) => handleTextChange('flighNumber', text)}
              style={styles.input}
              placeholder="Flight number"
            />
          </View>
        </View>
        <View style={styles.footer}>
          <View style={styles.optionWrapper}>
            <Text style={styles.optionsTitle}>Total</Text>
            <Text style={styles.optionsTitle}>{total} DT</Text>
          </View>
          <Text style={styles.important}>
            IMPORTANT INFORMATION about your PREPAID reservation:
            prepaid rates are subject to the following cancellation and no-show fees.
            Please note that the cancellation fees listed below will never exceed the total
            prepaid amount:
          </Text>
          <Text style={styles.important}>
            <Text style={styles.bullet}>•</Text> When booking is cancelled, a fee of TND {total} will be charged. The remaining prepaid amount in excess of {total} will be refunded.
          </Text>
          <Text style={styles.important}>
            <Text style={styles.bullet}>•</Text> No refund for No-Show: No refund will be issued in case of failure to pick up your vehicle (no-show) or cancellation after the scheduled pick-up time.
          </Text>
          <Text style={styles.important}>
            <Text style={styles.bullet}>•</Text> No refund for unused rental days: No refund or credits will be issued for unused rental days (late pick-up or early return) once the vehicle is rented.
          </Text>
          <Text style={styles.important}>
            I have read and accept the rental information, the terms and conditions
            and the privacy policy, and I acknowledge that I'm booking a prepaid rate,
            where the total rental price is immediately charged to the credit or debit card
            I provided.
          </Text>
          <Pressable style={styles.find} onPress={handleCreateBooking}>
            <Text style={styles.textButton}>Pay and book</Text>
          </Pressable>
        </View>
      </ScrollView>
      <ValidationSheet refRBSheet={refRBSheet} />
    </KeyboardAvoidingView>
  );
};

export default ReviewAndBook;

const styles = StyleSheet.create({
  arrowContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  header: {
    borderBottomWidth: 0.2,
    borderBottomColor: '#ccc',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    color: 'black',
    fontWeight: '900',
  },
  info: {
    paddingTop: 0.2,
    paddingBottom: 0.5,
    paddingHorizontal: width * 0.06,
  },
  viewMore: {
    backgroundColor: '#F8F8F8',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  carContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  carImage: {
    width: width * 0.28,
    height: height * 0.12,
    marginRight: 10,
    borderRadius: 5,
  },
  carDetails: {
    flex: 1,
  },
  description: {
    fontSize: 16,
    marginBottom: 3,
  },
  duration: {
    fontSize: 14,
    color: 'grey',
  },
  additionalDetails: {
    marginTop: height * 0.025,
    paddingHorizontal: width * 0.06,
  },
  arrowIcon: {
    marginLeft: 'auto',
  },
  detailsSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: {
    marginRight: 10,
  },
  detailsText: {
    flex: 1,
  },
  detailsTitle: {
    paddingTop: height * 0.01,
    fontSize: 16,
    fontWeight: 'bold',
  },
  detailsInfo: {
    fontSize: 14,
    color: 'grey',
  },
  bookingOverview: {
    borderTopWidth: 0.2,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  options: {
    paddingVertical: height * 0.017,
    gap: 5,
  },
  driverInfo: {
    marginVertical: 10,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    height: height * 0.06,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  disabledInput: {
    height: height * 0.06,
    borderColor: '#ccc',
    backgroundColor: '#EAECF0',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  addCreditCardButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  cardIcon: {
    marginRight: 10,
  },
  addCreditCardText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  creditCard: {
    paddingVertical: height * 0.03,
    borderTopWidth: 0.2,
    borderBottomWidth: 0.2,
  },
  addressContainer: {
    marginVertical: height * 0.03,
    borderBottomWidth: 0.2,
  },
  flightContainer: {
    paddingHorizontal: width * 0.06,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 10,
    justifyContent: 'flex-start',
    gap: 20,
  },
  iconStyle: {
    marginRight: 10,
  },
  flightTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  detailsText: {
    fontSize: 12,
  },
  text: {
    paddingVertical: height * 0.02,
    gap: 7,
    marginLeft: 10,
    flex: 1,
  },
  flight: {
    borderBottomWidth: 0.2,
    paddingBottom: height * 0.035,
    gap: 15,
  },
  optionWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'white',
  },
  optionsTitle: {
    fontWeight: '800',
    fontSize: 16,
  },
  textButton: {
    color: 'white',
    fontSize: 15,
    fontWeight: '700',
  },
  find: {
    width: width * 0.93,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    height: 50,
    borderRadius: 15,
    marginBottom: 20,
    backgroundColor: 'black',
  },
  important: {
    color: 'grey',
    marginVertical: height * 0.01,
    fontSize: 12,
  },
  bullet: {
    marginRight: 5,
    fontWeight: 'bold',
    color: 'grey',
  },
});
