/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import MobileAppGeoHeatMap from 'in-mobile-apps/MobileAppDashboard/components/MobileAppGeoHeatMap';

import locals from './2DMobileAppGeoMap.mless';

export default function TwoDMobileAppGeoMap({ height, tagFilters, timeConfig, controlWrapperClassName }) {
  return (
    <div className={locals.wrapper}>
      <MobileAppGeoHeatMap
        canDrillDown
        tagFilters={tagFilters}
        timeConfig={timeConfig}
        height={height}
        controlWrapperClassName={controlWrapperClassName}
      />
    </div>
  );
}
