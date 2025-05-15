/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { TimeConfig } from '@instana/types';

import { SnapshotData } from 'in-stores/snapshot/snapshot';

interface DashboardHeaderButtonSectionProps {
  snapshot: SnapshotData;
  snapshotId: string;
  timeConfig: TimeConfig;
  numItemsUntilCreatingMenu?: number;
}

declare const DashboardHeaderButtonSection: React.SFC<DashboardHeaderButtonSectionProps>;
export default DashboardHeaderButtonSection;
