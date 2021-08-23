/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';
import CustomMetricsV2, { AVAILABLE_SPECS } from '../../../../in-sdk/components/dashboard/CustomMetricsV2';
import DashboardNotification from '../../../../in-sdk/components/dashboard/DashboardNotification';

export default function DominoDashboard({snapshot, timeConfig}) {
  const metricIds = snapshot.get('metricIds');
  if (metricIds.size > 0) {
    return <CustomMetricsV2 snapshot={snapshot} timeConfig={timeConfig} titlePrefix="Domino" specs={SPECS} />;
  } else {
    return (
      <DashboardNotification>
        {'SUCKS'}
      </DashboardNotification>
    );
  }
}

export const SPECS = [
  AVAILABLE_SPECS.COUNTER,
  ];
