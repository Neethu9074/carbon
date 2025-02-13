/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { alertId, alertCreated, isDuplicateMode, isEditMode } from 'in-synthetics/navigation/matrix';
import { syntheticSmartAlertsFullScreen, syntheticsPath } from 'in-synthetics/navigation/paths';
import { cancelUrl } from 'in-alerting/smart-alerts/components/list/constants';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { Location } from 'in-stores/navigation/types';

export default function getAlertingUrlParameters(location: Location) {
  const editMode = getMatrixParameter(location, syntheticSmartAlertsFullScreen, isEditMode) === 'true';
  const duplicateMode = getMatrixParameter(location, syntheticSmartAlertsFullScreen, isDuplicateMode) === 'true';
  const alertConfigId = getMatrixParameter(location, syntheticSmartAlertsFullScreen, alertId) ?? '';
  const alertConfigCreated = Number(getMatrixParameter(location, syntheticSmartAlertsFullScreen, alertCreated)) ?? '';

  const cancelTearSheet =
    getMatrixParameter(location, syntheticSmartAlertsFullScreen, cancelUrl) ?? '/#' + syntheticsPath;
  return {
    editMode,
    duplicateMode,
    alertConfigId,
    alertConfigCreated,
    cancelTearSheet
  };
}
