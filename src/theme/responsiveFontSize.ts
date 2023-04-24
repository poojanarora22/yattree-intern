import {Dimensions} from 'react-native';
const {width} = Dimensions.get('screen');

const guidelineBaseWidth = 390;

const responsiveFontSize = (fontSize: number) => {
  return Math.round((fontSize * width) / guidelineBaseWidth);
};

export {responsiveFontSize};
