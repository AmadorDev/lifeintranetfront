
import LateralTres from "../../components/dashboard/LateralTres";
import React, { useRef, useState } from "react";
import { Videos, Exams, Banner } from "../../components/ssoma";
import useAuth from "../../hooks/useAuth";
import withLayout from "../../components/base/withLayout";
const ssoma = () => {

  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <div className="lg:flex lg:space-x-5">
        <div className="lg:w-3/4 lg:px-5 space-y-5">
          
          <Banner />
          <div>
            <Videos></Videos>
            <Exams></Exams>
          </div>
        </div>
        <LateralTres logout></LateralTres>
      </div>
    </>
  );
}


export default withLayout(ssoma);