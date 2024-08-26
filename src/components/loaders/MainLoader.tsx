import React, { useEffect } from "react";
import { lineWobble } from "ldrs";

const MainLoader = () => {
  useEffect(() => {
    lineWobble.register();
  }, []);
  return (
    <div style={{height:'100vh',width:'100%',display:'flex',justifyContent:'center',alignItems:'center'}}>
      <l-line-wobble
        size="80"
        stroke="5"
        bg-opacity="0.1"
        speed="1.75"
        color= "#00BFFF "
      ></l-line-wobble>
    </div>
  );
};

export default MainLoader;
