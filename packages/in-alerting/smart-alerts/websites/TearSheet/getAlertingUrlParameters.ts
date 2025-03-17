/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { alertCreated, alertId, isDuplicateMode, isEditMode } from 'in-websites/navigation/matrix';
import { configurationAlerts, websiteSmartAlerts } from 'in-websites/navigation/paths';
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
  const editMode = getMatrixParameter(location, websiteSmartAlerts, isEditMode) === 'true';
  const duplicateMode = getMatrixParameter(location, websiteSmartAlerts, isDuplicateMode) === 'true';
  const alertConfigId = getMatrixParameter(location, websiteSmartAlerts, alertId) ?? '';
  const alertConfigCreated = Number(getMatrixParameter(location, websiteSmartAlerts, alertCreated)) ?? '';
  const websiteId = getMatrixParameter(location, websiteSmartAlerts, 'websiteId') ?? undefined;
  const errorId = getMatrixParameter(location, websiteSmartAlerts, 'errorId') ?? undefined;

  const tagFilters = getMatrixParameter(location, websiteSmartAlerts, 'tagFilters') ?? undefined;

  const errorMessage = getMatrixParameter(location, websiteSmartAlerts, 'errorMessage') ?? undefined;

  const customEventName = getMatrixParameter(location, websiteSmartAlerts, 'customEventName') ?? undefined;

  const cancelTearSheet = getMatrixParameter(location, websiteSmartAlerts, cancelUrl) ?? configurationAlerts;

  return {
    editMode,
    duplicateMode,
    alertConfigId,
    alertConfigCreated,
    websiteId,
    tagFilters: tagFilters ? JSON.parse(tagFilters as TagFilter[] | any) : undefined,
    errorMessage,
    customEventName,
    errorId,
    cancelTearSheet
  };
}
