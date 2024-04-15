/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';
import { t } from 'in-i18n';
import AlertingPageHeader from 'in-alerting/smart-alerts/components/pageHeaderTemplate/AlertingPageHeader';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { alertsCategory, isMigration } from 'in-applications/navigation/matrix';
import { smartAlertPath } from 'in-applications/navigation/paths';

export default function AlertConfigTearSheet() {
  const location = useLocation();

  const isMigrate = getMatrixParameter(location, smartAlertPath, isMigration) === 'true';
  const isGlobalSmartAlert = getMatrixParameter(location, smartAlertPath, alertsCategory) === 'global';

  //-- Fetch the global/local alert config ---
  // const alertConfigCreated = Number(getMatrixParameter(location, smartAlertPath, alertCreatedParam));
  // const getAlertConfig = isGlobalSmartAlert
  //   ? getGlobalAlertConfigByIdAndTimestamp(alertConfigId, alertConfigCreated)
  //   : getAlertConfigByIdAndTimestamp(alertConfigId, alertConfigCreated);

  return <AlertingPageHeader title={getHeaderTitle(isGlobalSmartAlert, isMigrate)} />;
}

function getHeaderTitle(isGlobalSmartAlert: boolean, isMigration: boolean) {
  return isMigration
    ? t('in-alerting:smartAlerts.migration.migrateButton')
    : isGlobalSmartAlert
    ? t('in-alerting:smartAlerts.components.smartAlertDialog.alertConfigDialogPresenterTitleCreateNewAlert_Global')
    : t('in-alerting:smartAlerts.components.smartAlertDialog.alertConfigDialogPresenterTitleCreateNewAlert_Local');
}
