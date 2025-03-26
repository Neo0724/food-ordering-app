/* eslint-disable react/no-unstable-nested-components */
import {useAuthContext} from '../context/AuthProvider';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LandingPage from '../components/LandingPage';
import SignInPage from '../components/SignInPage';
import SignUpPage from '../components/SignUpPage';
import BottomTabLayout from './BottomTab';

const RootStack = createNativeStackNavigator<RootStackParamList, 'RootStack'>();

export type RootStackParamList = {
  LandingPage: undefined;
  SignInPage: undefined;
  SignUpPage: undefined;
  BottomTabLayout: undefined;
};

export default function RootLayout() {
  const {user} = useAuthContext();

  if (user) {
    return <BottomTabLayout />;
  } else {
    return (
      <RootStack.Navigator initialRouteName="LandingPage" id="RootStack">
        {!user ? (
          <>
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
          </>
        ) : (
          <>
            <RootStack.Screen
              name="BottomTabLayout"
              component={BottomTabLayout}
            />
          </>
        )}
      </RootStack.Navigator>
    );
  }
}
