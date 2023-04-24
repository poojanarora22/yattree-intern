import {Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import useTheme from '../../../../theme/hooks/useTheme';
import {useTranslation} from 'react-i18next';
import {
  BottomSheetFlatList,
  BottomSheetModal,
  BottomSheetTextInput,
} from '@gorhom/bottom-sheet';
import {BlurView} from '@react-native-community/blur';
import {responsiveFontSize} from '../../../../theme/responsiveFontSize';
import LOCALES from '../../../../localization/constants';
import Check from '../../../../assets/icons/svg/Check';
import Button from '../../../../components/Button';
import {useApi} from '../../../../hooks/useApi';
import {URL} from '../../../../constants/URLS';
import {appAlert} from '../../../../components/appAlert';

type ReportModalType = {
  bottomSheetModalRef: any;
  reportType: 'USER' | 'FORUM' | 'TOUR';
  reportId: string;
  onSuccessfulReport?: () => void;
};

const ReportModal = ({
  bottomSheetModalRef,
  reportType,
  reportId,
  onSuccessfulReport = () => {},
}: ReportModalType) => {
  const {COLORS, FONTS} = useTheme();
  const {t} = useTranslation();
  const snapPoints = useMemo(() => ['60%', '90%'], []);
  const DATA = [
    {
      id: 0,
      name: t(LOCALES.PROFILE.REPORT_1),
      isSelected: false,
    },
    {
      id: 1,
      name: t(LOCALES.PROFILE.REPORT_2),
      isSelected: false,
    },
    {
      id: 2,
      name: t(LOCALES.PROFILE.REPORT_3),
      isSelected: false,
    },
    {
      id: 3,
      name: t(LOCALES.PROFILE.REPORT_4),
      isSelected: false,
    },
    {
      id: 4,
      name: t(LOCALES.PROFILE.REPORT_5),
      isSelected: false,
    },
    {
      id: 5,
      name: t(LOCALES.PROFILE.REPORT_6),
      isSelected: false,
    },
    {
      id: 6,
      name: t(LOCALES.PROFILE.REPORT_7),
      isSelected: false,
    },
    {
      id: 7,
      name: t(LOCALES.PROFILE.REPORT_8),
      isSelected: false,
    },
    {
      id: 8,
      name: t(LOCALES.PROFILE.REPORT_9),
      isSelected: false,
    },
    {
      id: 9,
      name: t(LOCALES.PROFILE.REPORT_10),
      isSelected: false,
    },
    {
      id: 10,
      name: t(LOCALES.PROFILE.REPORT_11),
      isSelected: false,
    },
  ];
  const [reportOptions, setReportOptions] = useState(DATA);
  const [isFocused, setIsFocused] = useState(false);
  const [showTextInput, setShowTextInput] = useState(false);
  const [reportText, setReportText] = useState('');

  const renderBackdrop = useCallback(
    () => (
      <Pressable
        onPress={() => bottomSheetModalRef?.current?.close()}
        style={styles.absolute}>
        <BlurView
          style={styles.absolute}
          blurType="dark"
          blurAmount={10}
          reducedTransparencyFallbackColor="white"
        />
      </Pressable>
    ),
    [],
  );

  const handleComponent = useCallback(() => {
    return (
      <View style={styles.handleContainer}>
        <View
          style={[styles.handle, {backgroundColor: COLORS.TERTIARY_COLOR}]}
        />
      </View>
    );
  }, []);

  const handleReportPress = useCallback((id: number) => {
    const arr = reportOptions.map(item => {
      if (item.id === id) {
        item.isSelected = !item.isSelected;
        if (item.name === 'Other') {
          setShowTextInput(true);
        } else {
          setShowTextInput(false);
          setReportText('');
        }
      } else {
        item.isSelected = false;
      }
      return item;
    });
    setReportOptions(arr);
  }, []);

  const getInputStyle = useCallback(() => {
    if (isFocused) {
      return [
        styles.outlinedInput,
        {
          backgroundColor: COLORS.INPUT_BACKGROUND_COLOR,
          borderColor: COLORS.INPUT_ACTIVE_BORDER_COLOR,
        },
      ];
    } else {
      return [
        styles.fillInput,
        {
          backgroundColor: COLORS.INPUT_BACKGROUND_COLOR,
          borderColor: COLORS.INPUT_INACTIVE_BORDER_COLOR,
        },
      ];
    }
  }, [isFocused]);

  const [report, reportResponse, reportError, isReportLoading] = useApi({
    url: URL.REPORT,
    method: 'POST',
  });

  useEffect(() => {
    if (reportResponse) {
      if (reportResponse?.statusCode === 200) {
        if (reportType === 'USER' || reportType === 'FORUM') {
          appAlert({
            title: t(LOCALES.SUCCESS.LBL_SUCCESS),
            message:
              reportType === 'USER'
                ? t(LOCALES.SUCCESS.LBL_REPORT_USER_SUCCESS)
                : t(LOCALES.SUCCESS.LBL_REPORT_QUESTION_SUCCESS),
          });
          bottomSheetModalRef?.current?.close();
        } else {
          bottomSheetModalRef?.current?.close();
          onSuccessfulReport();
        }
      }
    }
  }, [reportResponse]);

  useEffect(() => {
    if (reportError) {
      if (reportError?.statusCode === 400) {
        appAlert({
          title: t(LOCALES.ERROR.LBL_ERROR),
          message: reportError?.message,
        });
      }
    }
  }, [reportError]);

  const getReportTitle = () => {
    if (reportType === 'USER') {
      return 'Report user';
    } else if (reportType === 'FORUM') {
      return 'Report question';
    } else if (reportType === 'TOUR') {
      return 'Report post';
    } else {
      return '';
    }
  };

  const getReportDescription = () => {
    if (reportType === 'USER') {
      return 'Why are you reporting this user?';
    } else if (reportType === 'FORUM') {
      return 'Why are you reporting this question?';
    } else if (reportType === 'TOUR') {
      return 'Why are you reporting this post?';
    } else {
      return '';
    }
  };

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={1}
      snapPoints={snapPoints}
      backgroundStyle={{backgroundColor: COLORS.MODAL_BACKGROUND_COLOR}}
      keyboardBehavior="fillParent"
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
      handleComponent={handleComponent}
      backdropComponent={renderBackdrop}>
      <View style={[styles.contentContainerStyle]}>
        <View style={styles.container}>
          <Text
            style={[
              styles.report,
              {
                fontFamily: FONTS.MONTSERRAT.SEMI_BOLD,
                color: COLORS.PRIMARY_TEXT_COLOR,
              },
            ]}>
            {getReportTitle()}
          </Text>
          <Text
            style={[
              styles.reportDescription,
              {
                fontFamily: FONTS.MONTSERRAT.MEDIUM,
                color: COLORS.PRIMARY_TEXT_COLOR,
              },
            ]}>
            {getReportDescription()}
          </Text>
          <BottomSheetFlatList
            showsVerticalScrollIndicator={false}
            data={reportOptions}
            style={{flex: 1, marginBottom: 20}}
            renderItem={({item}) => (
              <Pressable
                style={styles.row}
                onPress={() => handleReportPress(item.id)}>
                <Text
                  style={[
                    styles.reportOptions,
                    {
                      fontFamily: FONTS.MONTSERRAT.REGULAR,
                      color: COLORS.PRIMARY_TEXT_COLOR,
                    },
                  ]}>
                  {item?.name}
                </Text>
                {item.isSelected && <Check />}
              </Pressable>
            )}
          />
          {showTextInput && (
            <View style={getInputStyle()}>
              <BottomSheetTextInput
                style={[
                  styles.textInput,
                  {
                    fontFamily: FONTS.MONTSERRAT.REGULAR,
                    color: COLORS.INPUT_TEXT_COLOR,
                  },
                ]}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                value={reportText}
                onChangeText={setReportText}
              />
            </View>
          )}
          <Button
            title={t(LOCALES.PROFILE.REPORT)}
            loading={isReportLoading}
            disabled={
              isReportLoading ||
              !reportOptions.find(item => item.isSelected) ||
              (reportOptions.find(item => item.isSelected)?.name === 'Other' &&
                !reportText.trim())
            }
            onPress={() => {
              let reportReason = '';
              if (
                reportOptions.find(item => item.isSelected)?.name === 'Other'
              ) {
                reportReason = reportText;
              } else {
                reportReason =
                  reportOptions.find(item => item.isSelected)?.name || '';
              }
              if (reportType === 'USER') {
                const data = {
                  reportedUserId: reportId,
                  reportReason: reportReason,
                  report: 'USER',
                };
                report(data);
              } else if (reportType === 'FORUM') {
                const data = {
                  reportedForumId: reportId,
                  reportReason: reportReason,
                  report: 'FORUM',
                };
                report(data);
              } else if (reportType === 'TOUR') {
                const data = {
                  reportedTourId: reportId,
                  reportReason: reportReason,
                  report: 'TOUR',
                };
                report(data);
              }
            }}
          />
        </View>
      </View>
    </BottomSheetModal>
  );
};

export default ReportModal;

const styles = StyleSheet.create({
  contentContainerStyle: {flex: 1},
  container: {
    flex: 1,
    marginHorizontal: 20,
    marginBottom: 30,
  },
  handleContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 0,
  },
  handle: {
    height: 3,
    width: 60,
    borderRadius: 50,
    alignSelf: 'center',
    marginVertical: 15,
  },
  report: {
    fontSize: responsiveFontSize(14),
    marginTop: 12,
    alignSelf: 'center',
    marginBottom: 30,
  },
  reportDescription: {
    fontSize: responsiveFontSize(14),
    marginBottom: 15,
  },
  reportOptions: {
    fontSize: responsiveFontSize(14),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
  },
  textInput: {
    flex: 1,
    fontSize: responsiveFontSize(16),
    justifyContent: 'center',
  },
  fillInput: {
    width: '100%',
    height: 56,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 13,
    paddingHorizontal: 18,
    borderWidth: 1,
    marginBottom: 30,
  },
  outlinedInput: {
    width: '100%',
    height: 56,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 13,
    paddingHorizontal: 18,
    borderWidth: 1,
    marginBottom: 30,
  },
});
