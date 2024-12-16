/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import LoggingPermissionWrapper from 'in-logging/navigation/LoggingPermissionWrapper';
import Alert from 'in-alerting/smart-alerts/logs/Alerts';
import { t } from 'in-i18n';

export default function SmartAlerts() {
  return (
    <LoggingPermissionWrapper
      requiredPermission="canViewLogs"
      permissionLabel={t('in-stores:permissionCanViewLogsLabel')}
    >
      <Alert isLogsDashboardHeader />;
    </LoggingPermissionWrapper>
  );
}
