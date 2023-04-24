import * as React from 'react';
import Svg, {SvgProps, G, Path} from 'react-native-svg';

const SvgComponent = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.width || 24}
    height={props.height || 24}
    {...props}
    viewBox="0 0 24 24">
    <G
      fill="none"
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}>
      <Path d="M12 22A10 10 0 1 0 2 12a10.029 10.029 0 0 0 10 10Z" />
      <Path data-name="Vector" d="M8 12h8M12 16V8" />
    </G>
  </Svg>
);

export default SvgComponent;
