import * as React from 'react';
import Svg, {SvgProps, G, Path} from 'react-native-svg';

const SvgComponent = (props: SvgProps) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} {...props}>
    <G
      fill="none"
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      data-name="vuesax/linear/user-minus">
      <Path d="M17 7a5 5 0 1 1-5-5 5 5 0 0 1 5 5Z" />
      <Path
        data-name="Vector"
        d="M3.41 22c0-3.87 3.85-7 8.59-7a10.391 10.391 0 0 1 2.76.37"
      />
      <Path
        data-name="Vector"
        d="M22.255 18.3a3.866 3.866 0 0 1-.129 1 4.017 4.017 0 0 1-.495 1.216 4.27 4.27 0 0 1-3.681 2.089 4.218 4.218 0 0 1-2.859-1.105 3.962 3.962 0 0 1-.818-.979 4.218 4.218 0 0 1-.623-2.221 4.3 4.3 0 0 1 4.3-4.3 4.242 4.242 0 0 1 3.2 1.431 4.286 4.286 0 0 1 1.105 2.869Z"
      />
      <Path
        data-name="Vector"
        d="m20.366 15.255-4.517 6.215"
        strokeWidth={1.500165}
      />
    </G>
  </Svg>
);

export default SvgComponent;
