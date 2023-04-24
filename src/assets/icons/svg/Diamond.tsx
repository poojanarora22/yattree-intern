import * as React from 'react';
import Svg, {SvgProps, G, Path} from 'react-native-svg';

const SvgComponent = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={28.169}
    height={28.17}
    {...props}>
    <G data-name="Group 5324" fill="#fff">
      <Path
        data-name="Path 3367"
        d="M.137 13.017v.005l13.535 14.965a.55.55 0 0 0 .816 0l13.535-14.965v-.005a.55.55 0 0 0 .021-.7v-.006l-4.4-5.5a.55.55 0 0 0-.43-.206H4.951a.55.55 0 0 0-.43.206l-4.4 5.5v.006a.55.55 0 0 0 .016.7Zm10.956-5.315h5.979l2.641 4.4H8.454Zm-2.769 5.5h11.519l-5.758 13.052Zm12.719 0h5.334L15.965 24.72Zm-13.922 0 5.08 11.515L1.793 13.202Zm19.351-1.1h-5.474l-2.641-4.4h4.6Zm-21.256-4.4h4.6l-2.641 4.4H1.693Z"
      />
      <Path
        data-name="Path 3369"
        d="M14.084 4.4a.55.55 0 0 0 .55-.55V.55a.55.55 0 1 0-1.1 0v3.3a.55.55 0 0 0 .55.55Z"
      />
      <Path
        data-name="Path 3370"
        d="m17.775 4.24 2.2-2.2a.55.55 0 0 0-.778-.778l-2.2 2.2a.55.55 0 1 0 .778.778Z"
      />
      <Path
        data-name="Path 3371"
        d="M10.395 4.24a.55.55 0 0 0 .778-.778l-2.2-2.2a.55.55 0 1 0-.778.778Z"
      />
    </G>
  </Svg>
);

export default SvgComponent;
