/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */
import React from 'react';

import AuditJournalTable from 'in-forge/plugins/ibmiAuditJournalsInfo/Dashboard/AuditJournalTable.js';

export default function IbmIAuditJournalInfoDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  return <AuditJournalTable snapshotId={snapshotId} timeConfig={timeConfig} />;
}
