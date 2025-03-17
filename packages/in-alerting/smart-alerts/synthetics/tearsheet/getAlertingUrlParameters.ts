/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import {
  syntheticsPath,
  syntheticSmartAlertsFullScreenPath,
  syntheticsDashboard
} from 'in-synthetics/navigation/paths';
import { alertId, alertCreated, isDuplicateMode, isEditMode, testId } from 'in-synthetics/navigation/matrix';
import { cancelUrl } from 'in-alerting/smart-alerts/components/list/constants';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { Location } from 'in-stores/navigation/types';

export default function getAlertingUrlParameters(location: Location) {
  const editMode = getMatrixParameter(location, syntheticSmartAlertsFullScreenPath, isEditMode) === 'true';
  const duplicateMode = getMatrixParameter(location, syntheticSmartAlertsFullScreenPath, isDuplicateMode) === 'true';
  const alertConfigId = getMatrixParameter(location, syntheticSmartAlertsFullScreenPath, alertId) ?? '';
  const alertConfigCreated =
    Number(getMatrixParameter(location, syntheticSmartAlertsFullScreenPath, alertCreated)) ?? '';
  const syntheticTestId = getMatrixParameter(location, syntheticsDashboard, testId) ?? '';
  const cancelTearSheet =
    getMatrixParameter(location, syntheticSmartAlertsFullScreenPath, cancelUrl) ?? '/#' + syntheticsPath;
  return {
    syntheticTestId,
    editMode,
    duplicateMode,
    alertConfigId,
    alertConfigCreated,
    cancelTearSheet
  };
}
