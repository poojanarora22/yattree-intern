import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

const SvgComponent = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={props?.width || 16.971}
    height={props?.height || 12.021}
    viewBox="0 0 16.971 12.021"
    {...props}>
    <Path
      d="M6.364 9.193 15.556 0l1.415 1.414L6.364 12.021 0 5.657l1.414-1.414Z"
      fill={props.color || '#bb85bb'}
    />
  </Svg>
);

export default SvgComponent;
