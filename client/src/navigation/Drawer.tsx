import {createDrawerNavigator} from '@react-navigation/drawer';
import {NavigatorScreenParams} from '@react-navigation/native';
import BottomTabLayout, {BottomTabParamList} from './BottomTab';
import {useAuthContext} from '../context/AuthProvider';
import OwnCardStack, {OwnCardStackParamList} from './OwnCardStack';
import CustomDrawerComponent from './CustomDrawerComponent';
import {useTheme} from 'react-native-paper';
import ProfileStackLayout from './ProfileStack';

export type DrawerParamList = {
  OwnCardStack: NavigatorScreenParams<OwnCardStackParamList>;
  BottomTabLayout: NavigatorScreenParams<BottomTabParamList>;
  ProfileStack: undefined;
};

const DrawerNav = createDrawerNavigator<DrawerParamList>();

export default function DrawerLayout() {
  const theme = useTheme();
  const {user} = useAuthContext();
  return (
    <DrawerNav.Navigator
      initialRouteName="BottomTabLayout"
      screenOptions={{
        drawerActiveBackgroundColor: theme.colors.primary,
        drawerActiveTintColor: 'white',
      }}
      drawerContent={props => <CustomDrawerComponent {...props} />}>
      <DrawerNav.Screen
        name="BottomTabLayout"
        component={BottomTabLayout}
        options={{headerTitle: `Welcome, ${user?.displayName}!`, title: 'Home'}}
      />
      <DrawerNav.Screen
        name="OwnCardStack"
        component={OwnCardStack}
        options={{
          title: 'Canteen Card',
        }}
      />
      <DrawerNav.Screen
        name="ProfileStack"
        component={ProfileStackLayout}
        options={{
          title: 'Profile',
        }}
      />
    </DrawerNav.Navigator>
  );
}
