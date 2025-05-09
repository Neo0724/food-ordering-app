import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ProfilePage from '../profile-component/ProfilePage';
import ChangeUsernamePage from '../profile-component/ChangeUsernamePage';
import ChangePasswordPage from '../profile-component/ChangePasswordPage';

export type ProfileStackType = {
  ProfilePage: undefined;
  ChangeUsernamePage: {
    currentUsername: string;
    handleChangeUsername: (newUsername: string) => void;
  };
  ChangePasswordPage: {
    handleChangePassword: (newPassword: string) => void;
  };
};

const ProfileStack = createNativeStackNavigator<ProfileStackType>();

export default function ProfileStackLayout() {
  return (
    <ProfileStack.Navigator
      initialRouteName="ProfilePage"
      screenOptions={{
        headerShown: false,
      }}>
      <ProfileStack.Screen name="ProfilePage" component={ProfilePage} />
      <ProfileStack.Screen
        name="ChangeUsernamePage"
        component={ChangeUsernamePage}
        options={{
          headerShown: true,
          title: 'Change username',
        }}
      />
      <ProfileStack.Screen
        name="ChangePasswordPage"
        component={ChangePasswordPage}
        options={{
          headerShown: true,
          title: 'Change password',
        }}
      />
    </ProfileStack.Navigator>
  );
}
