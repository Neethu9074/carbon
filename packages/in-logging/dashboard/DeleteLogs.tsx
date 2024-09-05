/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import DeleteLogsPage from 'in-settings/tabs/TeamSettings/pages/logManagement/DeleteLogs/DeleteLogs';
import LoggingDashboardWrapper from 'in-logging/dashboard/LoggingDashboardWrapper';

export default function DeleteLogs() {
  return (
    <LoggingDashboardWrapper withPadding>
      <DeleteLogsPage />
    </LoggingDashboardWrapper>
  );
}
