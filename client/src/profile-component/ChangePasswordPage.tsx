import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ProfileStackType} from '../navigation/ProfileStack';
import {TextInput, Button} from 'react-native-paper';

type ChangeUsernamePageProps = NativeStackScreenProps<
  ProfileStackType,
  'ChangePasswordPage'
>;

const ChangePasswordPage = ({route, navigation}: ChangeUsernamePageProps) => {
  const {handleChangePassword} = route.params;
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [newPassword, setNewPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <View style={styles.parentContainer}>
      <Text style={styles.label}>Enter your new password</Text>
      <View>
        <TextInput
          value={newPassword}
          onChangeText={newPs => setNewPassword(newPs)}
          mode="outlined"
          placeholder="New password"
          style={styles.passwordInput}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setShowPassword(prev => !prev)}>
          <Image
            source={
              showPassword
                ? require('../../assets/img/hide.png')
                : require('../../assets/img/unhide.png')
            }
            style={styles.eyeIconImage}
          />
        </TouchableOpacity>
      </View>

      <Button
        mode="contained"
        onPress={async () => {
          try {
            setIsLoading(true);
            await handleChangePassword(newPassword);
            navigation.goBack();
          } catch (error) {
            console.log(error);
          } finally {
            setIsLoading(false);
          }
        }}
        style={styles.submitBtn}
        contentStyle={styles.buttonContent}
        disabled={isLoading}>
        {isLoading ? (
          <View className="flex-row">
            <Text>Saving changes</Text>
            <ActivityIndicator size="small" color="black" />
          </View>
        ) : (
          'Save changes'
        )}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  parentContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start',
    backgroundColor: 'white',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  passwordInput: {
    marginBottom: 20,
    backgroundColor: 'rgba(0,0,0,.1)',
  },
  submitBtn: {
    alignSelf: 'center',
    width: '60%',
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
    top: 15,
  },
  eyeIconImage: {
    width: 24,
    height: 24,
  },
});

export default ChangePasswordPage;
