import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useMemo} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import useTheme from '../../../../theme/hooks/useTheme';
import {AddEditQuestionScreenProps} from '../../../../types/navigation/appTypes';
import Header from '../../../../components/Header';
import TextField from '../../../../components/TextField';
import {responsiveFontSize} from '../../../../theme/responsiveFontSize';
import LOCALES from '../../../../localization/constants';
import {useTranslation} from 'react-i18next';
import Button from '../../../../components/Button';
import {useApi} from '../../../../hooks/useApi';
import {URL} from '../../../../constants/URLS';
import {appAlert} from '../../../../components/appAlert';
import {setIsForumScreenReload} from '../../../../store/slice/forumSlice';
import {useAppDispatch} from '../../../../store';

const AddEditQuestion = ({navigation, route}: AddEditQuestionScreenProps) => {
  const {title} = route.params;
  const {COLORS, BAR_STYLE, FONTS} = useTheme();
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const [question, setQuestion] = React.useState('');
  const [details, setDetails] = React.useState('');
  const titleStyle = useMemo(
    () => [
      [
        styles.title,
        {
          color: COLORS.SECONDARY_TEXT_COLOR,
          fontFamily: FONTS.MONTSERRAT.REGULAR,
        },
      ],
    ],
    [],
  );
  const isAddscreen = useMemo(
    () => title === t(LOCALES.FORUMS.LBL_ADD_QUESTION),
    [title, LOCALES],
  );

  const [addForum, addForumResponse, addForumError, isAddForumLoading] = useApi(
    {
      url: URL.ADD_FORUM,
      method: isAddscreen ? 'POST' : 'PUT',
    },
  );

  useEffect(() => {
    if (!isAddscreen) {
      setQuestion(route?.params?.question || '');
      setDetails(route?.params?.details || '');
    }
  }, [isAddscreen, route]);

  useEffect(() => {
    if (addForumResponse) {
      if (addForumResponse?.statusCode === 200) {
        navigation.goBack();
        dispatch(setIsForumScreenReload(true));
      }
    }
  }, [addForumResponse]);

  useEffect(() => {
    if (addForumError) {
      if (addForumError?.statusCode === 400) {
        appAlert({
          title: t(LOCALES.ERROR.LBL_ERROR),
          message: addForumError?.message,
        });
      }
    }
  }, [addForumError]);

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: COLORS.PRIMARY_COLOR}]}>
      <StatusBar
        backgroundColor={COLORS.STATUS_BAR_COLOR}
        barStyle={BAR_STYLE}
      />
      <Header
        title={
          isAddscreen
            ? t(LOCALES.FORUMS.LBL_ADD_QUESTION)
            : t(LOCALES.FORUMS.LBL_EDIT_QUESTION)
        }
        onBackPress={() => navigation.goBack()}
      />
      <KeyboardAvoidingView
        style={{flex: 1, flexDirection: 'column', justifyContent: 'center'}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        enabled>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{marginHorizontal: 20}}>
            <Text style={[titleStyle]}>{t(LOCALES.FORUMS.LBL_QUESTION)}</Text>
            <TextField
              parentStyle={{marginBottom: 20}}
              value={question}
              onChangeText={setQuestion}
            />
            <Text style={[titleStyle]}>
              {t(LOCALES.FORUMS.LBL_ANY_ADDITIONAL_DETAILS)}
            </Text>
            <TextField
              containerStyle={{height: 145, paddingVertical: 10}}
              textInputStyle={{height: '100%'}}
              multiline={true}
              value={details}
              onChangeText={setDetails}
            />
            <Button
              title={
                isAddscreen
                  ? t(LOCALES.FORUMS.LBL_SUBMIT)
                  : t(LOCALES.FORUMS.LBL_UPDATE)
              }
              onPress={() => {
                if (isAddscreen) {
                  const data = {
                    question: question.trim(),
                    details: details.trim(),
                  };
                  addForum(data);
                } else {
                  const data = {
                    forumId: route?.params?.forumId,
                    question: question.trim(),
                    details: details.trim(),
                  };
                  addForum(data);
                }
              }}
              disabled={!question.trim() || isAddForumLoading}
              loading={isAddForumLoading}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AddEditQuestion;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: responsiveFontSize(14),
    marginBottom: 10,
  },
});
