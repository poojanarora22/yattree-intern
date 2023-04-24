import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

const SvgComponent = (props: SvgProps) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={8} height={4} {...props}>
    <Path data-name="Path 1843" d="M4 4 0 0h8Z" fill="#fff" />
  </Svg>
);

export default SvgComponent;
