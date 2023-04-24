import * as React from 'react';
import Svg, {SvgProps, G, Path, Circle} from 'react-native-svg';

const SvgComponent = (props: SvgProps) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={21.5} height={21.5} {...props}>
    <G data-name="Group 125">
      <G
        data-name="Layer 2"
        fill={props?.color || '#fff'}
        transform="translate(-1.25 -1.25)">
        <Path
          data-name="Path 48"
          d="M18 22.75H6A4.756 4.756 0 0 1 1.25 18V6A4.756 4.756 0 0 1 6 1.25h12A4.756 4.756 0 0 1 22.75 6v12A4.756 4.756 0 0 1 18 22.75Zm-12-20A3.254 3.254 0 0 0 2.75 6v12A3.254 3.254 0 0 0 6 21.25h12A3.254 3.254 0 0 0 21.25 18V6A3.254 3.254 0 0 0 18 2.75Z"
        />
        <Path
          data-name="Path 49"
          d="M11.927 14.75a.75.75 0 0 1-.75-.75v-.742a2.354 2.354 0 0 1 1.429-2.174 1.711 1.711 0 0 0 .579-.386 1.714 1.714 0 0 0 .473-.62 1.576 1.576 0 0 0-.014-1.093 1.819 1.819 0 0 0-1.111-1.139 1.59 1.59 0 0 0-1.044.081 2.455 2.455 0 0 0-1.25 1.753.75.75 0 1 1-1.478-.258 3.954 3.954 0 0 1 2.159-2.883 3.093 3.093 0 0 1 2.018-.139 3.311 3.311 0 0 1 2.126 2.1 3.063 3.063 0 0 1-.016 2.141 3.173 3.173 0 0 1-.863 1.173 3.2 3.2 0 0 1-1 .65.855.855 0 0 0-.513.792V14a.75.75 0 0 1-.745.75Z"
        />
        <Circle
          data-name="Ellipse 10"
          cx={1}
          cy={1}
          r={1}
          transform="translate(11 15.5)"
        />
      </G>
    </G>
  </Svg>
);

export default SvgComponent;
