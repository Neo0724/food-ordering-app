import React, {useState} from 'react';
import {zodResolver} from '@hookform/resolvers/zod';
import {Controller, FieldError, FieldErrors, useForm} from 'react-hook-form';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {ButtonStyle} from '../../../styles/ButtonStyles';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/RootLayout';
import {AuthStyles} from '../../../styles/AuthStyles';
import auth from '@react-native-firebase/auth';
import CustomTextInput from '../CustomTextInput';
import {signUpSchema, UserSignUpType} from './schemas/user-schema';
import {useCustomDialog} from '../../context/CustomDialogContext';
export default function SignUpPage() {
  const {showDialog} = useCustomDialog();
  const navigation =
    useNavigation<
      NativeStackNavigationProp<RootStackParamList, 'SignUpPage'>
    >();
  // Hide or unhide password
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Sign Up form hook
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    resolver: zodResolver(signUpSchema),
  });

  // Handle sign up
  const submitSignUp = async (formData: UserSignUpType) => {
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(
        formData.email,
        formData.password,
      );

      await userCredential.user.updateProfile({
        displayName: formData.username,
      });

      navigation.navigate('SignInPage');
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        showDialog(
          'Duplicate email',
          'Email has already been used. Please try another email',
        );
      } else {
        showDialog('Duplicate email', error.message);
      }
    }
  };

  const handleInvalidField = (fieldError: FieldErrors) => {
    const allErrorMsg = Object.values(fieldError).map(
      (error: any) => error.message,
    );

    showDialog('Invalid input', allErrorMsg.join('\n'));
  };

  return (
    <View>
      <View className="px-4 py-6 gap-5">
        <Text className="text-3xl font-bold text-center text-gray-800">
          Create Your Account
        </Text>
        <Text className="text-base text-center text-gray-600 mt-2">
          Sign up with your email address and start using the Canteen App today.
        </Text>
      </View>
      <View style={AuthStyles.container}>
        <Text>Username</Text>
        <Controller
          control={control}
          name="username"
          render={({field: {onChange, onBlur, value}}) => (
            <CustomTextInput
              style={AuthStyles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Enter your name"
              keyboardType="default"
            />
          )}
        />
        {errors.username && (
          <Text style={AuthStyles.error}>{errors.username.message}</Text>
        )}

        <Text>Email</Text>
        <Controller
          control={control}
          name="email"
          render={({field: {onChange, onBlur, value}}) => (
            <CustomTextInput
              style={AuthStyles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Enter your email"
              keyboardType="default"
            />
          )}
        />
        {errors.email && (
          <Text style={AuthStyles.error}>{errors.email.message}</Text>
        )}

        <Text>Password</Text>
        <Controller
          control={control}
          name="password"
          render={({field: {onChange, onBlur, value}}) => (
            <View>
              <CustomTextInput
                style={AuthStyles.input}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Enter your password"
                keyboardType="default"
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                className="absolute right-3 top-[.9rem]"
                onPress={() => setShowPassword(prev => !prev)}>
                <Image
                  source={
                    showPassword
                      ? require('../../../assets/img/unhide.png')
                      : require('../../../assets/img/hide.png')
                  }
                  className="w-7 h-7"
                />
              </TouchableOpacity>
            </View>
          )}
        />
        {errors.password && (
          <Text style={AuthStyles.error}>{errors.password.message}</Text>
        )}

        <TouchableOpacity
          onPress={handleSubmit(submitSignUp, handleInvalidField)}
          style={ButtonStyle.generalButton}
          className="mt-14">
          <Text style={ButtonStyle.generalButtonText}>Submit</Text>
        </TouchableOpacity>

        <View>
          <Text className="self-center">Already have an account? </Text>
          <TouchableOpacity
            className="justify-center items-center"
            onPress={() => navigation.navigate('SignInPage')}>
            <Text className="font-bold underline">Sign in now!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
