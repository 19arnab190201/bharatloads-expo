import * as React from "react"
import Svg, { Path } from "react-native-svg"

function Boxskeleton(props) {
  return (
    <Svg
      width={59}
      height={83}
      viewBox="0 0 59 83"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M21.63 31.38l11.638 6.24a15.313 15.313 0 007.232 1.824M21.63 31.38L4.993 22.469a15.324 15.324 0 015.841-5.535l22.43-12.022a15.313 15.313 0 0114.473 0l11.62 6.225M21.631 31.381L58.8 11.457l.56-.306M40.5 39.444c2.525-.001 5.011-.626 7.236-1.82l28.271-15.155M40.5 39.444v40.464c2.525 0 5.011-.626 7.236-1.82l22.43-12.022a15.314 15.314 0 008.077-13.497V30.43c0-2.81-.773-5.562-2.236-7.962M4.992 22.46a15.312 15.312 0 00-2.23 7.962v22.142a15.313 15.313 0 008.071 13.497l22.43 12.023a15.313 15.313 0 007.237 1.828M76.007 22.47a15.324 15.324 0 00-5.84-5.535L59.36 11.142"
        stroke="#14B8A6"
        strokeOpacity={0.37}
        strokeWidth={5}
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export default Boxskeleton;
