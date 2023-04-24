import {ReactElement, ReactNode} from 'react';
import {ColorValue, StyleProp, TextStyle, ViewStyle} from 'react-native';

export type ButtonType = {
  title: string;
  onPress?: () => void;
  customLabelStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode | ReactElement;
  containerStyle?: StyleProp<ViewStyle>;
  loaderColor?: ColorValue;
};
