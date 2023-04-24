import {StyleSheet} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Onboarding from '../../screens/auth-screens/onboarding';
import SignIn from '../../screens/auth-screens/SignIn';
import {
  AuthStackParamList,
  ProfileStackParamList,
  SignUpStackParamList,
} from '../../types/navigation/authTypes';
import ForgotPassword from '../../screens/auth-screens/ForgotPassword';
import ResetPassword from '../../screens/auth-screens/ResetPassword';
import CreateAccount from '../../screens/auth-screens/SignUp/CreateAccount';
import ContactInformation from '../../screens/auth-screens/SignUp/ContactInformation';
import GenderInformation from '../../screens/auth-screens/SignUp/GenderInformation';
import NationalityInformation from '../../screens/auth-screens/SignUp/NationalityInformation';
import SetPassword from '../../screens/auth-screens/SignUp/SetPassword';
import BirthDateInformation from '../../screens/auth-screens/SignUp/BirthDateInformation';
import AccountCreated from '../../screens/auth-screens/Profile/AccountCreated';
import UploadPhoto from '../../screens/auth-screens/Profile/UploadPhoto';
import ProfileVerification from '../../screens/auth-screens/Profile/ProfileVerification';
import Bio from '../../screens/auth-screens/Profile/Bio';
import RelationshipStatus from '../../screens/auth-screens/Profile/RelationshipStatus';
import EnableLocation from '../../screens/auth-screens/Profile/EnableLocation';
import Interests from '../../screens/auth-screens/Profile/Interests';
import BucketList from '../../screens/auth-screens/Profile/BucketList';

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthRoutes = () => {
  return (
    <Stack.Navigator
      initialRouteName="Onboarding"
      screenOptions={{
        animation: 'slide_from_right',
      }}>
      <Stack.Screen
        name="Onboarding"
        component={Onboarding}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SignIn"
        component={SignIn}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPassword}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ResetPassword"
        component={ResetPassword}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SignUpStack"
        component={SignUpStackScreens}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AuthProfileStack"
        component={ProfileStackScreens}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

const SignUpStack = createNativeStackNavigator<SignUpStackParamList>();

const SignUpStackScreens = () => {
  return (
    <SignUpStack.Navigator
      initialRouteName="CreateAccount"
      screenOptions={{
        animation: 'none',
      }}>
      <SignUpStack.Screen
        name="CreateAccount"
        component={CreateAccount}
        options={{headerShown: false}}
      />
      <SignUpStack.Screen
        name="ContactInformation"
        component={ContactInformation}
        options={{headerShown: false}}
      />
      <SignUpStack.Screen
        name="GenderInformation"
        component={GenderInformation}
        options={{headerShown: false}}
      />
      <SignUpStack.Screen
        name="BirthDateInformation"
        component={BirthDateInformation}
        options={{headerShown: false}}
      />
      <SignUpStack.Screen
        name="NationalityInformation"
        component={NationalityInformation}
        options={{headerShown: false}}
      />
      <SignUpStack.Screen
        name="SetPassword"
        component={SetPassword}
        options={{headerShown: false}}
      />
    </SignUpStack.Navigator>
  );
};

const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();

const ProfileStackScreens = () => {
  return (
    <ProfileStack.Navigator
      initialRouteName="AccountCreated"
      screenOptions={{
        animation: 'none',
      }}>
      <ProfileStack.Screen
        name="AccountCreated"
        component={AccountCreated}
        options={{headerShown: false}}
      />
      <ProfileStack.Screen
        name="UploadPhoto"
        component={UploadPhoto}
        options={{headerShown: false}}
      />
      <ProfileStack.Screen
        name="ProfileVerification"
        component={ProfileVerification}
        options={{headerShown: false}}
      />
      <ProfileStack.Screen
        name="Bio"
        component={Bio}
        options={{headerShown: false}}
      />
      <ProfileStack.Screen
        name="RelationshipStatus"
        component={RelationshipStatus}
        options={{headerShown: false}}
      />
      <ProfileStack.Screen
        name="EnableLocation"
        component={EnableLocation}
        options={{headerShown: false}}
      />
      <ProfileStack.Screen
        name="Interests"
        component={Interests}
        options={{headerShown: false}}
      />
      <ProfileStack.Screen
        name="BucketList"
        component={BucketList}
        options={{headerShown: false}}
      />
    </ProfileStack.Navigator>
  );
};

export default AuthRoutes;

const styles = StyleSheet.create({});
