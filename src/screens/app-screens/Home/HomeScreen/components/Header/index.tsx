import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {APP_LOGO, USER_PROFILE} from '../../../../../../assets/images';
import {CHAT} from '../../../../../../assets/icons/svg';
import Notification from '../../../../../../assets/icons/svg/Notification';
import useTheme from '../../../../../../theme/hooks/useTheme';
import {useAppSelector} from '../../../../../../store';
import Premium from '../../../../../../assets/icons/svg/premium';
import Verify from '../../../../../../assets/icons/svg/Verify';

type HeaderType = {
  unreadMessageCount?: number;
  onProfileIconClick?: () => void;
  onChatIconClick?: () => void;
  onNotificationIconClick?: () => void;
};

const Header = ({
  unreadMessageCount = 0,
  onProfileIconClick = () => {},
  onChatIconClick = () => {},
  onNotificationIconClick = () => {},
}: HeaderType) => {
  const {COLORS} = useTheme();
  const {userDetails} = useAppSelector(state => state.auth);
  return (
    <View style={styles.container}>
      <Image source={APP_LOGO} style={styles.image} />
      <View style={styles.iconContainer}>
        <Pressable style={styles.icon} onPress={onNotificationIconClick}>
          <Notification />
        </Pressable>
        <Pressable style={styles.icon} onPress={onChatIconClick}>
          <CHAT />
          {unreadMessageCount > 0 && (
            <View
              style={[styles.dot, {backgroundColor: COLORS.CHAT_DOT_COLOR}]}
            />
          )}
        </Pressable>
        <Pressable onPress={onProfileIconClick}>
          <Image
            source={
              userDetails?.avatar
                ? {uri: userDetails?.avatar?.mediaUrl}
                : USER_PROFILE
            }
            style={styles.profileImage}
          />
          <View style={styles.userStatus}>
            {userDetails?.isActiveSubscription ? (
              <Premium />
            ) : userDetails?.isKycVerified ? (
              <Verify />
            ) : null}
          </View>
        </Pressable>
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    height: 66,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 10,
  },
  image: {
    resizeMode: 'contain',
    height: 20,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    paddingHorizontal: 11,
  },
  profileImage: {
    height: 46,
    width: 46,
    borderRadius: 23,
  },
  dot: {
    position: 'absolute',
    height: 9,
    width: 9,
    borderRadius: 4,
    end: 8,
  },
  userStatus: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
});
