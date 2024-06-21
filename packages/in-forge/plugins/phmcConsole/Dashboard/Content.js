/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Redirect } from 'react-router-dom';
import React from 'react';

import { useIbmpPhmcDashboard } from 'in-phmc/navigation/paths';

export default function SystemDashboard({ snapshot, timeConfig }) {
  const getIbmpPhmcDashboard = useIbmpPhmcDashboard();
  const href = getIbmpPhmcDashboard(snapshot.get('id'), { timeConfig });

  return <Redirect to={href.substring(2)} />;
}
