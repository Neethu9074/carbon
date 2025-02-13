/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { alertId, alertCreated, isDuplicateMode, isEditMode, testId } from 'in-synthetics/navigation/matrix';
import { syntheticsPath, syntheticsDashboard } from 'in-synthetics/navigation/paths';
import { cancelUrl } from 'in-alerting/smart-alerts/components/list/constants';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { Location } from 'in-stores/navigation/types';

export default function getAlertingUrlParameters(location: Location) {
  const editMode = getMatrixParameter(location, syntheticsDashboard, isEditMode) === 'true';
  const duplicateMode = getMatrixParameter(location, syntheticsDashboard, isDuplicateMode) === 'true';
  const alertConfigId = getMatrixParameter(location, syntheticsDashboard, alertId) ?? '';
  const alertConfigCreated = Number(getMatrixParameter(location, syntheticsDashboard, alertCreated)) ?? '';
  const syntheticTestId = getMatrixParameter(location, syntheticsDashboard, testId) ?? '';
  const cancelTearSheet = getMatrixParameter(location, syntheticsDashboard, cancelUrl) ?? '/#' + syntheticsPath;
  return {
    syntheticTestId,
    editMode,
    duplicateMode,
    alertConfigId,
    alertConfigCreated,
    cancelTearSheet
  };
}
