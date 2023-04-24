import * as React from 'react';
import Svg, {SvgProps, G, Path} from 'react-native-svg';

const SvgComponent = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={18}
    height={18}
    viewBox="0 0 11.666 11.666"
    {...props}>
    <G data-name="Group 5540">
      <G data-name="Group 5536">
        <Path
          data-name="Path 3426"
          d="m7.307.325.9 1.393 1.657.081.082 1.657 1.393.9-.754 1.476.755 1.474-1.394.9-.079 1.657-1.658.082-.9 1.393-1.476-.755-1.474.755-.899-1.393-1.658-.079-.083-1.658-1.393-.9.755-1.476-.755-1.474 1.393-.9.081-1.657 1.657-.084.9-1.393 1.476.755Z"
          fill="#42a5f5"
          stroke="#fff"
          strokeWidth={0.5}
        />
      </G>
      <G data-name="Group 5537">
        <Path
          data-name="Path 3427"
          d="m5.428 7.668-1.61-1.612.526-.526 1.092 1.094 2.371-2.3.52.532Z"
          fill="#fff"
        />
      </G>
    </G>
  </Svg>
);

export default SvgComponent;
