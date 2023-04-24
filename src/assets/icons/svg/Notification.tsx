import * as React from 'react';
import Svg, {SvgProps, G, Path} from 'react-native-svg';

const SvgComponent = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={15.057}
    height={18.528}
    {...props}>
    <G fill="none" stroke="#fff" strokeWidth={1.3}>
      <Path
        d="M7.549 1.481a5.142 5.142 0 0 0-5.138 5.138v2.474a4.092 4.092 0 0 1-.488 1.764l-.985 1.636a1.643 1.643 0 0 0 .921 2.509 17.914 17.914 0 0 0 11.363 0 1.715 1.715 0 0 0 .925-2.509l-.985-1.636a4.2 4.2 0 0 1-.48-1.764V6.619a5.153 5.153 0 0 0-5.133-5.138Z"
        strokeLinecap="round"
      />
      <Path
        data-name="Vector"
        d="M9.132 1.729a5.184 5.184 0 0 0-.822-.171 5.783 5.783 0 0 0-2.346.171 1.7 1.7 0 0 1 3.168 0Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        data-name="Vector"
        d="M10.118 15.31a2.576 2.576 0 0 1-2.569 2.569 2.578 2.578 0 0 1-1.815-.754 2.578 2.578 0 0 1-.754-1.815"
      />
    </G>
  </Svg>
);

export default SvgComponent;
