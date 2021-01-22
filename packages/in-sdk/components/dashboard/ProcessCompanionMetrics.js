/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import CompanionMetrics from 'in-sdk/components/dashboard/CompanionMetrics';
import { getProcessCompanions } from 'in-stores/snapshot/graph';

export default function ProcessCompanionMetrics({ snapshotId, timeConfig }) {
  return <CompanionMetrics companions$={getProcessCompanions(snapshotId)} timeConfig={timeConfig} />;
}
