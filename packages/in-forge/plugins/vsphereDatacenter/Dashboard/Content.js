/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { getVsphereDatacenterDashboard } from 'in-vsphere/navigation/paths';
import RedirectWithHash from 'in-components/RedirectWithHash';

export default function VsphereDatacenterDashboard({ snapshot }) {
  return <RedirectWithHash to$={getVsphereDatacenterDashboard(snapshot.get('id'))} />;
}
