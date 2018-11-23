import React from 'react';

import WorldMap from 'in-new-components/WorldMap/WorldMap';

import locals from './WorldMapDashboardContent.mless';

export default function WorldMapDashboardContent({ height }) {
  return (
    <div className={locals.wrapper}>
      <WorldMap canDrillDown customHeight={height} />
    </div>
  );
}
