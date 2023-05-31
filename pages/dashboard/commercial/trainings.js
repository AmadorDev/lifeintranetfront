import React from 'react'
import withLayout from '../../../components/base/withLayout';
import { BannerC, ExamsC, VideosC } from '../../../components/commercial/training';
import LateralTres from "../../../components/dashboard/LateralTres";
 function trainings() {
  return (
    <>
      <div className="lg:flex lg:space-x-5">
        <div className="lg:w-3/4 lg:px-5 space-y-5">
          
           <BannerC /> 
          <div>
            <VideosC></VideosC> 
             <ExamsC></ExamsC>
          </div>
        </div>
        <LateralTres logout></LateralTres>
      </div>
    </>
  )
}
export default withLayout(trainings)