import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

const SvgComponent = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={props?.width || 24}
    height={props?.height || 24}
    {...props}
    viewBox="0 0 24 24">
    <Path
      d="M12 22A10 10 0 1 0 2 12a10.029 10.029 0 0 0 10 10Z"
      fill="none"
      stroke={props.color || '#ff2626'}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
    />
    <Path
      data-name="Vector"
      d="m9.17 14.83 5.66-5.66M14.83 14.83 9.17 9.17"
      fill="none"
      stroke={props.color || '#ff2626'}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
    />
  </Svg>
);

export default SvgComponent;
