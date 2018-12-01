import React from 'react';

import WebsiteGeoHeatMap from 'in-websites/WebsiteDashboard/components/WebsiteGeoHeatMap';

import locals from './2DWebsiteGeoMap.mless';

export default function TwoDWebsiteGeoMap({ height, tagFilters, timeConfig }) {
  return (
    <div className={locals.wrapper}>
      <WebsiteGeoHeatMap canDrillDown tagFilters={tagFilters} timeConfig={timeConfig} height={height} />
    </div>
  );
}
