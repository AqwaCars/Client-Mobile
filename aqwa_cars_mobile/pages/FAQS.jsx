import { StyleSheet, Text, View, Dimensions, Pressable,Linking } from 'react-native';
import React from 'react';
import ArrowBack from '../assets/Svg/blackArrow.svg';
import { Ionicons } from '@expo/vector-icons';
// import * as Cellular from 'expo-cellular';
import { useNavigation } from '@react-navigation/native';
const { height, width } = Dimensions.get("screen");

const FAQS = () => {

    const navigation = useNavigation()

    const handleCallCustomerSupport = () => {
        const phoneNumber=93933343
        Linking.openURL(`tel:${phoneNumber}`);
    };

    const handleCustomerSupportMail = (initialBody = '') => {
        const emailAddress = 'ksiksihakim0@gmail.com';
        const subject = 'Customer Support Request';
        const encodedBody = encodeURIComponent(initialBody);
        const mailtoUrl = `mailto:${emailAddress}?subject=${encodeURIComponent(subject)}&body=${encodedBody}`;
        Linking.openURL(mailtoUrl);
      };

    const handleReportDamage = () => {
        const phoneNumber=51977081
        Linking.openURL(`tel:${phoneNumber}`);
    };

    const handleRentalSupportMail = () => {
        const emailAddress = 'hakimjaycee@gmail.com';
        const subject = 'Rental Support Request';
        const encodedBody = encodeURIComponent(initialBody);
        const mailtoUrl = `mailto:${emailAddress}?subject=${encodeURIComponent(subject)}&body=${encodedBody}`;
        Linking.openURL(mailtoUrl);
    };

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <View style={styles.header} >
                <Pressable style={styles.arrowContainer} onPress={()=>navigation.goBack()}>
                <Ionicons name="arrow-back-circle" size={45} color="black" />

                </Pressable>
            </View>
            <View style={styles.list}>
                <Pressable style={[styles.pressable, styles.separator]} onPress={handleCallCustomerSupport}>
                    <Ionicons name="call-outline" size={24} color="black" />
                    <Text style={styles.text}>Call Customer Support</Text>
                </Pressable>
                <Pressable style={[styles.pressable, styles.separator]} onPress={handleCustomerSupportMail}>
                    <Ionicons name="mail-outline" size={24} color="black" />
                    <Text style={styles.text}>Customer Support (Mail)</Text>
                </Pressable>
                <Pressable style={[styles.pressable, styles.separator]} onPress={handleReportDamage}>
                    <Ionicons name="warning-outline" size={24} color="black" />
                    <Text style={styles.text}>Report Damage</Text>
                </Pressable>
                <Pressable style={[styles.pressable]} onPress={handleRentalSupportMail}>
                    <Ionicons name="mail-outline" size={24} color="black" />
                    <Text style={styles.text}>Rental Support (Mail)</Text>
                </Pressable>
            </View>
        </View>
    )
}

export default FAQS

const styles = StyleSheet.create({
    arrowContainer: {
        paddingHorizontal: width*0.06,
        paddingVertical: height*0.06,
    },
    pressable: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    separator: {
        borderBottomWidth: 1,
        borderBottomColor: '#e1e1e1', 
        paddingBottom: 10, 
    },
    text: {
        marginLeft: 15, 
        fontSize: 16,
        fontWeight: '700',
    },
    list: {
        paddingHorizontal: width * 0.06,
        // paddingVertical: height * 0.03
    }
})
