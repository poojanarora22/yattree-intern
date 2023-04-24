import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

const SvgComponent = (props: SvgProps) => (
  <Svg
    data-name="Group 5250"
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill={'#000'}
    {...props}>
    <Path
      data-name="Path 3339"
      d="M.414 13.241h2.151a9.527 9.527 0 0 0 8.193 8.193v2.152a.415.415 0 0 0 .414.414h1.655a.415.415 0 0 0 .414-.414v-2.151a9.527 9.527 0 0 0 8.193-8.193h2.152a.415.415 0 0 0 .414-.414v-1.656a.415.415 0 0 0-.414-.414h-2.151a9.527 9.527 0 0 0-8.193-8.193V.414A.415.415 0 0 0 12.828 0h-1.656a.415.415 0 0 0-.414.414v2.151a9.527 9.527 0 0 0-8.193 8.193H.414a.415.415 0 0 0-.414.414v1.655a.415.415 0 0 0 .414.414ZM12 4.965A7.035 7.035 0 1 1 4.965 12 7.035 7.035 0 0 1 12 4.965Zm0 0"
    />
    <Path
      data-name="Path 3340"
      d="M15.36 12a3.361 3.361 0 1 1-3.361-3.361A3.361 3.361 0 0 1 15.36 12Zm0 0"
    />
  </Svg>
);

export default SvgComponent;
