import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

const SvgComponent = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={7.778}
    height={12.728}
    {...props}>
    <Path
      data-name="Path 1831"
      d="M4.95 6.364 0 1.414 1.414 0l6.364 6.364-6.364 6.364L0 11.314Z"
      fill={props?.color || '#fff'}
    />
  </Svg>
);

export default SvgComponent;
