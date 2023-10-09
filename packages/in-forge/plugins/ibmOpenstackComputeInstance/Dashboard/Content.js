/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { Redirect } from 'react-router-dom';
import React from 'react';

import { useOpenstackInstanceDashboard } from 'in-openstack/navigation/paths';

export default function Dashboard({ snapshot, timeConfig }) {
  const getOpenstackInstanceDashboard = useOpenstackInstanceDashboard();
  const href = getOpenstackInstanceDashboard(snapshot.get('id'), { timeConfig });

  return <Redirect to={href.substring(2)} />;
}
