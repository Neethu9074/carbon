/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { alertCreated, alertId, isDuplicateMode, isEditMode } from 'in-websites/navigation/matrix';
import { configurationAlerts, websiteSmartAlertsFullScreen } from 'in-websites/navigation/paths';
import { cancelUrl } from 'in-alerting/smart-alerts/components/list/constants';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { Location } from 'in-stores/navigation/types';
import { TagFilter } from 'in-types';

export default function getAlertingUrlParameters(location: Location): {
  editMode: boolean;
  duplicateMode: boolean;
  alertConfigId: string;
  alertConfigCreated: number;
  websiteId?: string;
  tagFilters: TagFilter[];
  errorMessage?: string;
  customEventName?: string;
  errorId?: string;
  cancelTearSheet: string;
} {
  const editMode = getMatrixParameter(location, websiteSmartAlertsFullScreen, isEditMode) === 'true';
  const duplicateMode = getMatrixParameter(location, websiteSmartAlertsFullScreen, isDuplicateMode) === 'true';
  const alertConfigId = getMatrixParameter(location, websiteSmartAlertsFullScreen, alertId) ?? '';
  const alertConfigCreated = Number(getMatrixParameter(location, websiteSmartAlertsFullScreen, alertCreated)) ?? '';
  const websiteId = getMatrixParameter(location, websiteSmartAlertsFullScreen, 'websiteId') ?? undefined;
  const errorId = getMatrixParameter(location, websiteSmartAlertsFullScreen, 'errorId') ?? undefined;

  const tagFilters = getMatrixParameter(location, websiteSmartAlertsFullScreen, 'tagFilters') ?? [];

  const errorMessage = getMatrixParameter(location, websiteSmartAlertsFullScreen, 'errorMessage') ?? undefined;

  const customEventName = getMatrixParameter(location, websiteSmartAlertsFullScreen, 'customEventName') ?? undefined;

  const cancelTearSheet = getMatrixParameter(location, websiteSmartAlertsFullScreen, cancelUrl) ?? configurationAlerts;

  return {
    editMode,
    duplicateMode,
    alertConfigId,
    alertConfigCreated,
    websiteId,
    tagFilters: JSON.parse(tagFilters as TagFilter[] | any),
    errorMessage,
    customEventName,
    errorId,
    cancelTearSheet
  };
}
