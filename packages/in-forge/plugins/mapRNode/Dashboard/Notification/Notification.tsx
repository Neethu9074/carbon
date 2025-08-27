/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import { SnapshotData } from 'in-stores/snapshot/snapshot';

export default function Notification({ snapshot }: { snapshot: SnapshotData }) {
  const data = snapshot.get('data');
  const errorMessage = data.get('errorMessage');
  if (errorMessage) {
    return <DashboardNotification type="warning">{errorMessage}</DashboardNotification>;
  }
  return null;
}
