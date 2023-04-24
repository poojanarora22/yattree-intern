import * as React from 'react';
import Svg, {SvgProps, G, Path} from 'react-native-svg';

const SvgComponent = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={18}
    height={18}
    viewBox="0 0 10.5 10.5"
    {...props}>
    <G data-name="Group 5542">
      <G data-name="Group 5537">
        <Path
          data-name="Path 3427"
          d="m6.001 7.036-1.61-1.612.526-.526 1.092 1.094 2.371-2.3.52.532Z"
          fill="#fff"
        />
      </G>
      <G data-name="Group 5543">
        <Path
          data-name="Path 3428"
          d="M10.25 5.25a5 5 0 1 1-5-5 5 5 0 0 1 5 5Z"
          fill="#ffd600"
          stroke="#fff"
          strokeWidth={0.5}
        />
        <Path
          data-name="Path 3429"
          d="m7.252 6.544-.092.565a.179.179 0 0 1-.174.141H3.415a.179.179 0 0 1-.174-.141l-.092-.565ZM5.194 3.25a.175.175 0 0 1 .147.07l1.148 1.507.933-.635a.176.176 0 0 1 .2 0 .185.185 0 0 1 .073.191l-.362 1.688H3.065l-.362-1.688a.185.185 0 0 1 .067-.188.176.176 0 0 1 .2-.012l1.105.645.979-1.5a.178.178 0 0 1 .142-.081Z"
          fill="#fff"
        />
      </G>
    </G>
  </Svg>
);

export default SvgComponent;
