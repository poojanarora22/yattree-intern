import * as React from "react"
import Svg, { SvgProps, G, Path } from "react-native-svg"

const SvgComponent = (props: SvgProps) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} {...props}>
    <G data-name="Group 5557">
      <Path data-name="Rectangle 1256" fill="none" d="M0 0h24v24H0z" />
      <G fill="none" stroke="#fff" data-name="vuesax/linear/notification">
        <Path
          d="M11.889 4.23a4.878 4.878 0 0 0-4.874 4.874v2.347a3.882 3.882 0 0 1-.462 1.674l-.935 1.551a1.559 1.559 0 0 0 .877 2.38 17 17 0 0 0 10.779 0 1.626 1.626 0 0 0 .877-2.38l-.934-1.552a3.989 3.989 0 0 1-.455-1.673V9.104a4.888 4.888 0 0 0-4.873-4.874Z"
          strokeLinecap="round"
        />
        <Path
          data-name="Vector"
          d="M13.392 4.466a4.918 4.918 0 0 0-.78-.162 5.486 5.486 0 0 0-2.226.162 1.615 1.615 0 0 1 3.006 0Z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          data-name="Vector"
          d="M14.326 17.349a2.444 2.444 0 0 1-2.437 2.437 2.446 2.446 0 0 1-1.722-.715 2.446 2.446 0 0 1-.715-1.722"
        />
      </G>
    </G>
  </Svg>
)

export default SvgComponent
