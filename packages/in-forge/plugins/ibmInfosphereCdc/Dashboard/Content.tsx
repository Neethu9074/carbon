/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { TimeConfig } from '@instana/types';

import Subscription from 'in-forge/plugins/ibmInfosphereCdc/Dashboard/SubscriptionTables';
import { SnapshotData } from 'in-stores/snapshot/snapshot';

interface IbmInfosphereCdcDashboardProps {
  snapshot: SnapshotData;
  timeConfig: TimeConfig;
}

const IbmInfosphereCdcDashboard = ({ snapshot, timeConfig }: IbmInfosphereCdcDashboardProps) => {
  return (
    <div>
      <Subscription snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
};
export default IbmInfosphereCdcDashboard;
