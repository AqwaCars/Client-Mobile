import { StyleSheet, Text, View, Pressable, Dimensions, ScrollView,Image,LayoutAnimation } from 'react-native'
import React,{useState} from 'react'
import ArrowBack from '../assets/Svg/blackArrow.svg'
import { Ionicons } from '@expo/vector-icons';
const { height, width } = Dimensions.get("screen");
import Tick from '../assets/Svg/tick.svg'
import NavTab from '../components/NavBar';
import { useNavigation } from '@react-navigation/native';

const BookingHistory = () => {
  const navigation = useNavigation()

    const [showDetails, setShowDetails] = useState(false);


    const handlePress = () => {
        setShowDetails(!showDetails);
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

      };

  return (
    <View style={{flex:1,backgroundColor:'white'}}>
      
        <Pressable style={styles.arrowContainer} onPress={()=>navigation.goBack()}>
        <Ionicons name="arrow-back-circle" size={45} color="black" />
        </Pressable>
      
      <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Booking History</Text>
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
  <Text>Additional driver : Yes</Text>
  </View>
  <View style={styles.option}>
  <Text>Unlimited Kms : Yes</Text>
  </View>
  </View>
</View>
  </View>
  
)}
    </Pressable>
      </ScrollView>
      <NavTab/>
    </View>
  )
}

export default BookingHistory

const styles = StyleSheet.create({
    arrowContainer: {
        paddingHorizontal: width*0.06,
        paddingVertical: height*0.06,
      },
      container: {
        flexGrow: 1, 
        // backgroundColor: '#f0f0f0',
        // padding: 20,
        paddingHorizontal:width*0.04
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
      option:{
        flexDirection:'row',
        alignItems:'center'
      },
      options:{
        paddingVertical:height*0.017,
        gap:5
      },
      detailsText: {
        fontSize:12
      },
      detailsTitle: {
        paddingTop:height*0.01,
        fontSize: 16,
        fontWeight: 'bold',
      },
      detailsSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
      },
})