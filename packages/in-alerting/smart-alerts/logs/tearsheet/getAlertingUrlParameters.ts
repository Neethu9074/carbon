/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { alertId, alertCreated, isDuplicateMode, isEditMode } from 'in-logging/navigation/matrix';
import { logSmartAlertsFullScreen, dashboardSmartAlertsPath } from 'in-logging/navigation/paths';
import { cancelUrl } from 'in-alerting/smart-alerts/components/list/constants';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { Location } from 'in-stores/navigation/types';

export default function getAlertingUrlParameters(location: Location) {
  const editMode = getMatrixParameter(location, logSmartAlertsFullScreen, isEditMode) === 'true';
  const duplicateMode = getMatrixParameter(location, logSmartAlertsFullScreen, isDuplicateMode) === 'true';
  const alertConfigId = getMatrixParameter(location, logSmartAlertsFullScreen, alertId) ?? '';
  const alertConfigCreated = Number(getMatrixParameter(location, logSmartAlertsFullScreen, alertCreated)) ?? '';

  const cancelTearSheet = getMatrixParameter(location, logSmartAlertsFullScreen, cancelUrl) ?? dashboardSmartAlertsPath;

  return {
    editMode,
    duplicateMode,
    alertConfigId,
    alertConfigCreated,
    cancelTearSheet
  };
}
