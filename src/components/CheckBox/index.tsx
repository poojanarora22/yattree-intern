import {Pressable, StyleSheet} from 'react-native';
import React from 'react';
import {CHECKBOX_BLANK, CHECKBOX_FILL} from '../../assets/icons/svg';
import {CheckBoxType} from '../../types/components/CheckBox';

const CheckBox = ({value = true, onChange = () => {}}: CheckBoxType) => {
  return (
    <Pressable
      onPress={() => {
        onChange(!value);
      }}>
      {value ? <CHECKBOX_FILL /> : <CHECKBOX_BLANK />}
    </Pressable>
  );
};

export default CheckBox;

const styles = StyleSheet.create({});
