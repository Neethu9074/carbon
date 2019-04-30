import React, { Fragment } from 'react';

import PhysicalLayouting from 'in-components/MapOverlayControls/components/PhysicalLayouting';
import ShowAggregates from 'in-components/MapOverlayControls/components/ShowAggregates';
import ViewGrouping from 'in-components/MapOverlayControls/components/ViewGrouping';
import Metrics from 'in-components/MapOverlayControls/components/Metrics';
import Zoom from 'in-components/MapOverlayControls/components/Zoom';
import Tags from 'in-components/MapOverlayControls/components/Tags';

export default function PhysicalContent() {
  return (
    <Fragment>
      <PhysicalLayouting />
      <ViewGrouping />
      <Tags />
      <ShowAggregates />
      <Metrics />
      <Zoom />
    </Fragment>
  );
}
