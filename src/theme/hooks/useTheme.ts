import {Appearance} from 'react-native';
import React from 'react';

import LightTheme from '../LightTheme';
import DarkTheme from '../DarkTheme';

const useTheme = () => {
  const AppAppearance = Appearance.getColorScheme();
  const AppTheme = AppAppearance === 'dark' ? DarkTheme : LightTheme;
  return AppTheme;
};

export default useTheme;
