import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

const SvgComponent = (props: SvgProps) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} {...props}>
    <Path
      data-name="Path 3338"
      d="M6 6V0h2v6h6v2H8v6H6V8H0V6Z"
      fill="#1f1f1f"
    />
  </Svg>
);

export default SvgComponent;
