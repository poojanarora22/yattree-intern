import * as React from "react"
import Svg, { SvgProps, G, Path } from "react-native-svg"

const SvgComponent = (props: SvgProps) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} {...props}>
    <G data-name="Group 5555">
      <Path data-name="Rectangle 1256" fill="none" d="M0 0h24v24H0z" />
      <G data-name="Group 5558" fill="#fff">
        <Path
          data-name="Path 3380"
          d="m16.699 17.29-1.306 1.286-1.306-1.286-.822.835 1.293 1.273-1.293 1.273.822.835 1.306-1.286 1.306 1.286.822-.835-1.293-1.273 1.293-1.273Z"
        />
        <Path
          data-name="Path 3381"
          d="m18.192 3.269-.822-.835-2.687 2.646-1.242-1.378-.871.785 2.063 2.288Z"
        />
        <Path
          data-name="Path 3382"
          d="m14.682 12.427-1.242-1.378-.871.785 2.063 2.288 3.56-3.5-.822-.835Z"
        />
        <Path
          data-name="Path 3383"
          d="M8.659 1.997a2.849 2.849 0 1 0 2.849 2.849 2.853 2.853 0 0 0-2.849-2.849Zm0 4.527a1.677 1.677 0 1 1 1.677-1.677 1.679 1.679 0 0 1-1.677 1.677Z"
        />
        <Path
          data-name="Path 3384"
          d="M8.659 9.151A2.849 2.849 0 1 0 11.508 12a2.853 2.853 0 0 0-2.849-2.849Zm0 4.527a1.677 1.677 0 1 1 1.677-1.677 1.679 1.679 0 0 1-1.677 1.673Z"
        />
        <Path
          data-name="Path 3385"
          d="M8.659 16.304a2.849 2.849 0 1 0 2.849 2.846 2.853 2.853 0 0 0-2.849-2.846Zm0 4.527a1.677 1.677 0 1 1 1.677-1.681 1.679 1.679 0 0 1-1.677 1.681Z"
        />
      </G>
    </G>
  </Svg>
)

export default SvgComponent
