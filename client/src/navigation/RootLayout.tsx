import {useAuthContext} from '../context/AuthProvider';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LandingPage from '../components/LandingPage';
import SignInPage from '../components/SignInPage';
import SignUpPage from '../components/SignUpPage';
import BottomTabLayout, {BottomTabParamList} from './BottomTab';
import CheckoutStackLayout, {CheckoutStackParamList} from './CheckoutStack';
import {NavigatorScreenParams} from '@react-navigation/native';

const RootStack = createNativeStackNavigator<RootStackParamList>();

export type RootStackParamList = {
  LandingPage: undefined;
  SignInPage: undefined;
  SignUpPage: undefined;
  BottomTabLayout: NavigatorScreenParams<BottomTabParamList>;
  CheckoutStack: NavigatorScreenParams<CheckoutStackParamList>;
};

export default function RootLayout() {
  const {user} = useAuthContext();

  return (
    <RootStack.Navigator
      initialRouteName={user ? 'BottomTabLayout' : 'LandingPage'}>
      {!user ? (
        /* For not signed in user */
        <RootStack.Group>
          <RootStack.Screen
            name="LandingPage"
            component={LandingPage}
            options={{title: 'Welcome!'}}
          />
          <RootStack.Screen
            name="SignInPage"
            component={SignInPage}
            options={{title: 'Sign In'}}
          />
          <RootStack.Screen
            name="SignUpPage"
            component={SignUpPage}
            options={{title: 'Sign Up'}}
          />
        </RootStack.Group>
      ) : (
        /* For signed in user */
        <RootStack.Group>
          <RootStack.Screen
            name="BottomTabLayout"
            component={BottomTabLayout}
            options={{headerShown: false}}
          />
          <RootStack.Screen
            name="CheckoutStack"
            component={CheckoutStackLayout}
            options={{headerShown: false}}
          />
        </RootStack.Group>
      )}
    </RootStack.Navigator>
  );
}
