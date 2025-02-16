import * as React from "react";
import Svg, { Path } from "react-native-svg";
const DropIcon = (props) => (
  <Svg
    width={23}
    height={23}
    viewBox='0 0 23 23'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    {...props}>
    <Path
      d='M11.5 12.9375L17.25 7.1875H12.9375V1.4375H10.0625V7.1875H5.75L11.5 12.9375ZM16.7267 10.5857L15.1153 12.1972L20.9573 14.375L11.5 17.9012L2.04269 14.375L7.88469 12.1972L6.27325 10.5857L0 12.9375V18.6875L11.5 23L23 18.6875V12.9375L16.7267 10.5857Z'
      fill='#374151'
    />
  </Svg>
);
export default DropIcon;
