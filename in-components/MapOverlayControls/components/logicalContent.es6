import React from 'react';

import LogicalLayouting from 'in-components/MapOverlayControls/components/LogicalLayouting';
import ShowAggregates from 'in-components/MapOverlayControls/components/ShowAggregates';
import Particles from 'in-components/MapOverlayControls/components/Particles';
import Zoom from 'in-components/MapOverlayControls/components/Zoom';

export default function getLogicalContent() {
  return [
    <LogicalLayouting key="layouting" />,
    <Particles key="particles" />,
    <ShowAggregates key="aggregates" />,
    <Zoom key="zoom" />
  ];
}
