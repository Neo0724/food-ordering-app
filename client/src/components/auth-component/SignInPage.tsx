import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {Controller, useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {AuthStyles} from '../../../styles/AuthStyles';
import {ButtonStyle} from '../../../styles/ButtonStyles';
import {RootStackParamList} from '../../navigation/RootLayout';
import CustomTextInput from '../CustomTextInput';
import {signInSchema, UserSignInType} from './schemas/user-schema';

export default function SignInPage() {
  const stackNavigation =
    useNavigation<
      NativeStackNavigationProp<RootStackParamList, 'SignInPage'>
    >();

  // Set sign in eror message and error
  const [signInErrMsg, setSignInErrMsg] = useState<string>('');
  const [signInErr, setSignInErr] = useState<boolean>(false);

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
      setSignInErr(true);
      if (error.code === 'auth/invalid-credential') {
        setSignInErrMsg('Email or password is incorrect');
      } else {
        setSignInErrMsg(error.message);
      }
    }
  };

  // timeout for err msg
  useEffect(() => {
    if (signInErr) {
      const errTimeout = setTimeout(() => {
        setSignInErr(false);
        setSignInErrMsg('');
      }, 3000);

      return () => clearTimeout(errTimeout);
    }
  }, [signInErr]);
  return (
    <View>
      <Text className="text-4xl px-4 py-3">Welcome to XXX Canteen App</Text>
      <Text className="text-lg px-4">
        Enter your Email address and Password to sign in.
      </Text>
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
          onPress={handleSubmit(submitSignIn)}
          style={ButtonStyle.generalButton}
          className="mt-14">
          <Text style={ButtonStyle.generalButtonText}>Submit</Text>
        </TouchableOpacity>

        {signInErr && (
          <Text className="self-center color-red-500 font-bold text-center text-lg">
            {signInErrMsg}
          </Text>
        )}
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
