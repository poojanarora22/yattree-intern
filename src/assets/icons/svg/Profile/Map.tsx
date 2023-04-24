import * as React from 'react';
import Svg, {SvgProps, G, Path} from 'react-native-svg';

const SvgComponent = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={25.628}
    height={25.628}
    {...props}>
    <G fill="none" stroke="#bb85bb" strokeWidth={1.5}>
      <Path
        d="M24.878 9.195v7.239c0 3.016-.6 5.127-1.954 6.491l-7.697-7.698 9.326-9.326a14.842 14.842 0 0 1 .325 3.294Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        data-name="Vector"
        d="M24.55 5.901 5.901 24.55C2.27 23.72.75 21.211.75 16.433V9.195C.75 3.163 3.163.75 9.195.75h7.239c4.777 0 7.286 1.52 8.116 5.151ZM22.924 22.927c-1.363 1.351-3.474 1.954-6.491 1.954H9.195a14.842 14.842 0 0 1-3.294-.328l9.326-9.326Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        data-name="Vector"
        d="M5.863 7.964a3.6 3.6 0 0 1 6.949 0c.471 2.075-.832 3.836-1.979 4.922a2.172 2.172 0 0 1-2.992 0c-1.143-1.085-2.458-2.847-1.978-4.922Z"
      />
      <Path
        data-name="Vector"
        d="M9.309 8.833h.01"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </G>
  </Svg>
);

export default SvgComponent;
