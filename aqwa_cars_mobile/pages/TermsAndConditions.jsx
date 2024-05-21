import { StyleSheet, Text, View, Pressable, Dimensions, ScrollView } from 'react-native'
import React,{useState} from 'react'
import ArrowBack from '../assets/Svg/blackArrow.svg'
import { useNavigation,useRoute } from '@react-navigation/native';
const { height, width } = Dimensions.get("screen");

const TermsAndConditions = () => {

  const route = useRoute()
  const navigation = useNavigation()

  const [isButtonEnabled, setButtonEnabled] = useState(false);

  const total = route.params.total

  console.log(total)

  const handleScroll = (event) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const paddingToBottom = 20;
    if (layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom) {
      setButtonEnabled(true);
    } else {
      setButtonEnabled(false);
    }
  };

  return (
    <View style={{flex: 1}}>
      <View style={styles.header}>
        <Pressable style={styles.arrowContainer}>
          <ArrowBack />
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={styles.container} onScroll={handleScroll}>
        <Text style={styles.title}>Terms and Conditions</Text>
        <Text style={styles.paragraph}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla dapibus massa sit amet
          tellus ullamcorper tristique. Donec auctor est nec sapien congue, vitae posuere est
          ultricies. Duis eget venenatis justo. Vestibulum at tempor risus. Quisque dictum non
          lectus quis gravida. Aenean nec velit non justo efficitur tincidunt. Sed tincidunt justo
          nec tellus ultricies feugiat. Integer nec mauris auctor, consectetur arcu vel, vulputate
          magna. Sed tristique sodales magna, sed lacinia nulla pulvinar quis. Nulla facilisi.
        </Text>
        
        <Text style={styles.paragraph}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla dapibus massa sit amet
          tellus ullamcorper tristique. Donec auctor est nec sapien congue, vitae posuere est
          ultricies. Duis eget venenatis justo. Vestibulum at tempor risus. Quisque dictum non
          lectus quis gravida. Aenean nec velit non justo efficitur tincidunt. Sed tincidunt justo
          nec tellus ultricies feugiat. Integer nec mauris auctor, consectetur arcu vel, vulputate
          magna. Sed tristique sodales magna, sed lacinia nulla pulvinar quis. Nulla facilisi.
        </Text>


        <Text style={styles.paragraph}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla dapibus massa sit amet
          tellus ullamcorper tristique. Donec auctor est nec sapien congue, vitae posuere est
          ultricies. Duis eget venenatis justo. Vestibulum at tempor risus. Quisque dictum non
          lectus quis gravida. Aenean nec velit non justo efficitur tincidunt. Sed tincidunt justo
          nec tellus ultricies feugiat. Integer nec mauris auctor, consectetur arcu vel, vulputate
          magna. Sed tristique sodales magna, sed lacinia nulla pulvinar quis. Nulla facilisi.
        </Text>

        <Text style={styles.paragraph}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla dapibus massa sit amet
          tellus ullamcorper tristique. Donec auctor est nec sapien congue, vitae posuere est
          ultricies. Duis eget venenatis justo. Vestibulum at tempor risus. Quisque dictum non
          lectus quis gravida. Aenean nec velit non justo efficitur tincidunt. Sed tincidunt justo
          nec tellus ultricies feugiat. Integer nec mauris auctor, consectetur arcu vel, vulputate
          magna. Sed tristique sodales magna, sed lacinia nulla pulvinar quis. Nulla facilisi.
        </Text>
        
      </ScrollView>
      <View style={styles.footer}>
        <View style={styles.optionWrapper}>
          <Text style={styles.optionsTitle}>Total</Text>
          <Text style={styles.optionsTitle}>{total} DT</Text>
        </View>
        <Pressable style={[styles.find, { backgroundColor: isButtonEnabled ? 'black' : 'grey' }]} disabled={!isButtonEnabled} onPress={()=>navigation.navigate('ReviewAndBook',{total:total})}>
          <Text style={styles.textButton}>Accept and Continue</Text>
        </Pressable>
      </View>
    </View>
  )
}

export default TermsAndConditions

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
  container: {
    flexGrow: 1, 
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  paragraph: {
    fontSize: 16,
    marginBottom: 15,
    lineHeight: 22,
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
  find: {
    width: width * 0.93,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    height: 50,
    borderRadius: 15,
    marginBottom: 20,
  },
  footer: {
    backgroundColor: 'white',
  },
  textButton: {
    color: 'white',
    fontSize: 15,
    fontWeight: '700',
  },
})
