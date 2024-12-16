/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Map } from 'immutable';
import React from 'react';

import { TimeConfig } from '@instana/types';

import CustomMetricsV2, { AVAILABLE_SPECS } from 'in-sdk/components/dashboard/CustomMetricsV2';
import { SnapshotData } from 'in-stores/snapshot/snapshot';

export default function DefaultDashboard({ snapshot, timeConfig }: { snapshot: SnapshotData; timeConfig: TimeConfig }) {
  const snapshotId = snapshot.get('id');
  return (
    <CustomMetricsV2 snapshot={Map({ id: snapshotId })} timeConfig={timeConfig} specs={[AVAILABLE_SPECS.GENERIC]} />
  );
}
