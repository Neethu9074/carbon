/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { useVspehereEntityLink } from 'in-vsphere/navigation/paths';
import RedirectWithHash from 'in-components/RedirectWithHash';

export default function VsphereDatacenterDashboard({ snapshot }) {
  const getVsphereDatacenterDashboard = useVspehereEntityLink('datacenter');

  return <RedirectWithHash href={getVsphereDatacenterDashboard(snapshot.get('id'))} />;
}
