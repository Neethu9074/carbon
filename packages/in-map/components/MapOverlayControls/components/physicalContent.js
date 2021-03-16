/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import PhysicalLayouting from 'in-map/components/MapOverlayControls/components/PhysicalLayouting';
import ShowAggregates from 'in-map/components/MapOverlayControls/components/ShowAggregates';
import ViewGrouping from 'in-map/components/MapOverlayControls/components/ViewGrouping';
import Metrics from 'in-map/components/MapOverlayControls/components/Metrics';
import Zoom from 'in-map/components/MapOverlayControls/components/Zoom';
import Tags from 'in-map/components/MapOverlayControls/components/Tags';

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
