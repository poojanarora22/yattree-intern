import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

const SvgComponent = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={props?.width || 46.041}
    height={props?.height || 46.041}
    viewBox="0 0 46.041 46.041"
    {...props}>
    <Path
      d="M23.003 43.465A20.462 20.462 0 1 0 2.541 23.002a20.523 20.523 0 0 0 20.462 20.463Z"
      fill="none"
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2.5}
    />
    <Path
      data-name="Path 3445"
      d="M32.357 27.483a.6.6 0 0 0-1.015-.426l-3.21 3.21-1.851-1.851-.01.013a.635.635 0 0 0-.776 1.006l2.185 2.185.006.006.006.006.037.037a.531.531 0 0 0 .68-.016l.026-.024.022-.023 3.678-3.644a.6.6 0 0 0 .222-.479Zm-6.572-.439a.749.749 0 0 0 1.332-.469.863.863 0 0 0-.306-.649 7.66 7.66 0 0 0-2.7-1.594 4.982 4.982 0 1 0-4.954.007 7.67 7.67 0 0 0-5.119 6.287.862.862 0 0 0 .862.862.823.823 0 0 0 .815-.862 6.061 6.061 0 0 1 10.065-3.579Zm-4.076-3.656a3.549 3.549 0 1 1 3.548-3.544 3.549 3.549 0 0 1-3.548 3.549Z"
      fill="#fff"
    />
  </Svg>
);

export default SvgComponent;
