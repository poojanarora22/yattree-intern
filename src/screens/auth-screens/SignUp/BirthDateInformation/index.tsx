import {StyleSheet, View} from 'react-native';
import React, {useCallback, useState} from 'react';
import DatePicker from 'react-native-date-picker';

import WrapperScreen from '../WrapperScreen';
import {BirthDateInformationScreenProps} from '../../../../types/navigation/authTypes';
import {useTranslation} from 'react-i18next';
import LOCALES from '../../../../localization/constants';
import {useAppDispatch, useAppSelector} from '../../../../store';
import {setSignUpUserData} from '../../../../store/slice/authSlice';
import moment from 'moment';
import {appAlert} from '../../../../components/appAlert';

const BirthDateInformation = ({
  navigation,
}: BirthDateInformationScreenProps) => {
  const [date, setDate] = useState(new Date());
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const {signUpUserData} = useAppSelector(state => state.auth);

  const onContinue = useCallback(() => {
    let years = moment().diff(date, 'years', false);
    if (years < 18) {
      appAlert({
        title: t(LOCALES.ERROR.LBL_ERROR),
        message: 'You must be at least 18 years old to use this app',
      });
      return;
    }
    dispatch(
      setSignUpUserData({
        ...signUpUserData,
        dateOfBirth: moment(date).format('YYYY-MM-DD'),
      }),
    );
    navigation.navigate('NationalityInformation');
  }, [signUpUserData, date]);

  return (
    <WrapperScreen
      title={t(LOCALES.SIGNUP.BIRTH_INFORMATION)}
      stepNumber={4}
      onBackPress={() => navigation.goBack()}
      onContinue={onContinue}>
      <View style={styles.dateContainer}>
        <DatePicker
          date={date}
          onDateChange={setDate}
          maximumDate={new Date()}
          theme="dark"
          mode="date"
          androidVariant="iosClone"
          fadeToColor={'none'}
        />
      </View>
    </WrapperScreen>
  );
};

export default BirthDateInformation;

const styles = StyleSheet.create({
  dateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
