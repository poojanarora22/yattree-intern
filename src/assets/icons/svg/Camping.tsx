import * as React from 'react';
import Svg, {SvgProps, G, Path} from 'react-native-svg';

const SvgComponent = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={25.389}
    height={21.817}
    {...props}>
    <G data-name="Group 5149">
      <G data-name="Group 5148">
        <Path
          data-name="Path 3309"
          d="M25.281 20.834 13.447 3.287 15.008.999a.636.636 0 0 0-1.042-.73l-1.274 1.89L11.418.271a.636.636 0 0 0-1.042.73l1.555 2.31L.1 20.834a.629.629 0 0 0 1.042.7l1.458-2.17v1.822a.629.629 0 0 0 .629.629H22.14a.629.629 0 0 0 .629-.629v-1.822l1.465 2.175a.631.631 0 1 0 1.047-.7Zm-15.664-.277 3.076-5.331 3.071 5.331Zm11.9 0h-4.305l-3.977-6.9a.629.629 0 0 0-1.087 0l-3.982 6.9h-4.3v-3.058l8.829-13.087 8.826 13.087Z"
          fill={props.color || '#fff'}
        />
      </G>
    </G>
  </Svg>
);

export default SvgComponent;
