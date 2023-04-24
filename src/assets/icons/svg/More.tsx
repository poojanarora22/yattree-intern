import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

const SvgComponent = (props: SvgProps) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={4} height={18} {...props}>
    <Path
      data-name="Path 3321"
      d="M2 0a2 2 0 1 0 2 2 2.006 2.006 0 0 0-2-2Zm0 14a2 2 0 1 0 2 2 2.006 2.006 0 0 0-2-2Zm0-7a2 2 0 1 0 2 2 2.006 2.006 0 0 0-2-2Z"
      fill="#fff"
    />
  </Svg>
);

export default SvgComponent;
