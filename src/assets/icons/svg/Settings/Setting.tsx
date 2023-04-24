import * as React from "react"
import Svg, { SvgProps, G, Path } from "react-native-svg"

const SvgComponent = (props: SvgProps) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} {...props}>
    <G data-name="Group 5554">
      <Path data-name="Rectangle 1256" fill="none" d="M0 0h24v24H0z" />
      <G
        fill="none"
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        data-name="vuesax/linear/setting-2"
      >
        <Path d="M14.49 12.001a2.49 2.49 0 1 1-2.489-2.49 2.49 2.49 0 0 1 2.489 2.49Z" />
        <Path
          data-name="Vector"
          d="M4.566 12.655v-1.309a1.417 1.417 0 0 1 1.413-1.412c1.346 0 1.9-.952 1.219-2.119a1.412 1.412 0 0 1 .52-1.926l1.287-.736a1.241 1.241 0 0 1 1.7.446l.082.141a1.292 1.292 0 0 0 2.446 0l.076-.141a1.241 1.241 0 0 1 1.7-.446l1.286.736a1.412 1.412 0 0 1 .52 1.926c-.681 1.168-.13 2.119 1.215 2.119a1.417 1.417 0 0 1 1.413 1.413v1.308a1.417 1.417 0 0 1-1.413 1.413c-1.346 0-1.9.952-1.219 2.119a1.41 1.41 0 0 1-.52 1.926l-1.286.736a1.241 1.241 0 0 1-1.7-.446l-.082-.141a1.292 1.292 0 0 0-2.446 0l-.082.141a1.241 1.241 0 0 1-1.7.446l-1.286-.736a1.412 1.412 0 0 1-.52-1.926c.677-1.167.126-2.119-1.219-2.119a1.417 1.417 0 0 1-1.404-1.413Z"
        />
      </G>
    </G>
  </Svg>
)

export default SvgComponent
