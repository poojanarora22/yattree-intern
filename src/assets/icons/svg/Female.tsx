import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

const SvgComponent = (props: SvgProps) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={11} height={16.789} {...props}>
    <Path
      data-name="Path 1838"
      d="M9.39 9.515a5.634 5.634 0 0 0 0-7.885 5.458 5.458 0 0 0-7.782 0 5.634 5.634 0 0 0 0 7.885 5.447 5.447 0 0 0 3.244 1.592v1.867H3.557a.656.656 0 0 0 0 1.312h1.295v1.848a.647.647 0 1 0 1.295 0v-1.849h1.295a.656.656 0 0 0 0-1.312H6.147v-1.866A5.448 5.448 0 0 0 9.39 9.515Zm-6.866-.928a4.309 4.309 0 0 1 0-6.03 4.174 4.174 0 0 1 5.951 0 4.309 4.309 0 0 1 0 6.03 4.174 4.174 0 0 1-5.951 0Z"
      fill={props?.color || '#fff'}
    />
  </Svg>
);

export default SvgComponent;
