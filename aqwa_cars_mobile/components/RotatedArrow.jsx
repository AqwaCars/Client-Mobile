import React from "react";
import Svg, { G, Path } from "react-native-svg";

function RotatableSvg({ rotation }) {
  return (
    <Svg
      width="35px"
      height="35px"
      viewBox="-2.4 -2.4 28.80 28.80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke="#6C77BF"
      transform={`rotate(${rotation}, 12,12)`}
    >
      <G id="SVGRepo_bgCarrier" stroke-width="0" />
      <G
        id="SVGRepo_tracerCarrier"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke="#CCCCCC"
        stroke-width="0.24000000000000005"
      />
      <G id="SVGRepo_iconCarrier">
        <Path
          d="M6 12H18M18 12L13 7M18 12L13 17"
          stroke="#fff"
          stroke-width="1.7280000000000002"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </G>
    </Svg>
  );
}

export default RotatableSvg;