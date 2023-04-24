import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

const SvgComponent = (props: SvgProps) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={17} height={16} {...props}>
    <Path
      data-name="Path 1839"
      d="M16.9.495a.539.539 0 0 0-.377-.205L13.508.001a.524.524 0 0 0-.582.448.509.509 0 0 0 .474.552l1.622.154-2.373 1.615a4.875 4.875 0 0 0-6.989.059 4.965 4.965 0 0 0-.97-.1A4.568 4.568 0 0 0 0 7.157a4.533 4.533 0 0 0 4.159 4.395v1.449H2.574a.5.5 0 1 0 0 1h1.585v1.5a.532.532 0 0 0 1.062 0v-1.5h1.587a.5.5 0 1 0 0-1H5.222v-1.45a4.78 4.78 0 0 0 2.991-1.477 4.965 4.965 0 0 0 .97.1 4.807 4.807 0 0 0 3.317-1.3 4.272 4.272 0 0 0 1.374-3.128 4.2 4.2 0 0 0-.6-2.165l2.373-1.615-.356 1.5a.5.5 0 0 0 .4.6.564.564 0 0 0 .116.012.526.526 0 0 0 .518-.392l.662-2.785a.479.479 0 0 0-.088-.4ZM7.8 8.911a3.433 3.433 0 0 1-2.25-3.165 3.256 3.256 0 0 1 .514-1.754 3.433 3.433 0 0 1 2.25 3.165A3.256 3.256 0 0 1 7.8 8.911Zm-3.109 1.667a3.533 3.533 0 0 1-3.629-3.421 3.533 3.533 0 0 1 3.629-3.422c.1 0 .207 0 .308.012a4.194 4.194 0 0 0-.507 2A4.412 4.412 0 0 0 7.1 9.71a3.74 3.74 0 0 1-2.409.868Zm7.058-2.413a3.718 3.718 0 0 1-2.566 1c-.1 0-.207 0-.308-.012a4.194 4.194 0 0 0 .507-2 4.412 4.412 0 0 0-2.611-3.96 3.74 3.74 0 0 1 2.412-.868 3.533 3.533 0 0 1 3.628 3.421 3.3 3.3 0 0 1-1.063 2.42Z"
      fill={props?.color || '#fff'}
    />
  </Svg>
);

export default SvgComponent;
