import {StyleSheet} from 'react-native';
import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import useTheme from '../../../../theme/hooks/useTheme';
import Profile from '../../../../assets/icons/svg/Profile';
import Holidays from '../../../../assets/icons/svg/Profile/Holiday';
import Events from '../../../../assets/icons/svg/Profile/Event';
import Activities from '../../../../assets/icons/svg/Profile/Activity';
import ProfileDetails from './ProfileDetails.tsx';
import HolidayFeedScreen from './HolidayFeedScreen';
import EventFeedScreen from './EventFeedScreen';
import ActivityFeedScreen from './ActivityFeedScreen';

const Tab = createMaterialTopTabNavigator();

type TopTabsNavigatorTypes = {
  isMyProfileScreen: boolean;
  id: string;
};

const TopTabsNavigator = ({
  isMyProfileScreen = true,
  id = '',
}: TopTabsNavigatorTypes) => {
  const {COLORS} = useTheme();
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarStyle: {
          backgroundColor: COLORS.PRIMARY_COLOR,
          height: 50,
          borderTopWidth: 1,
          borderBottomWidth: 1,
          borderColor: COLORS.CHIP_INACTIVE_BORDER_COLOR,
        },
        tabBarIndicatorStyle: {
          borderBottomColor: COLORS.SECONDARY_COLOR,
          borderWidth: 1,
        },
        tabBarIcon: ({focused}) => {
          let icon;
          if (route.name === 'Profile') {
            icon = (
              <Profile
                opacity={focused ? 1 : 0.5}
                color={focused ? COLORS.SECONDARY_COLOR : COLORS.TERTIARY_COLOR}
              />
            );
          } else if (route.name === 'Holiday') {
            icon = (
              <Holidays
                opacity={focused ? 1 : 0.5}
                color={focused ? COLORS.SECONDARY_COLOR : COLORS.TERTIARY_COLOR}
              />
            );
          } else if (route.name === 'Event') {
            icon = (
              <Events
                opacity={focused ? 1 : 0.5}
                color={focused ? COLORS.SECONDARY_COLOR : COLORS.TERTIARY_COLOR}
              />
            );
          } else if (route.name === 'Activity') {
            icon = (
              <Activities
                opacity={focused ? 1 : 0.5}
                color={focused ? COLORS.SECONDARY_COLOR : COLORS.TERTIARY_COLOR}
              />
            );
          }
          return icon;
        },
        tabBarShowLabel: false,
        tabBarShowIcon: true,
      })}>
      <Tab.Screen
        name="Profile"
        component={ProfileDetails}
        initialParams={{isMyProfileScreen, id}}
      />
      <Tab.Screen
        name="Holiday"
        component={HolidayFeedScreen}
        initialParams={{isMyProfileScreen, id}}
      />
      <Tab.Screen
        name="Event"
        component={EventFeedScreen}
        initialParams={{isMyProfileScreen, id}}
      />
      <Tab.Screen
        name="Activity"
        component={ActivityFeedScreen}
        initialParams={{isMyProfileScreen, id}}
      />
    </Tab.Navigator>
  );
};

export default TopTabsNavigator;

const styles = StyleSheet.create({});
