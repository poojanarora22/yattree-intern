import * as React from 'react';
import Svg, {SvgProps, G, Path} from 'react-native-svg';

const SvgComponent = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={15.041}
    height={15.041}
    {...props}>
    <G data-name="Group 5535">
      <G data-name="Group 5534">
        <G data-name="Group 5533">
          <Path
            data-name="Path 3425"
            d="M15.041 1.182 13.859 0 7.521 6.339 1.182 0 0 1.182l6.339 6.339L0 13.859l1.182 1.182L7.521 8.7l6.339 6.339 1.182-1.182L8.7 7.521Z"
            fill="red"
          />
        </G>
      </G>
    </G>
  </Svg>
);

export default SvgComponent;
