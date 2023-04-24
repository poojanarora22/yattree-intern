import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

const SvgComponent = (props: SvgProps) => (
  <Svg
    data-name="Group 4980"
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    {...props}>
    <Path data-name="Path 3231" d="M0 0h24v24H0Z" fill="none" />
    <Path
      data-name="Path 3232"
      d="M18.364 17.364 12 23.728l-6.364-6.364a9 9 0 1 1 12.728 0ZM12 15a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0-2a2 2 0 1 1 2-2 2 2 0 0 1-2 2Z"
      fill={props?.color || '#bb85bb'}
    />
  </Svg>
);

export default SvgComponent;
