import {StyleProp, TextStyle, ViewStyle} from 'react-native';

export type ChipType = {
  leftIcon?: any;
  rightIcon?: any;
  containerStyle?: StyleProp<ViewStyle>;
  parentStyle?: StyleProp<ViewStyle>;
  customLabelStyle?: StyleProp<TextStyle>;
  onLeftIconClick?: () => void;
  onRightIconClick?: () => void;
  customLeftIconStyle?: StyleProp<ViewStyle>;
  customRightIconStyle?: StyleProp<ViewStyle>;
  title: string;
  onPress?: () => void;
  isSelected?: boolean;
};
