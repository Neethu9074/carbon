/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import DeleteLogsPage from 'in-settings/tabs/GlobalSettings/pages/logManagement/DeleteLogs/DeleteLogs';
import LoggingPermissionWrapper from 'in-logging/navigation/LoggingPermissionWrapper';
import LoggingDashboardWrapper from 'in-logging/dashboard/LoggingDashboardWrapper';
import { t } from 'in-i18n';

export default function DeleteLogs() {
  return (
    <LoggingPermissionWrapper
      requiredPermission="canDeleteLogs"
      permissionLabel={t('in-stores:permissionCanDeleteLogsLabel')}
    >
      <LoggingDashboardWrapper withPadding>
        <DeleteLogsPage />
      </LoggingDashboardWrapper>
    </LoggingPermissionWrapper>
  );
}
