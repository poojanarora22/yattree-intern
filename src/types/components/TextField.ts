import {
  KeyboardTypeOptions,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';

export type TextFieldType = {
  leftIcon?: any;
  rightIcon?: any;
  containerStyle?: StyleProp<ViewStyle>;
  textInputStyle?: StyleProp<TextStyle>;
  parentStyle?: StyleProp<ViewStyle>;
  onLeftIconClick?: () => void;
  onRightIconClick?: () => void;
  customLeftIconStyle?: StyleProp<ViewStyle>;
  customRightIconStyle?: StyleProp<ViewStyle>;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  placeholder?: string;
  onChangeText?: (text: string) => void;
  value?: any;
  maxLength?: number;
  multiline?: boolean;
  editable?: boolean;
};
