import { StyleSheet, Text, View,Pressable,Dimensions,KeyboardAvoidingView ,ScrollView,Image,LayoutAnimation,TextInput } from 'react-native'
import React,{useState} from 'react'
import ArrowBack from '../assets/Svg/blackArrow.svg'
import { Ionicons } from '@expo/vector-icons';
import Tick from '../assets/Svg/tick.svg'
import PhoneInput from '../components/PhoneInput';
const { height, width } = Dimensions.get("screen");


const ReviewAndBook = () => {

    const [showDetails, setShowDetails] = useState(false);


    const handlePress = () => {
        setShowDetails(!showDetails);
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

      };


  return (
    <KeyboardAvoidingView style={{ flex: 1,backgroundColor:'white' }} behavior="padding" >
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
          <Text style={styles.title}>Car Title</Text>
          <Text style={styles.description}>Word or similar</Text>
          <Text style={styles.duration}>Duration: 1 week</Text>
        </View>
        <Ionicons name={showDetails ? 'chevron-up-circle-outline' : 'chevron-down-circle-outline'} size={24} color="black" style={styles.arrowIcon} />
      </View>
      {showDetails && (
  <View style={styles.additionalDetails}>
    <View style={styles.detailsSection}>
      <Ionicons name="location-outline" size={24} color="black" style={styles.icon} />
      <View style={styles.detailsText}>
        <Text style={styles.detailsTitle}>Pickup Station</Text>
        <Text style={styles.detailsInfo}>Station Name</Text>
        <Text style={styles.detailsInfo}>Date: January 1, 2024</Text>
        <Text style={styles.detailsInfo}>Time: 10:00 AM</Text>
      </View>
    </View>
    <View style={styles.detailsSection}>
      <Ionicons name="return-down-back-outline" size={24} color="black" style={styles.icon} />
      <View style={styles.detailsText}>
        <Text style={styles.detailsTitle}>Return Station</Text>
        <Text style={styles.detailsInfo}>Station Name</Text>
        <Text style={styles.detailsInfo}>Date: January 5, 2024</Text>
        <Text style={styles.detailsInfo}>Time: 10:00 AM</Text>
      </View>
    </View>
    <View style={styles.bookingOverview}>
  <Text style={styles.detailsTitle}>Booking Overview</Text>
  <View style={styles.options}>
    <View style={styles.option}>
  <Tick/>
  <Text>Additional driver : Yes</Text>
  </View>
  <View style={styles.option}>
  <Tick/>
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
        <Text style={styles.inputTitle}>Company Name (Optional)</Text>
        <TextInput style={styles.input} placeholder="Company Name" />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.inputTitle}>First Name</Text>
        <TextInput style={styles.input} placeholder="First Name" />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.inputTitle}>Last Name</Text>
        <TextInput style={styles.input} placeholder="Last Name" />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.inputTitle}>Email</Text>
        <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.inputTitle}>Phone Number</Text>
        <PhoneInput />
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
        <TextInput style={styles.input} placeholder="Example: Street 123C" />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.inputTitle}>Postal code</Text>
        <TextInput style={styles.input} placeholder="Postal code" />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.inputTitle}>City</Text>
        <TextInput style={styles.input} placeholder="City" />
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
        <TextInput style={styles.input} placeholder="Flight number" />
      </View>
  </View>
  <View style={styles.footer}>
  <View style={styles.optionWrapper}>
          <Text style={styles.optionsTitle}>Total</Text>
          <Text style={styles.optionsTitle}>1750 DT</Text>
        </View>
        <Text style={styles.important}>
          IMPORTANT INFORMATION about your PREPAID reservation:
          prepaid rates are subject to the following cancellation and no-show fees.
          Please note that the cancellation fees listed below will never exceed the total
          prepaid amout:
        </Text>
        <Text style={styles.important}>
    <Text style={styles.bullet}>•</Text> When booking is cancelled, a fee of TND 332.79 will be charged. The remaining prepaid amount in excess of 332.79 will be refunded.
  </Text>
  <Text style={styles.important}>
    <Text style={styles.bullet}>•</Text> No refund for No-Show: No refund will be issued in case of failure to pick up your vehicle (no-show) or cancellation after the scheduled pick-up time.
  </Text>
  <Text style={styles.important}>
    <Text style={styles.bullet}>•</Text> No refund for unused rental days: No refund or credits will be issued for unused rental days (late pick-up or early return) once the vehicle is rented.
  </Text>
  <Text style={styles.important}>
          I heave read and accept the rental information,the terms and conditions 
          and the privacy policy, and I acknowledge that I'm booking a prepad rate,
          where the total rental price is immediately charged to te credit or debit card
          I provided.
        </Text>
        <Pressable style={styles.find}>
          <Text style={styles.textButton}>Pay and book</Text>
        </Pressable>
  </View>

      </ScrollView>
      </KeyboardAvoidingView>
  )
}

export default ReviewAndBook

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
      title:{
        fontSize:22,
        color:'black',
        fontWeight:'900'
    },
    info:{

        paddingTop:0.2,
        paddingBottom:0.5,
        paddingHorizontal:width*0.06,
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
        width: width*0.28,
        height: height*0.12,
        marginRight: 10,
        borderRadius: 5,
      },
      carDetails: {
        flex: 1,
      },
      title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
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
        marginTop: height*0.025,
        paddingHorizontal:width*0.06,
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
        paddingTop:height*0.01,
        fontSize: 16,
        fontWeight: 'bold',
      },
      detailsInfo: {
        fontSize: 14,
        color: 'grey',
      },
      bookingOverview:{
        borderTopWidth:0.2,
      },
      option:{
        flexDirection:'row',
        alignItems:'center'
      },
      options:{
        paddingVertical:height*0.017,
        gap:5
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
        height: height*0.06,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
      },
      addCreditCardButton: {
        flexDirection: 'row',
        justifyContent:'center',
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
      creditCard:{
        paddingVertical:height*0.03,
        borderTopWidth:0.2,
        borderBottomWidth:0.2
      },
      addressContainer:{
        marginVertical:height*0.03,
        borderBottomWidth:0.2  
      },
      flightContainer: {
        paddingHorizontal:width*0.06,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor:'#F8F8F8',
        borderRadius:10,
        justifyContent:'flex-start',
        gap:20
      },
      iconStyle: {
        marginRight: 10,
      },
      flightTitle: {
        fontSize:14,
        fontWeight:'700',
      
      },
      detailsText: {
        fontSize:12
      },
      text:{
        paddingVertical:height*0.02,
        gap:7,
        marginLeft: 10,
        flex: 1,
      },
      flight:{
        borderBottomWidth:0.2,
        paddingBottom:height*0.035,
        gap:15
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
        backgroundColor:'black'
      },
      important:{
        color:'grey',
        marginVertical:height*0.01,
        fontSize:12
      },
      bullet: {
        marginRight: 5,
        fontWeight: 'bold',
        color:'grey'
      },
})