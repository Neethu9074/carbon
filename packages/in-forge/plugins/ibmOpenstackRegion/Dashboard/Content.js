/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { Redirect } from 'react-router-dom';
import React from 'react';

import { useOpenstackRegionDashboard } from 'in-openstack/navigation/paths';

export default function Dashboard({ snapshot, timeConfig }) {
  const getOpenstackRegionDashboard = useOpenstackRegionDashboard();
  const href = getOpenstackRegionDashboard(snapshot.get('id'), { timeConfig });

  return <Redirect to={href.substring(2)} />;
}
