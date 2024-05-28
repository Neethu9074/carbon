/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import MessageQueueTable from './MessageQueueTable';

export default function IbmIMessageQueueDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  return <MessageQueueTable snapshotId={snapshotId} timeConfig={timeConfig} />;
}
