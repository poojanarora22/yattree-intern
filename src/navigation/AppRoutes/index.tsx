import {StyleSheet} from 'react-native';
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from '../../assets/icons/svg/Home';
import Map from '../../assets/icons/svg/Map';
import Add from '../../assets/icons/svg/Add';
import Forums from '../../assets/icons/svg/Forums';
import Booking from '../../assets/icons/svg/Booking';
import useTheme from '../../theme/hooks/useTheme';
import EmptyComponent from '../../components/EmptyComponent';
import HomeScreen from '../../screens/app-screens/Home/HomeScreen';
import CreatePostScreen from '../../screens/app-screens/CreatePost/index';
import {
  ChatStackParamList,
  CreatePostStackParamList,
  ForumsStackParamList,
  HomeStackParamList,
  RootStackParamList,
  SettingStackParamList,
  TabBarStackParamList,
} from '../../types/navigation/appTypes';
import FeedDetails from '../../screens/app-screens/Home/HomeScreen/FeedDetails';
import CreatePostStepOne from '../../screens/app-screens/CreatePost/CreatePostStepOne';
import CreatePostStepTwo from '../../screens/app-screens/CreatePost/CreatePostStepTwo';
import ChooseDestination from '../../screens/app-screens/CreatePost/ChooseDestination';
import {ProfileStackParamList} from '../../types/navigation/appTypes';
import MyProfileScreen from '../../screens/app-screens/Profile/MyProfileScreen';
import UserProfileScreen from '../../screens/app-screens/Profile/UserProfileScreen';
import ProfileStatus from '../../screens/app-screens/Profile/ProfileStatus';
import Participants from '../../screens/app-screens/Home/HomeScreen/Participants';
import ReviewsScreen from '../../screens/app-screens/Profile/ReviewsScreen';
import SettingsScreen from '../../screens/app-screens/Setting';
import AccountSettingsScreen from '../../screens/app-screens/Setting/AccountSettingsScreen';
import NotificationsScreen from '../../screens/app-screens/Setting/NotificationsScreen';
import PermissionsScreen from '../../screens/app-screens/Setting/PermissionsScreen';
import SupportScreen from '../../screens/app-screens/Setting/SupportScreen';
import PersonalInformation from '../../screens/app-screens/Setting/PersonalInformation';
import ChangePassword from '../../screens/app-screens/Setting/ChangePassword';
import ProfileVerification from '../../screens/app-screens/Setting/ProfileVerification';
import MyInterests from '../../screens/app-screens/Setting/MyInterests';
import BucketList from '../../screens/app-screens/Setting/BucketList';
import AboutUs from '../../screens/app-screens/Setting/AboutUs';
import ContactUs from '../../screens/app-screens/Setting/ContactUs';
import PrivacyPolicy from '../../screens/app-screens/Setting/PrivacyPolicy';
import TermsConditions from '../../screens/app-screens/Setting/TermsConditions';
import ForumsScreen from '../../screens/app-screens/Forums';
import ForumsDetails from '../../screens/app-screens/Forums/ForumsDetails';
import AddEditQuestion from '../../screens/app-screens/Forums/AddEditQuestion';
import ChatList from '../../screens/app-screens/Chat';
import ChatDetails from '../../screens/app-screens/Chat/ChatDetails';
import Notifications from '../../screens/app-screens/Notifications';
import MapScreen from '../../screens/app-screens/Map';
import Search from '../../screens/app-screens/Search';
import PremiumPlan from '../../screens/app-screens/Setting/PremiumPlan';

const Tab = createBottomTabNavigator<TabBarStackParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

const AppRoutes = () => {
  return (
    <Stack.Navigator
      initialRouteName="Root"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}>
      <Stack.Screen component={TabBar} name="Root" />
      <Stack.Screen component={HomeStackScreens} name="HomeStack" />
      <Stack.Screen component={CreatePostStackScreens} name="CreatePostStack" />
      <Stack.Screen component={ProfileStackScreens} name="ProfileStack" />
      <Stack.Screen component={SettingStackScreens} name="SettingStack" />
      <Stack.Screen component={ForumsStackScreens} name="ForumsStack" />
      <Stack.Screen component={ChatStackScreens} name="ChatStack" />
    </Stack.Navigator>
  );
};

const TabBar = () => {
  const {COLORS} = useTheme();
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarStyle: {
          backgroundColor: COLORS.PRIMARY_COLOR,
          borderTopWidth: 0,
        },
        tabBarIcon: ({focused}) => {
          let icon;
          if (route.name === 'Home') {
            icon = (
              <Home
                color={focused ? COLORS.SECONDARY_COLOR : COLORS.TERTIARY_COLOR}
              />
            );
          } else if (route.name === 'Map') {
            icon = (
              <Map
                color={focused ? COLORS.SECONDARY_COLOR : COLORS.TERTIARY_COLOR}
              />
            );
          } else if (route.name === 'CreatePost') {
            icon = (
              <Add
                color={focused ? COLORS.SECONDARY_COLOR : COLORS.TERTIARY_COLOR}
              />
            );
          } else if (route.name === 'Forums') {
            icon = (
              <Forums
                color={focused ? COLORS.SECONDARY_COLOR : COLORS.TERTIARY_COLOR}
              />
            );
          } else if (route.name === 'Booking') {
            icon = (
              <Booking
                color={focused ? COLORS.SECONDARY_COLOR : COLORS.TERTIARY_COLOR}
              />
            );
          }
          return icon;
        },
        tabBarShowLabel: false,
        headerShown: false,
      })}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="CreatePost" component={CreatePostScreen} />
      <Tab.Screen name="Forums" component={ForumsScreen} />
      <Tab.Screen name="Booking" component={EmptyComponent} />
    </Tab.Navigator>
  );
};

const HomeStack = createNativeStackNavigator<HomeStackParamList>();

const HomeStackScreens = () => {
  return (
    <HomeStack.Navigator
      initialRouteName="FeedDetails"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}>
      <HomeStack.Screen name="FeedDetails" component={FeedDetails} />
      <HomeStack.Screen name="Participants" component={Participants} />
      <HomeStack.Screen name="Notification" component={Notifications} />
      <HomeStack.Screen name="Search" component={Search} />
    </HomeStack.Navigator>
  );
};

const CreatePostStack = createNativeStackNavigator<CreatePostStackParamList>();

const CreatePostStackScreens = () => {
  return (
    <CreatePostStack.Navigator
      initialRouteName="CreatePostStepOne"
      screenOptions={{
        headerShown: false,
        animation: 'none',
      }}>
      <CreatePostStack.Screen
        name="CreatePostStepOne"
        component={CreatePostStepOne}
      />
      <CreatePostStack.Screen
        name="CreatePostStepTwo"
        component={CreatePostStepTwo}
      />
      <CreatePostStack.Screen
        name="ChooseDestination"
        component={ChooseDestination}
        options={{animation: 'slide_from_right'}}
      />
    </CreatePostStack.Navigator>
  );
};
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();

const ProfileStackScreens = () => {
  return (
    <ProfileStack.Navigator
      initialRouteName="MyProfileScreen"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}>
      <ProfileStack.Screen name="MyProfileScreen" component={MyProfileScreen} />
      <ProfileStack.Screen
        name="UserProfileScreen"
        component={UserProfileScreen}
      />
      <ProfileStack.Screen name="ProfileStatus" component={ProfileStatus} />
      <ProfileStack.Screen name="ReviewsScreen" component={ReviewsScreen} />
    </ProfileStack.Navigator>
  );
};

const SettingStack = createNativeStackNavigator<SettingStackParamList>();

const SettingStackScreens = () => {
  return (
    <SettingStack.Navigator
      initialRouteName="SettingsScreen"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}>
      <SettingStack.Screen name="SettingsScreen" component={SettingsScreen} />
      <SettingStack.Screen
        name="AccountSettingsScreen"
        component={AccountSettingsScreen}
      />
      <SettingStack.Screen
        name="NotificationsScreen"
        component={NotificationsScreen}
      />
      <SettingStack.Screen
        name="PermissionsScreen"
        component={PermissionsScreen}
      />
      <SettingStack.Screen name="SupportScreen" component={SupportScreen} />
      <SettingStack.Screen
        name="PersonalInformation"
        component={PersonalInformation}
      />
      <SettingStack.Screen name="ChangePassword" component={ChangePassword} />
      <SettingStack.Screen
        name="ProfileVerification"
        component={ProfileVerification}
      />
      <SettingStack.Screen name="MyInterests" component={MyInterests} />
      <SettingStack.Screen name="BucketList" component={BucketList} />
      <SettingStack.Screen name="AboutUs" component={AboutUs} />
      <SettingStack.Screen name="ContactUs" component={ContactUs} />
      <SettingStack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
      <SettingStack.Screen name="TermsConditions" component={TermsConditions} />
      <SettingStack.Screen name="PremiumPlan" component={PremiumPlan} />
    </SettingStack.Navigator>
  );
};

const ForumsStack = createNativeStackNavigator<ForumsStackParamList>();

const ForumsStackScreens = () => {
  return (
    <ForumsStack.Navigator
      initialRouteName="ForumsDetails"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}>
      <ForumsStack.Screen name="ForumsDetails" component={ForumsDetails} />
      <ForumsStack.Screen name="AddEditQuestion" component={AddEditQuestion} />
    </ForumsStack.Navigator>
  );
};

const ChatStack = createNativeStackNavigator<ChatStackParamList>();

const ChatStackScreens = () => {
  return (
    <ChatStack.Navigator
      initialRouteName="ChatList"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}>
      <ChatStack.Screen name="ChatList" component={ChatList} />
      <ChatStack.Screen name="ChatDetails" component={ChatDetails} />
    </ChatStack.Navigator>
  );
};

export default AppRoutes;

const styles = StyleSheet.create({});
