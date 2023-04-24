import {Alert, AlertButton} from 'react-native';
import LOCALES from '../../localization/constants';
import {AppAlertType} from '../../types/components/appAlert';
import i18n from '../../localization/i18n';

export const appAlert = ({
  title = '',
  message,
  onOK = () => {},
  onCancel = () => {},
  showCancelButton = false,
}: AppAlertType) => {
  const buttonArrayWithCancel: Array<AlertButton> = [
    {
      text: i18n.t(LOCALES.ERROR.LBL_CANCEL),
      onPress: onCancel,
      style: 'cancel',
    },
    {text: i18n.t(LOCALES.ERROR.LBL_OK), onPress: onOK},
  ];

  const buttonArrayWithoutCancel: Array<AlertButton> = [
    {text: i18n.t(LOCALES.ERROR.LBL_OK), onPress: onOK},
  ];

  const button: Array<AlertButton> = showCancelButton
    ? buttonArrayWithCancel
    : buttonArrayWithoutCancel;

  Alert.alert(title, message, button);
};
