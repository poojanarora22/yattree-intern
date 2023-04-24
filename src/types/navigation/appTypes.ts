import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

export type RootStackParamList = {
  Root: NavigatorScreenParams<TabBarStackParamList>;
  HomeStack: NavigatorScreenParams<HomeStackParamList>;
  CreatePostStack: NavigatorScreenParams<CreatePostStackParamList>;
  ProfileStack: NavigatorScreenParams<ProfileStackParamList>;
  SettingStack: NavigatorScreenParams<SettingStackParamList>;
  ForumsStack: NavigatorScreenParams<ForumsStackParamList>;
  ChatStack: NavigatorScreenParams<ChatStackParamList>;
};

export type TabBarStackParamList = {
  Home: undefined;
  Map: undefined;
  CreatePost: undefined;
  Forums: undefined;
  Booking: undefined;
};

export type HomeStackParamList = {
  FeedDetails: {
    tourId: string;
  };
  Participants: {
    tourId: string;
    tourStatus: 'UPCOMING' | 'ONGOING' | 'COMPLETED';
    isUserJoin: boolean;
    isRequestAccepted: boolean;
  };
  Notification: undefined;
  Search: undefined;
};

export type CreatePostStackParamList = {
  CreatePostStepOne: undefined;
  CreatePostStepTwo: undefined;
  ChooseDestination: undefined;
};

export type ProfileStackParamList = {
  MyProfileScreen: undefined;
  UserProfileScreen: {
    userId: string;
  };
  ProfileStatus: undefined;
  ReviewsScreen: {
    isMyProfileScreen: boolean;
    userId: string;
  };
};

export type SettingStackParamList = {
  SettingsScreen: undefined;
  AccountSettingsScreen: undefined;
  NotificationsScreen: undefined;
  PermissionsScreen: undefined;
  SupportScreen: undefined;
  PersonalInformation: undefined;
  ChangePassword: undefined;
  ProfileVerification: undefined;
  MyInterests: undefined;
  BucketList: undefined;
  AboutUs: undefined;
  PrivacyPolicy: undefined;
  TermsConditions: undefined;
  ContactUs: undefined;
  PremiumPlan: undefined;
};

export type ForumsStackParamList = {
  ForumsDetails: {
    id: string;
  };
  AddEditQuestion: {
    title: string;
    forumId: string;
    question: string;
    details: string;
  };
};

export type ChatStackParamList = {
  ChatList: undefined;
  ChatDetails: {
    conversationsId: string;
    userId: string;
    name: string;
    imageUri: any;
    isActiveSubscription: boolean;
    isKycVerified: boolean;
  };
};

export type HomeScreenProps = CompositeScreenProps<
  BottomTabScreenProps<TabBarStackParamList, 'Home'>,
  NativeStackScreenProps<RootStackParamList>
>;

export type CreatePostScreenProps = CompositeScreenProps<
  BottomTabScreenProps<TabBarStackParamList, 'CreatePost'>,
  NativeStackScreenProps<RootStackParamList>
>;

export type ForumsScreenProps = CompositeScreenProps<
  BottomTabScreenProps<TabBarStackParamList, 'Forums'>,
  NativeStackScreenProps<RootStackParamList>
>;

export type FeedDetailsScreenProps = CompositeScreenProps<
  NativeStackScreenProps<HomeStackParamList, 'FeedDetails'>,
  NativeStackScreenProps<RootStackParamList>
>;

export type SearchScreenProps = CompositeScreenProps<
  NativeStackScreenProps<HomeStackParamList, 'Search'>,
  NativeStackScreenProps<RootStackParamList>
>;

export type ParticipantsScreenProps = CompositeScreenProps<
  NativeStackScreenProps<HomeStackParamList, 'Participants'>,
  NativeStackScreenProps<RootStackParamList>
>;

export type NotificationScreenProps = CompositeScreenProps<
  NativeStackScreenProps<HomeStackParamList, 'Notification'>,
  NativeStackScreenProps<RootStackParamList>
>;

export type CreatePostStepOneScreenProps = CompositeScreenProps<
  NativeStackScreenProps<CreatePostStackParamList, 'CreatePostStepOne'>,
  NativeStackScreenProps<RootStackParamList>
>;

export type CreatePostStepTwoScreenProps = CompositeScreenProps<
  NativeStackScreenProps<CreatePostStackParamList, 'CreatePostStepTwo'>,
  NativeStackScreenProps<RootStackParamList>
>;

export type ChooseDestinationScreenProps = CompositeScreenProps<
  NativeStackScreenProps<CreatePostStackParamList, 'ChooseDestination'>,
  NativeStackScreenProps<RootStackParamList>
>;

export type MyProfileScreenProps = CompositeScreenProps<
  NativeStackScreenProps<ProfileStackParamList, 'MyProfileScreen'>,
  NativeStackScreenProps<RootStackParamList>
>;

export type UserProfileScreenProps = CompositeScreenProps<
  NativeStackScreenProps<ProfileStackParamList, 'UserProfileScreen'>,
  NativeStackScreenProps<RootStackParamList>
>;

export type ProfileStatusScreenProps = CompositeScreenProps<
  NativeStackScreenProps<ProfileStackParamList, 'ProfileStatus'>,
  NativeStackScreenProps<RootStackParamList>
>;

export type ReviewsScreenProps = CompositeScreenProps<
  NativeStackScreenProps<ProfileStackParamList, 'ReviewsScreen'>,
  NativeStackScreenProps<RootStackParamList>
>;

export type SettingsScreenProps = CompositeScreenProps<
  NativeStackScreenProps<SettingStackParamList, 'SettingsScreen'>,
  NativeStackScreenProps<RootStackParamList>
>;

export type AccountSettingsScreenProps = CompositeScreenProps<
  NativeStackScreenProps<SettingStackParamList, 'AccountSettingsScreen'>,
  NativeStackScreenProps<RootStackParamList>
>;

export type NotificationsScreenProps = CompositeScreenProps<
  NativeStackScreenProps<SettingStackParamList, 'NotificationsScreen'>,
  NativeStackScreenProps<RootStackParamList>
>;
export type PermissionsScreenProps = CompositeScreenProps<
  NativeStackScreenProps<SettingStackParamList, 'PermissionsScreen'>,
  NativeStackScreenProps<RootStackParamList>
>;

export type SupportScreenProps = CompositeScreenProps<
  NativeStackScreenProps<SettingStackParamList, 'SupportScreen'>,
  NativeStackScreenProps<RootStackParamList>
>;

export type PersonalInformationScreenProps = CompositeScreenProps<
  NativeStackScreenProps<SettingStackParamList, 'PersonalInformation'>,
  NativeStackScreenProps<RootStackParamList>
>;

export type ProfileVerificationScreenProps = CompositeScreenProps<
  NativeStackScreenProps<SettingStackParamList, 'ProfileVerification'>,
  NativeStackScreenProps<RootStackParamList>
>;

export type ChangePasswordScreenProps = CompositeScreenProps<
  NativeStackScreenProps<SettingStackParamList, 'ChangePassword'>,
  NativeStackScreenProps<RootStackParamList>
>;

export type MyInterestsScreenProps = CompositeScreenProps<
  NativeStackScreenProps<SettingStackParamList, 'MyInterests'>,
  NativeStackScreenProps<RootStackParamList>
>;

export type BucketListScreenProps = CompositeScreenProps<
  NativeStackScreenProps<SettingStackParamList, 'BucketList'>,
  NativeStackScreenProps<RootStackParamList>
>;

export type AboutUsScreenProps = CompositeScreenProps<
  NativeStackScreenProps<SettingStackParamList, 'AboutUs'>,
  NativeStackScreenProps<RootStackParamList>
>;

export type ContactUsScreenProps = CompositeScreenProps<
  NativeStackScreenProps<SettingStackParamList, 'ContactUs'>,
  NativeStackScreenProps<RootStackParamList>
>;

export type TermsConditionsScreenProps = CompositeScreenProps<
  NativeStackScreenProps<SettingStackParamList, 'TermsConditions'>,
  NativeStackScreenProps<RootStackParamList>
>;

export type PrivacyPolicyScreenProps = CompositeScreenProps<
  NativeStackScreenProps<SettingStackParamList, 'PrivacyPolicy'>,
  NativeStackScreenProps<RootStackParamList>
>;

export type PremiumPlanScreenProps = CompositeScreenProps<
  NativeStackScreenProps<SettingStackParamList, 'PremiumPlan'>,
  NativeStackScreenProps<RootStackParamList>
>;

export type ForumsDetailsScreenProps = CompositeScreenProps<
  NativeStackScreenProps<ForumsStackParamList, 'ForumsDetails'>,
  NativeStackScreenProps<RootStackParamList>
>;

export type AddEditQuestionScreenProps = CompositeScreenProps<
  NativeStackScreenProps<ForumsStackParamList, 'AddEditQuestion'>,
  NativeStackScreenProps<RootStackParamList>
>;

export type ChatListScreenProps = CompositeScreenProps<
  NativeStackScreenProps<ChatStackParamList, 'ChatList'>,
  NativeStackScreenProps<RootStackParamList>
>;

export type ChatDetailsScreenProps = CompositeScreenProps<
  NativeStackScreenProps<ChatStackParamList, 'ChatDetails'>,
  NativeStackScreenProps<RootStackParamList>
>;
