/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Redirect } from 'react-router-dom';
import React from 'react';

import { useIbmzCpcDashboard } from 'in-zhmc/navigation/paths';

export default function SystemDashboard({ snapshot, timeConfig }) {
  const getIbmzCpcDashboard = useIbmzCpcDashboard();
  const href = getIbmzCpcDashboard(snapshot.get('id'), { timeConfig });

  return <Redirect to={href.substring(2)} />;
}
