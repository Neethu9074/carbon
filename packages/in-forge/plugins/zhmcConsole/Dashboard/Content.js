/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Redirect } from 'react-router-dom';
import React from 'react';

import { useIbmzZhmcDashboard } from 'in-zhmc/navigation/paths';

export default function SystemDashboard({ snapshot, timeConfig }) {
  const getIbmzZhmcDashboard = useIbmzZhmcDashboard();
  const href = getIbmzZhmcDashboard(snapshot.get('id'), { timeConfig });

  return <Redirect to={href.substring(2)} />;
}
