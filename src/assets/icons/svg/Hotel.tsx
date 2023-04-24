import * as React from 'react';
import Svg, {SvgProps, G, Path} from 'react-native-svg';

const SvgComponent = (props: SvgProps) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} {...props}>
    <G
      fill="none"
      stroke={props.color || '#fff'}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      data-name="vuesax/linear/building-4">
      <Path d="M1 22h22" />
      <Path
        data-name="Vector"
        d="M19.78 22.01v-4.46M19.8 10.89a2.194 2.194 0 0 0-2.2 2.2v2.27a2.2 2.2 0 0 0 4.4 0v-2.27a2.194 2.194 0 0 0-2.2-2.2ZM2.1 22V6.03c0-2.01 1-3.02 2.99-3.02h6.23c1.99 0 2.98 1.01 2.98 3.02V22M5.8 8.25h4.95M5.8 12h4.95M8.25 22v-3.75"
      />
    </G>
  </Svg>
);

export default SvgComponent;
