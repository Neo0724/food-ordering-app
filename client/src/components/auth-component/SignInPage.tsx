import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useState} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {Controller, FieldErrors, useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {AuthStyles} from '../../../styles/AuthStyles';
import {ButtonStyle} from '../../../styles/ButtonStyles';
import {RootStackParamList} from '../../navigation/RootLayout';
import CustomTextInput from '../CustomTextInput';
import {signInSchema, UserSignInType} from './schemas/user-schema';
import {useCustomDialog} from '../../context/CustomDialogContext';

export default function SignInPage() {
  const {showDialog} = useCustomDialog();
  const stackNavigation =
    useNavigation<
      NativeStackNavigationProp<RootStackParamList, 'SignInPage'>
    >();

  // Hide or unhide password
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Sign in form hook
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    resolver: zodResolver(signInSchema),
  });

  // Handle sign in
  const submitSignIn = async (formData: UserSignInType) => {
    try {
      await auth().signInWithEmailAndPassword(
        formData.email,
        formData.password,
      );
    } catch (error: any) {
      if (error.code === 'auth/invalid-credential') {
        showDialog('Incorrect', 'Email or password is incorrect');
      } else {
        showDialog('Error', 'Please try again later');
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
          Welcome Back
        </Text>
        <Text className="text-base text-center text-gray-600 mt-2">
          Sign in to your Canteen App account using your email and password.
        </Text>
      </View>
      <View style={AuthStyles.container}>
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
          onPress={handleSubmit(submitSignIn, handleInvalidField)}
          style={ButtonStyle.generalButton}
          className="mt-14">
          <Text style={ButtonStyle.generalButtonText}>Submit</Text>
        </TouchableOpacity>

        <View>
          <Text className="self-center">Do not have an account yet? </Text>
          <TouchableOpacity
            className="justify-center items-center"
            onPress={() => stackNavigation.navigate('SignUpPage')}>
            <Text className="font-bold underline">Sign up now!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
