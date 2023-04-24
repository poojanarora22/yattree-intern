import * as React from 'react';
import Svg, {SvgProps, G, Path} from 'react-native-svg';

const SvgComponent = (props: SvgProps) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} {...props}>
    <G fill="none" stroke="#fff" strokeWidth={1.5}>
      <Path d="M12.507 9.06a3.12 3.12 0 1 1-3.12-3.12 3.12 3.12 0 0 1 3.12 3.12Z" />
      <Path
        data-name="Vector"
        d="M1.007 7.24c1.97-8.66 14.8-8.65 16.76.01 1.15 5.08-2.01 9.38-4.78 12.04a5.193 5.193 0 0 1-7.21 0c-2.76-2.66-5.92-6.97-4.77-12.05Z"
      />
    </G>
  </Svg>
);

export default SvgComponent;
