import * as React from 'react';
import Svg, {SvgProps, G, Path} from 'react-native-svg';

const SvgComponent = (props: SvgProps) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} {...props}>
    <G
      fill="none"
      stroke={props.color || '#bb85bb'}
      strokeLinecap="round"
      strokeLinejoin="round">
      <Path d="M12.12 12.78a.963.963 0 0 0-.24 0 3.28 3.28 0 1 1 .24 0Z" />
      <Path
        data-name="Vector"
        d="M18.74 19.38A9.934 9.934 0 0 1 12 22a9.934 9.934 0 0 1-6.74-2.62 3.679 3.679 0 0 1 1.77-2.58 9.73 9.73 0 0 1 9.94 0 3.679 3.679 0 0 1 1.77 2.58Z"
      />
      <Path data-name="Vector" d="M22 12A10 10 0 1 1 12 2a10 10 0 0 1 10 10Z" />
    </G>
  </Svg>
);

export default SvgComponent;
