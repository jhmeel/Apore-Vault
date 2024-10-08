import React, { useEffect } from "react";
import { mirage } from "ldrs";



const Mirage = () => {
  useEffect(() => {
    mirage.register();
  }, []);
  return (
    <div>
      <l-mirage size="40" speed="2.5" color="#ccc"></l-mirage>
    </div>
  );
};

export default Mirage;
