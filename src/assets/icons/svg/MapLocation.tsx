import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

const SvgComponent = (props: SvgProps) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={18} height={21.728} {...props}>
    <Path
      data-name="Path 3325"
      d="M15.364 15.364 9 21.728l-6.364-6.364a9 9 0 1 1 12.728 0ZM9 11a2 2 0 1 0-2-2 2 2 0 0 0 2 2Z"
      fill="#bb85bb"
    />
  </Svg>
);

export default SvgComponent;
