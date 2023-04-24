import * as React from 'react';
import Svg, {SvgProps, G, Path} from 'react-native-svg';

const SvgComponent = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={21.229}
    height={21.229}
    fill={props.color || '#fff'}
    {...props}>
    <G data-name="Group 5147">
      <G data-name="Group 5146">
        <Path
          data-name="Path 3296"
          d="M21.229 0H6.095v2.027H4.388V0H0v11.2h4.388V8.868h1.707v11.118H0v1.244h21.229ZM3.144 9.951h-1.9V1.244h1.9Zm1.244-2.327V3.271h1.707v4.353Zm11.631 12.359h-1.755v-4.246h1.756Zm-3 0h-1.755v-4.246h1.756Zm6.966 0h-2.722v-5.49H10.02v5.49H7.339V1.244h12.647Z"
        />
        <Path data-name="Path 3297" d="M8.769 3.063h1.244v2.363H8.769Z" />
        <Path data-name="Path 3298" d="M11.672 3.063h1.244v2.363h-1.244Z" />
        <Path data-name="Path 3299" d="M14.574 3.063h1.244v2.363h-1.244Z" />
        <Path data-name="Path 3300" d="M17.477 3.063h1.244v2.363h-1.244Z" />
        <Path data-name="Path 3301" d="M8.769 6.722h1.244v2.363H8.769Z" />
        <Path data-name="Path 3302" d="M11.672 6.722h1.244v2.363h-1.244Z" />
        <Path data-name="Path 3303" d="M14.574 6.722h1.244v2.363h-1.244Z" />
        <Path data-name="Path 3304" d="M17.477 6.722h1.244v2.363h-1.244Z" />
        <Path data-name="Path 3305" d="M8.769 10.653h1.244v2.363H8.769Z" />
        <Path data-name="Path 3306" d="M11.672 10.653h1.244v2.363h-1.244Z" />
        <Path data-name="Path 3307" d="M14.574 10.653h1.244v2.363h-1.244Z" />
        <Path data-name="Path 3308" d="M17.477 10.653h1.244v2.363h-1.244Z" />
      </G>
    </G>
  </Svg>
);

export default SvgComponent;
