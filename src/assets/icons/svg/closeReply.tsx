import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

const SvgComponent = (props: SvgProps) => (
  <Svg
    data-name="Group 5568"
    xmlns="http://www.w3.org/2000/svg"
    width={12}
    height={12}
    {...props}
    viewBox="0 0 20 20">
    <Path
      data-name="Path 3440"
      d="M20 1.571 18.429 0 10 8.429 1.571 0 0 1.571 8.429 10 0 18.429 1.571 20 10 11.571 18.429 20 20 18.429 11.571 10Z"
      fill="#A2A2A2"
    />
  </Svg>
);

export default SvgComponent;
