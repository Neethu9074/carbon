import React from 'react';

import PhysicalLayouting from 'in-components/MapOverlayControls/components/PhysicalLayouting';
import ShowAggregates from 'in-components/MapOverlayControls/components/ShowAggregates';
import MapStatistics from 'in-components/MapOverlayControls/components/MapStatistics';
import ViewGrouping from 'in-components/MapOverlayControls/components/ViewGrouping';
import Metrics from 'in-components/MapOverlayControls/components/Metrics';
import Icons from 'in-components/MapOverlayControls/components/Icons';
import Zoom from 'in-components/MapOverlayControls/components/Zoom';
import Tags from 'in-components/MapOverlayControls/components/Tags';

export default function getPhysicalContent() {
  const controls = [
    <Zoom key="zoom" />,
    <Metrics key="metrics" />,
    <ShowAggregates key="aggregates" />,
    <Tags key="tags" />,
    <ViewGrouping key="grouping" />,
    <PhysicalLayouting key="layouting" />
  ];

  if (__DEV__) {
    controls.push(<Icons key="icons" />, <MapStatistics key="mapstatistics" />);
  }

  return controls.reverse();
}
