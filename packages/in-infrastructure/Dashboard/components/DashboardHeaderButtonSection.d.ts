/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { SnapshotPreview, TimeConfig } from '@instana/types';

interface DashboardHeaderButtonSectionProps {
  snapshot: SnapshotPreview;
  snapshotId: string;
  timeConfig: TimeConfig;
}

declare const DashboardHeaderButtonSection: React.SFC<DashboardHeaderButtonSectionProps>;
export default DashboardHeaderButtonSection;
