import React from 'react';

import LogicalLayouting from 'in-components/MapOverlayControls/components/LogicalLayouting';
import ShowAggregates from 'in-components/MapOverlayControls/components/ShowAggregates';
import MapStatistics from 'in-components/MapOverlayControls/components/MapStatistics';
import Particles from 'in-components/MapOverlayControls/components/Particles';
import Icons from 'in-components/MapOverlayControls/components/Icons';
import Zoom from 'in-components/MapOverlayControls/components/Zoom';

export default function getLogicalContent() {
  const controls = [
    <Zoom key="zoom" />,
    <ShowAggregates key="aggregates" />,
    <Particles key="particles" />,
    <LogicalLayouting key="layouting" />
  ];

  if (__DEV__) {
    controls.push(<Icons key="icons" />, <MapStatistics key="mapstatistics" />);
  }

  return controls.reverse();
}
