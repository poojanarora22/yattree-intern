import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"

const SvgComponent = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={11.883}
    height={7.922}
    {...props}
  >
    <Path
      data-name="Path 3364"
      d="M4.621 7.922h2.641V6.6H4.621ZM0 0v1.32h11.883V0Zm1.98 4.621H9.9V3.3H1.98Z"
      fill="#fff"
    />
  </Svg>
)

export default SvgComponent
