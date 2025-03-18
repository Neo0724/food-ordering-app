import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Image, Text, View, TouchableOpacity, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {RootStackParamList} from './RootLayout';
import {ButtonStyle} from '../../styles/ButtonStyles';

export default function LandingPage() {
  const navigation =
    useNavigation<
      NativeStackNavigationProp<RootStackParamList, 'LandingPage'>
    >();

  return (
    <SafeAreaView style={styles.mainContainer}>
      <Image
        source={require('../../assets/img/circle.png')}
        style={styles.circleImg}
      />
      <Text style={styles.appTitle}>Canteen Food Ordering</Text>
      <View style={styles.landingImg}>
        <Image source={require('../../assets/img/Illustration.png')} />
      </View>
      <Text style={styles.welcomeTitle}>Welcome!</Text>
      <Text style={styles.welcomeDescription}>
        Welcome It’s a pleasure to meet you. We are excited that you’re here so
        let’s get started!
      </Text>
      <TouchableOpacity
        style={ButtonStyle.generalButton}
        onPress={() => navigation.navigate('SignUpPage')}
        className="mt-[3rem]">
        <Text style={ButtonStyle.generalButtonText}>Get Started</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  landingImg: {
    alignItems: 'center',
    marginTop: 90,
  },
  mainContainer: {
    alignItems: 'center',
    margin: 10,
  },
  appTitle: {
    fontSize: 33,
    fontWeight: 'bold',
    marginTop: 45,
    fontFamily: 'Anton-Regular',
  },
  welcomeTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 20,
  },
  welcomeDescription: {
    textAlign: 'center',
    maxWidth: 275,
    fontSize: 15,
  },
  circleImg: {
    width: 400,
    height: 400,
    position: 'absolute',
    top: -75,
    left: -100,
  },
});
