import * as React from 'react';
import Svg, {SvgProps, G, Path} from 'react-native-svg';

const SvgComponent = (props: SvgProps) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} {...props}>
    <G data-name="Group 5562">
      <Path data-name="Rectangle 1256" fill="none" d="M0 0h24v24H0z" />
      <G data-name="Group 5563">
        <G data-name="Group 5345">
          <G data-name="Group 5344" fill="#fff">
            <Path
              data-name="Path 3386"
              d="M7.337 3.996a3.3 3.3 0 0 0-3.3 3.3v9.251a3.3 3.3 0 0 0 3.3 3.3h5.29a3.3 3.3 0 0 0 3.3-3.3v-.661a.661.661 0 0 0-1.322 0v.661a1.982 1.982 0 0 1-1.978 1.987h-5.29a1.982 1.982 0 0 1-1.982-1.982V7.296a1.982 1.982 0 0 1 1.982-1.978h5.29a1.982 1.982 0 0 1 1.983 1.978v.661a.661.661 0 0 0 1.322 0v-.661a3.3 3.3 0 0 0-3.305-3.3Z"
            />
            <Path
              data-name="Path 3387"
              d="M17.446 9.476a.661.661 0 0 0 0 .935l.854.854h-7.655a.661.661 0 0 0 0 1.322h7.656l-.854.854a.661.661 0 0 0 .935.935l1.981-1.984a.658.658 0 0 0 .193-.451v-.049a.658.658 0 0 0-.193-.436l-1.979-1.98a.661.661 0 0 0-.938 0Z"
            />
          </G>
        </G>
      </G>
    </G>
  </Svg>
);

export default SvgComponent;
