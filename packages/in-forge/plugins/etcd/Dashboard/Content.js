/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import EtcdDashboardV2 from './V2dashboard/V2contents';
import EtcdDashboardV3 from './V3dashboard/V3contents';

export default function EtcdDashboard({ snapshot, timeConfig }) {
  const data = snapshot.get('data');
  const api = data.get('apiVersion');

  if (api < 3.0 || api == null) {
    return <EtcdDashboardV2 snapshot={snapshot} timeConfig={timeConfig} />;
  }
  return <EtcdDashboardV3 snapshot={snapshot} timeConfig={timeConfig} />;
}
