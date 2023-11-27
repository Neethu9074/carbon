/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { TimeConfig } from '@instana/types';

import Catalog from 'in-forge/plugins/ibmApiConnect/Dashboard/CatalogTables';
import { SnapshotData } from 'in-stores/snapshot/snapshot';

interface IbmApiConnectDashboardProps {
  snapshot: SnapshotData;
  timeConfig: TimeConfig;
}

const IbmApiConnectDashboard = ({ snapshot, timeConfig }: IbmApiConnectDashboardProps) => {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <Catalog snapshotId={snapshotId} timeConfig={timeConfig} />
    </div>
  );
};
export default IbmApiConnectDashboard;
