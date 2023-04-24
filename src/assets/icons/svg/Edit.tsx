import * as React from "react"
import Svg, { SvgProps, G, Path } from "react-native-svg"

const SvgComponent = (props: SvgProps) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} {...props}>
    <G
      fill="none"
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
    >
      <Path d="M11 2H9C4 2 2 4 2 9v6c0 5 2 7 7 7h6c5 0 7-2 7-7v-2" />
      <Path
        data-name="Vector"
        d="M16.04 3.02 8.16 10.9a2.712 2.712 0 0 0-.66 1.32l-.43 3.01a1.424 1.424 0 0 0 1.7 1.7l3.01-.43a2.8 2.8 0 0 0 1.32-.66l7.88-7.88c1.36-1.36 2-2.94 0-4.94s-3.58-1.36-4.94 0Z"
      />
      <Path data-name="Vector" d="M14.91 4.15a7.144 7.144 0 0 0 4.94 4.94" />
    </G>
  </Svg>
)

export default SvgComponent
