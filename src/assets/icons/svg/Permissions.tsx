import * as React from 'react';
import Svg, {SvgProps, G, Path} from 'react-native-svg';

const SvgComponent = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={13.137}
    height={21.224}
    {...props}>
    <G data-name="Group 5342">
      <G data-name="Group 5341" fill="#fff">
        <Path
          data-name="Path 3380"
          d="m11.553 16.224-1.386 1.364-1.386-1.364-.872.886 1.372 1.351-1.372 1.351.872.886 1.386-1.364 1.386 1.364.872-.886-1.372-1.351 1.372-1.351Z"
        />
        <Path
          data-name="Path 3381"
          d="m13.137 1.35-.872-.886-2.849 2.805-1.32-1.46-.924.833L9.36 5.069Z"
        />
        <Path
          data-name="Path 3382"
          d="M9.416 11.066 8.098 9.604l-.924.833 2.188 2.427 3.777-3.718-.872-.886Z"
        />
        <Path
          data-name="Path 3383"
          d="M3.023 0A3.023 3.023 0 1 0 6.05 3.023 3.026 3.026 0 0 0 3.023 0Zm0 4.8a1.779 1.779 0 1 1 1.779-1.779A1.781 1.781 0 0 1 3.023 4.8Z"
        />
        <Path
          data-name="Path 3384"
          d="M3.023 7.589a3.023 3.023 0 1 0 3.027 3.023 3.026 3.026 0 0 0-3.027-3.023Zm0 4.8a1.779 1.779 0 1 1 1.779-1.779 1.781 1.781 0 0 1-1.779 1.781Z"
        />
        <Path
          data-name="Path 3385"
          d="M3.023 15.178a3.023 3.023 0 1 0 3.023 3.023 3.026 3.026 0 0 0-3.023-3.023Zm0 4.8a1.779 1.779 0 1 1 1.779-1.779 1.781 1.781 0 0 1-1.779 1.781Z"
        />
      </G>
    </G>
  </Svg>
);

export default SvgComponent;
