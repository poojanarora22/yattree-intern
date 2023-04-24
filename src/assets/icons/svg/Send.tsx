import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

const SvgComponent = (props: SvgProps) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} {...props}>
    <Path
      d="m8.125 7.219 7.149-2.386c3.208-1.07 4.951.682 3.89 3.891l-2.383 7.15c-1.6 4.809-4.227 4.809-5.827 0l-.707-2.122-2.122-.707c-4.806-1.601-4.806-4.22 0-5.826Z"
      fill="none"
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
    />
    <Path
      data-name="Vector"
      d="m10.498 13.534 3.969-4.244"
      fill="none"
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
    />
  </Svg>
);

export default SvgComponent;
