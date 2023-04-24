import * as React from 'react';
import Svg, {SvgProps, G, Path} from 'react-native-svg';

const SvgComponent = (props: SvgProps) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={15} height={15} {...props}>
    <G data-name="Group 5028">
      <Path
        data-name="Path 1837"
        d="M14.992.544a.619.619 0 0 0-.039-.154.636.636 0 0 0-.085-.141l-.025-.03a.638.638 0 0 0-.119-.108.616.616 0 0 0-.142-.067l-.043-.019A.623.623 0 0 0 14.375 0H10a.625.625 0 1 0 0 1.25h2.866l-3.73 3.73a5.629 5.629 0 1 0 .884.884l3.73-3.73V5A.625.625 0 0 0 15 5V.587c0-.012-.006-.029-.008-.043ZM5.625 13.75A4.378 4.378 0 1 1 10 9.375a4.38 4.38 0 0 1-4.375 4.375Zm0 0"
        fill={props?.color || '#fff'}
      />
    </G>
  </Svg>
);

export default SvgComponent;
