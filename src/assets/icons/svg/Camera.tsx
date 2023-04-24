import * as React from 'react';
import Svg, {SvgProps, G, Path} from 'react-native-svg';

const SvgComponent = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={18.055}
    height={14.444}
    fill={props.color || '#000'}
    {...props}>
    <G data-name="Group 5358">
      <G data-name="Group 5355">
        <G data-name="Group 5354">
          <Path
            data-name="Path 3389"
            d="M15.9 2.512h-1.888l-1.04-1.57A2.162 2.162 0 0 0 11.186 0H6.869a2.162 2.162 0 0 0-1.786.942l-1.04 1.57H2.159A2.153 2.153 0 0 0 0 4.671v7.614a2.153 2.153 0 0 0 2.159 2.159H15.9a2.153 2.153 0 0 0 2.159-2.159V4.671A2.153 2.153 0 0 0 15.9 2.512ZM9.027 12.678a4.857 4.857 0 1 1 4.867-4.847 4.866 4.866 0 0 1-4.867 4.847Zm6.594-7.124h-.863a.638.638 0 0 1 0-1.276h.785a.637.637 0 0 1 .667.608.621.621 0 0 1-.589.668Z"
          />
        </G>
      </G>
      <G data-name="Group 5357">
        <G data-name="Group 5356">
          <Path
            data-name="Path 3390"
            d="M9.027 5.122a2.7 2.7 0 1 0 2.708 2.689 2.714 2.714 0 0 0-2.708-2.689Z"
          />
        </G>
      </G>
    </G>
  </Svg>
);

export default SvgComponent;
