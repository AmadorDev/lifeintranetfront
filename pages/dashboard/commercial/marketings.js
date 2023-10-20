
import React from 'react'
import withLayout from '../../../components/base/withLayout';
import { BannerM, DocsM, GalleryM, VideoM } from '../../../components/commercial/marketing';
import LateralTres from "../../../components/dashboard/LateralTres";
 function marketings() {
  return (
    <>
      <div className="lg:flex lg:space-x-5">
        <div className="lg:w-3/4 lg:px-5 space-y-5">
          <BannerM />
          <div>
          <GalleryM/>
          <VideoM/>
          <DocsM/>
          </div>
        </div>
        <LateralTres logout></LateralTres>
      </div>
    </>
  )
}
export default withLayout(marketings)