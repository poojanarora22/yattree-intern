import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

const SvgComponent = (props: SvgProps) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={16} height={15.556} {...props}>
    <Path
      data-name="Path 1808"
      d="m3.828 6.778 5.364-5.364L7.778 0 0 7.778l7.778 7.778 1.414-1.414-5.364-5.364H16v-2Z"
      fill="#fff"
    />
  </Svg>
);

export default SvgComponent;
