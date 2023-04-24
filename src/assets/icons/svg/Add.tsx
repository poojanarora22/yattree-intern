import * as React from 'react';
import Svg, {SvgProps, G, Path} from 'react-native-svg';

const SvgComponent = (props: SvgProps) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} {...props}>
    <G
      fill="none"
      stroke={props?.color || '#fff'}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}>
      <Path d="M8 12h8" />
      <Path
        data-name="Vector"
        d="M12 16V8M9 22h6c5 0 7-2 7-7V9c0-5-2-7-7-7H9C4 2 2 4 2 9v6c0 5 2 7 7 7Z"
      />
    </G>
  </Svg>
);

export default SvgComponent;
