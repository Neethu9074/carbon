/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { alertId, alertCreated, isDuplicateMode, isEditMode } from 'in-infrastructure/navigation/matrix';
import { infraSmartAlertsFullScreen, infraSmartAlerts } from 'in-stores/navigation/paths/mainPaths';
import { cancelUrl } from 'in-alerting/smart-alerts/components/list/constants';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { Location } from 'in-stores/navigation/types';

export default function getAlertingUrlParameters(location: Location) {
  const editMode = getMatrixParameter(location, infraSmartAlertsFullScreen, isEditMode) === 'true';
  const duplicateMode = getMatrixParameter(location, infraSmartAlertsFullScreen, isDuplicateMode) === 'true';
  const alertConfigId = getMatrixParameter(location, infraSmartAlertsFullScreen, alertId) ?? '';
  const alertConfigCreated = Number(getMatrixParameter(location, infraSmartAlertsFullScreen, alertCreated)) ?? '';

  const cancelTearSheet = getMatrixParameter(location, infraSmartAlertsFullScreen, cancelUrl) ?? infraSmartAlerts;

  return {
    editMode,
    duplicateMode,
    alertConfigId,
    alertConfigCreated,
    cancelTearSheet
  };
}
