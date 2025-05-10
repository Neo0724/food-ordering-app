import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {useAuthContext} from '../context/AuthProvider';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {TextInput, useTheme} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {ProfileStackType} from '../navigation/ProfileStack';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {
  changePasswordSchema,
  changeUsernameSchema,
} from '../components/auth-component/schemas/user-schema';
import {useCustomDialog} from '../context/CustomDialogContext';
import {updatePassword, updateProfile} from '@react-native-firebase/auth';

const ProfilePage = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackType>>();
  const {user} = useAuthContext();
  const theme = useTheme();
  const {showDialog} = useCustomDialog();

  const handleChangeUsername = async (newUsername: string) => {
    try {
      const result = changeUsernameSchema.safeParse({username: newUsername});

      if (!result.success) {
        result.error.issues;
        showDialog('Input error', result.error.issues[0].message);
        throw Error('Username input is invalid ');
      }

      if (user) {
        await updateProfile(user, {
          displayName: newUsername,
        });
        showDialog('Success!', 'Username has been updated!');
      }
    } catch (error) {
      showDialog('Error', 'Please try again later.');
      throw error;
    }
  };

  const handleChangePassword = async (newPassword: string) => {
    try {
      const result = changePasswordSchema.safeParse({password: newPassword});

      if (!result.success) {
        result.error.issues;
        showDialog('Input error', result.error.issues[0].message);
        throw Error('Password input is invalid ');
      }

      if (user) {
        await updatePassword(user, newPassword);
        showDialog('Success!', 'Password has been updated!');
      }
    } catch (error) {
      showDialog('Error', 'Please try again later.');
      throw error;
    }
  };

  return (
    <View style={styles.parentContainer}>
      <View
        style={[
          styles.profilePicContainer,
          {
            backgroundColor: theme.colors.primary,
            shadowColor: theme.colors.primary,
          },
        ]}>
        <MaterialCommunityIcons name="account" size={80} color="white" />
        <Text className="font-bold text-white text-xl">
          {user?.displayName}
        </Text>
      </View>
      <View style={styles.infoContainer}>
        <View style={styles.updateContainer}>
          <Text style={styles.label}>Username</Text>
          <View style={styles.updateBox}>
            <TextInput
              value={user?.displayName ?? ''}
              disabled
              style={styles.inputBox}
            />
            <TouchableOpacity
              style={styles.updateButton}
              onPress={() =>
                navigation.navigate('ChangeUsernamePage', {
                  currentUsername: user?.displayName ?? '',
                  handleChangeUsername,
                })
              }>
              <MaterialCommunityIcons
                name="pencil-outline"
                size={30}
                color="black"
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.updateContainer}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.updateBox}>
            <TextInput value="*********" disabled style={styles.inputBox} />
            <TouchableOpacity
              style={styles.updateButton}
              onPress={() =>
                navigation.navigate('ChangePasswordPage', {
                  handleChangePassword,
                })
              }>
              <MaterialCommunityIcons
                name="pencil-outline"
                size={30}
                color="black"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  parentContainer: {
    flex: 1,
    alignItems: 'center',
    margin: 15,
  },
  profilePicContainer: {
    margin: 10,
    width: 150,
    height: 150,
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    width: '100%',
    padding: 20,
    flex: 1,
    gap: 20,
  },
  updateContainer: {
    gap: 5,
  },
  inputBox: {
    flex: 1,
    marginRight: 10,
  },
  updateButton: {
    backgroundColor: 'lightgray',
    borderRadius: 15,
    padding: 10,
  },
  updateBox: {
    flexDirection: 'row',
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
  },
});

export default ProfilePage;
