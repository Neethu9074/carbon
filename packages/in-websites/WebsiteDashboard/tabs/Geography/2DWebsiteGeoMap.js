/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import WebsiteGeoHeatMap from 'in-websites/WebsiteDashboard/components/WebsiteGeoHeatMap';

import locals from './2DWebsiteGeoMap.mless';

export default function TwoDWebsiteGeoMap({ height, tagFilters, timeConfig, controlWrapperClassName }) {
  return (
    <div className={locals.wrapper}>
      <WebsiteGeoHeatMap
        canDrillDown
        tagFilters={tagFilters}
        timeConfig={timeConfig}
        height={height}
        controlWrapperClassName={controlWrapperClassName}
      />
    </div>
  );
}
