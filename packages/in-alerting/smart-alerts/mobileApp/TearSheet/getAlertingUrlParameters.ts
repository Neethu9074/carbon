/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import {
  alertCreated,
  isDuplicateMode,
  isEditMode,
  alertId,
  customEventName as custom_event_name,
  tagFilters as tag_filters,
  mobileAppId as mobileApp_id
} from 'in-mobile-apps/navigation/matrix';
import { alertsTab, mobileAppSmartAlerts } from 'in-mobile-apps/navigation/paths';
import { cancelUrl } from 'in-alerting/smart-alerts/components/list/constants';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { Location } from 'in-stores/navigation/types';
import { TagFilter } from 'in-types';

export default function getAlertingUrlParameters(location: Location) {
  const editMode = getMatrixParameter(location, mobileAppSmartAlerts, isEditMode) === 'true';
  const duplicateMode = getMatrixParameter(location, mobileAppSmartAlerts, isDuplicateMode) === 'true';
  const alertConfigId = getMatrixParameter(location, mobileAppSmartAlerts, alertId) ?? '';
  const alertConfigCreated = Number(getMatrixParameter(location, mobileAppSmartAlerts, alertCreated)) ?? '';
  const mobileAppId = getMatrixParameter(location, mobileAppSmartAlerts, mobileApp_id) ?? undefined;

  const tagFilters = getMatrixParameter(location, mobileAppSmartAlerts, tag_filters) ?? undefined;

  const customEventName = getMatrixParameter(location, mobileAppSmartAlerts, custom_event_name) ?? undefined;

  const cancelTearSheet = getMatrixParameter(location, mobileAppSmartAlerts, cancelUrl) ?? alertsTab;

  return {
    editMode,
    duplicateMode,
    alertConfigId,
    alertConfigCreated,
    mobileAppId,
    tagFilters: tagFilters ? JSON.parse(tagFilters as TagFilter[] | any) : undefined,
    customEventName,
    cancelTearSheet
  };
}
