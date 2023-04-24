import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

export type AuthStackParamList = {
  Onboarding: undefined;
  SignIn: undefined;
  ForgotPassword: undefined;
  ResetPassword: {
    token: string;
    email: string;
  };
  SignUpStack: NavigatorScreenParams<SignUpStackParamList>;
  AuthProfileStack: NavigatorScreenParams<ProfileStackParamList>;
};

export type SignUpStackParamList = {
  CreateAccount: undefined;
  ContactInformation: undefined;
  GenderInformation: undefined;
  BirthDateInformation: undefined;
  NationalityInformation: undefined;
  SetPassword: undefined;
};

export type ProfileStackParamList = {
  AccountCreated: undefined;
  UploadPhoto: undefined;
  ProfileVerification: undefined;
  Bio: undefined;
  RelationshipStatus: undefined;
  EnableLocation: undefined;
  Interests: undefined;
  BucketList: undefined;
};

export type OnboardingScreenProps = NativeStackScreenProps<
  AuthStackParamList,
  'Onboarding'
>;

export type SignInScreenProps = NativeStackScreenProps<
  AuthStackParamList,
  'SignIn'
>;

export type ForgotPasswordScreenProps = NativeStackScreenProps<
  AuthStackParamList,
  'ForgotPassword'
>;

export type ResetPasswordScreenProps = NativeStackScreenProps<
  AuthStackParamList,
  'ResetPassword'
>;

export type CreateAccountScreenProps = CompositeScreenProps<
  NativeStackScreenProps<AuthStackParamList>,
  NativeStackScreenProps<SignUpStackParamList, 'CreateAccount'>
>;

export type ContactInformationScreenProps = CompositeScreenProps<
  NativeStackScreenProps<AuthStackParamList>,
  NativeStackScreenProps<SignUpStackParamList, 'ContactInformation'>
>;

export type GenderInformationScreenProps = CompositeScreenProps<
  NativeStackScreenProps<AuthStackParamList>,
  NativeStackScreenProps<SignUpStackParamList, 'GenderInformation'>
>;

export type BirthDateInformationScreenProps = CompositeScreenProps<
  NativeStackScreenProps<AuthStackParamList>,
  NativeStackScreenProps<SignUpStackParamList, 'BirthDateInformation'>
>;

export type NationalityInformationScreenProps = CompositeScreenProps<
  NativeStackScreenProps<AuthStackParamList>,
  NativeStackScreenProps<SignUpStackParamList, 'NationalityInformation'>
>;

export type SetPasswordScreenProps = CompositeScreenProps<
  NativeStackScreenProps<AuthStackParamList>,
  NativeStackScreenProps<SignUpStackParamList, 'SetPassword'>
>;

export type AccountCreatedScreenProps = CompositeScreenProps<
  NativeStackScreenProps<AuthStackParamList>,
  NativeStackScreenProps<ProfileStackParamList, 'AccountCreated'>
>;

export type UploadPhotoScreenProps = CompositeScreenProps<
  NativeStackScreenProps<AuthStackParamList>,
  NativeStackScreenProps<ProfileStackParamList, 'UploadPhoto'>
>;

export type ProfileVerificationScreenProps = CompositeScreenProps<
  NativeStackScreenProps<AuthStackParamList>,
  NativeStackScreenProps<ProfileStackParamList, 'ProfileVerification'>
>;

export type BioScreenProps = CompositeScreenProps<
  NativeStackScreenProps<AuthStackParamList>,
  NativeStackScreenProps<ProfileStackParamList, 'Bio'>
>;
export type RelationshipStatusScreenProps = CompositeScreenProps<
  NativeStackScreenProps<AuthStackParamList>,
  NativeStackScreenProps<ProfileStackParamList, 'RelationshipStatus'>
>;
export type EnableLocationScreenProps = CompositeScreenProps<
  NativeStackScreenProps<AuthStackParamList>,
  NativeStackScreenProps<ProfileStackParamList, 'EnableLocation'>
>;
export type InterestsScreenProps = CompositeScreenProps<
  NativeStackScreenProps<AuthStackParamList>,
  NativeStackScreenProps<ProfileStackParamList, 'Interests'>
>;
export type BucketListScreenProps = CompositeScreenProps<
  NativeStackScreenProps<AuthStackParamList>,
  NativeStackScreenProps<ProfileStackParamList, 'BucketList'>
>;
