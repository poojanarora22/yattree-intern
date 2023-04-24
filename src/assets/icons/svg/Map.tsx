import * as React from 'react';
import Svg, {SvgProps, G, Path} from 'react-native-svg';

const SvgComponent = (props: SvgProps) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} {...props}>
    <G
      fill="none"
      stroke={props?.color || '#fff'}
      data-name="vuesax/linear/map">
      <Path
        d="M22 9v6c0 2.5-.5 4.25-1.62 5.38L14 14l7.73-7.73A12.3 12.3 0 0 1 22 9Z"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
      <Path
        data-name="Vector"
        d="M21.73 6.27 6.27 21.73C3.26 21.04 2 18.96 2 15V9c0-5 2-7 7-7h6c3.96 0 6.04 1.26 6.73 4.27Z"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
      <Path
        data-name="Vector"
        d="M20.38 20.38C19.25 21.5 17.5 22 15 22H9a12.3 12.3 0 0 1-2.73-.27L14 14Z"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
      <Path
        data-name="Vector"
        d="M6.24 7.983a2.986 2.986 0 0 1 5.76 0 4.444 4.444 0 0 1-1.645 4.078 1.8 1.8 0 0 1-2.48 0A4.421 4.421 0 0 1 6.24 7.983Z"
        strokeWidth={1.5}
      />
      <Path
        data-name="Vector"
        d="M9.095 8.7H9.1"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      />
    </G>
  </Svg>
);

export default SvgComponent;
