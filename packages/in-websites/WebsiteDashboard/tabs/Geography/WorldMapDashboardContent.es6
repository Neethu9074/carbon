import React from 'react';

import WorldMap from 'in-new-components/WorldMap/WorldMap';

import locals from './WorldMapDashboardContent.mless';

export default function WorldMapDashboardContent(props) {
  return (
    <div className={locals.wrapper}>
      <WorldMap canDrillDown {...props} customHeight={props.height} />
    </div>
  );
}
