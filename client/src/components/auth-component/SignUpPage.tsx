import React, {useEffect, useState} from 'react';
import {zodResolver} from '@hookform/resolvers/zod';
import {Controller, useForm} from 'react-hook-form';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {ButtonStyle} from '../../../styles/ButtonStyles';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/RootLayout';
import {AuthStyles} from '../../../styles/AuthStyles';
import auth from '@react-native-firebase/auth';
import CustomTextInput from '../CustomTextInput';
import {signUpSchema, UserSignUpType} from './schemas/user-schema';
export default function SignUpPage() {
  const navigation =
    useNavigation<
      NativeStackNavigationProp<RootStackParamList, 'SignUpPage'>
    >();
  // Set sign up eror message and error
  const [signUpErrMsg, setSignUpErrMsg] = useState<string>('');
  const [signUpErr, setSignUpErr] = useState<boolean>(false);

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
      setSignUpErr(true);
      if (error.code === 'auth/email-already-in-use') {
        setSignUpErrMsg(
          'Email has already been used. Please try another email',
        );
      } else {
        setSignUpErrMsg(error.message);
      }
    }
  };

  // timeout for err msg
  useEffect(() => {
    if (signUpErr) {
      const errTimeout = setTimeout(() => {
        setSignUpErr(false);
        setSignUpErrMsg('');
      }, 3000);

      return () => clearTimeout(errTimeout);
    }
  }, [signUpErr]);
  return (
    <View>
      <Text className="text-4xl px-4 py-3">Welcome to XXX Canteen App</Text>
      <Text className="text-lg px-4">
        Enter your Email address and Password to sign up.
      </Text>
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
          onPress={handleSubmit(submitSignUp)}
          style={ButtonStyle.generalButton}
          className="mt-14">
          <Text style={ButtonStyle.generalButtonText}>Submit</Text>
        </TouchableOpacity>

        {signUpErr && (
          <Text className="self-center color-red-500 font-bold text-center text-lg">
            {signUpErrMsg}
          </Text>
        )}
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
