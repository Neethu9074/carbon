/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { useIbmpPhmcDashboard } from 'in-phmc/navigation/paths';
import RedirectWithHash from 'in-components/RedirectWithHash';

export default function SystemDashboard({ snapshot }) {
  const getIbmpPhmcDashboard = useIbmpPhmcDashboard();

  return <RedirectWithHash to={getIbmpPhmcDashboard(snapshot.get('id'))} />;
}
