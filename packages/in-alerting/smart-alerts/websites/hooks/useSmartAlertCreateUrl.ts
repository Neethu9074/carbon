/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { alertCreated, isDuplicateMode, isEditMode, alertId } from 'in-websites/navigation/matrix';
import { cancelUrl } from 'in-alerting/smart-alerts/components/list/constants';
import { websiteSmartAlertsFullScreen } from 'in-websites/navigation/paths';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { Location } from 'in-stores/navigation/types';

export function useSmartAlertCreateUrl({
  alertId,
  alertConfigCreated,
  duplicateMode,
  editMode,
  websiteId,
  errorMessage,
  customEventName,
  errorId,
  tagFilters
}: any) {
  const { createHref, location } = useNavigation();
  const currentLocation = useLocation();
  const returnUrlWithParams = createHref(currentLocation);
  const navigateURL = updateCreatePathMatrixParams(
    location,
    returnUrlWithParams,
    websiteId,
    errorMessage,
    customEventName,
    errorId,
    tagFilters,
    alertId,
    alertConfigCreated,
    duplicateMode,
    editMode
  );
  return createHref(navigateURL);
}

function updateCreatePathMatrixParams(
  location: Location,
  returnUrlWithParams: string,
  websiteId: any,
  errorMessage: any,
  customEventName: any,
  errorId: any,
  tagFilters: any,
  alertConfigId?: string,
  alertConfigCreated?: number,
  duplicateMode?: boolean,
  editMode?: boolean
) {
  setOrDeleteMatrixKey(location, websiteSmartAlertsFullScreen, '');
  setOrDeleteMatrixKey(location, websiteSmartAlertsFullScreen, 'websiteId', websiteId);
  setOrDeleteMatrixKey(location, websiteSmartAlertsFullScreen, 'errorId', errorId);
  setOrDeleteMatrixKey(location, websiteSmartAlertsFullScreen, 'errorMessage', errorMessage);
  setOrDeleteMatrixKey(location, websiteSmartAlertsFullScreen, 'customEventName', customEventName);
  setOrDeleteMatrixKey(location, websiteSmartAlertsFullScreen, 'tagFilters', JSON.stringify(tagFilters));

  // alert config id
  if (alertConfigId) setOrDeleteMatrixKey(location, websiteSmartAlertsFullScreen, alertId, String(alertConfigId));

  // alert created timestamp
  if (alertConfigCreated)
    setOrDeleteMatrixKey(location, websiteSmartAlertsFullScreen, alertCreated, alertConfigCreated);

  // for duplicate mode
  if (duplicateMode)
    setOrDeleteMatrixKey(location, websiteSmartAlertsFullScreen, isDuplicateMode, String(duplicateMode));

  // for edit mode
  if (editMode) setOrDeleteMatrixKey(location, websiteSmartAlertsFullScreen, isEditMode, String(editMode));

  // Keep the cancelURL parameter at the end so that the URL parameters added are not mixed with the cancel URL.
  setOrDeleteMatrixKey(location, websiteSmartAlertsFullScreen, cancelUrl, returnUrlWithParams);

  location.pathname = websiteSmartAlertsFullScreen;
  return location;
}
