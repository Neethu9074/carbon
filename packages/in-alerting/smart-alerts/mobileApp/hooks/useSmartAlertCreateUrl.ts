/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { isEmpty } from 'lodash';

import { MobileAppAlertConfigWithMetadata, Result, TagCatalog, TagFilter } from '@instana/types';
import { useObservable } from '@instana/hooks';

import {
  alertCreated,
  isDuplicateMode,
  isEditMode,
  alertId,
  customEventName as custom_event_name,
  tagFilters as tag_filters,
  mobileAppId as mobileApp_id
} from 'in-mobile-apps/navigation/matrix';
import useRemoveQueryFromNavigation, {
  useCheckLocationPath
} from 'in-alerting/smart-alerts/hooks/useRemoveQueryFromLocation';
import { mobileAppSmartAlertsFullScreenFullyQualified, mobileAppSmartAlerts } from 'in-mobile-apps/navigation/paths';
import { getAlertConfigByIdAndTimestamp } from 'in-alerting/smart-alerts/mobileApp/api/mobileAppAlertConfig';
import { generateAlertConfig } from 'in-alerting/smart-alerts/mobileApp/data/sharedFunctions';
import { BluePrint } from 'in-alerting/smart-alerts/mobileApp/data/blueprintConfig';
import { cancelUrl } from 'in-alerting/smart-alerts/components/list/constants';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { successObservable } from 'in-services/util/result';
import { Location } from 'in-stores/navigation/types';

interface AlertURLProps {
  mobileAppId: string;
  tagFilters?: TagFilter[];
  customEventName?: string | null;
  alertId?: string;
  alertConfigCreated?: number;
  duplicateMode?: boolean;
  editMode?: boolean;
}

export function useSmartAlertCreateUrl({
  alertId,
  alertConfigCreated,
  duplicateMode,
  editMode,
  mobileAppId,
  customEventName,
  tagFilters
}: AlertURLProps) {
  const isClearQueryPath = useCheckLocationPath();
  const { createHref, location, currentLocation } = useRemoveQueryFromNavigation(isClearQueryPath);
  const returnUrlWithParams = createHref(currentLocation);
  const navigateURL = updateCreatePathMatrixParams(
    location,
    returnUrlWithParams,
    mobileAppId,
    tagFilters,
    customEventName,
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
  mobileAppId: string,
  tagFilters?: TagFilter[],
  customEventName?: string | null,
  alertConfigId?: string,
  alertConfigCreated?: number,
  duplicateMode?: boolean,
  editMode?: boolean
) {
  setOrDeleteMatrixKey(location, mobileAppSmartAlerts, '');
  if (mobileApp_id) setOrDeleteMatrixKey(location, mobileAppSmartAlerts, mobileApp_id, mobileAppId);
  if (customEventName) setOrDeleteMatrixKey(location, mobileAppSmartAlerts, custom_event_name, customEventName);
  if (tagFilters) setOrDeleteMatrixKey(location, mobileAppSmartAlerts, tag_filters, JSON.stringify(tagFilters));

  // alert config id
  if (alertConfigId) setOrDeleteMatrixKey(location, mobileAppSmartAlerts, alertId, String(alertConfigId));

  // alert created timestamp
  if (alertConfigCreated) setOrDeleteMatrixKey(location, mobileAppSmartAlerts, alertCreated, alertConfigCreated);

  // for duplicate mode
  if (duplicateMode) setOrDeleteMatrixKey(location, mobileAppSmartAlerts, isDuplicateMode, String(duplicateMode));

  // for edit mode
  if (editMode) setOrDeleteMatrixKey(location, mobileAppSmartAlerts, isEditMode, String(editMode));

  // Keep the cancelURL parameter at the end so that the URL parameters added are not mixed with the cancel URL.
  setOrDeleteMatrixKey(location, mobileAppSmartAlerts, cancelUrl, returnUrlWithParams);

  location.pathname = mobileAppSmartAlertsFullScreenFullyQualified;
  return location;
}

export function useAlertConfig(
  blueprintConfig: BluePrint,
  alertConfigId: string,
  alertConfigCreated: number,
  tagFilters: TagFilter[],
  mobileAppId?: string,
  customEventName?: string | null,
  tagCatalog?: TagCatalog,
  duplicateMode?: boolean,
  editMode?: boolean
) {
  const alertConfig =
    editMode || duplicateMode
      ? getAlertConfigByIdAndTimestamp(alertConfigId, alertConfigCreated)
      : successObservable(
          mobileAppId ? generateAlertConfig(mobileAppId, tagFilters, tagCatalog, blueprintConfig, customEventName) : []
        );

  const result: Result<MobileAppAlertConfigWithMetadata> | {} = useObservable(() => alertConfig as any, []) ?? {};

  return !isEmpty(result)
    ? {
        alertConfig: (result as Result<MobileAppAlertConfigWithMetadata>).data,
        alertConfigErrors: (result as Result<MobileAppAlertConfigWithMetadata>).errors
      }
    : {};
}
