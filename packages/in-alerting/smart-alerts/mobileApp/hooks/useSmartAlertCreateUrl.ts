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
import { getAlertConfigByIdAndTimestamp } from 'in-alerting/smart-alerts/mobileApp/api/mobileAppAlertConfig';
import { generateAlertConfig } from 'in-alerting/smart-alerts/mobileApp/data/sharedFunctions';
import { BluePrint } from 'in-alerting/smart-alerts/mobileApp/data/blueprintConfig';
import { mobileAppSmartAlertsFullScreen } from 'in-mobile-apps/navigation/paths';
import { cancelUrl } from 'in-alerting/smart-alerts/components/list/constants';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { successObservable } from 'in-services/util/result';
import { Location } from 'in-stores/navigation/types';

interface AlertURLProps {
  mobileAppId: string;
  tagFilters: TagFilter[];
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
  const { createHref, location } = useNavigation();
  const currentLocation = useLocation();
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
  tagFilters: TagFilter[],
  customEventName?: string | null,
  alertConfigId?: string,
  alertConfigCreated?: number,
  duplicateMode?: boolean,
  editMode?: boolean
) {
  setOrDeleteMatrixKey(location, mobileAppSmartAlertsFullScreen, '');
  setOrDeleteMatrixKey(location, mobileAppSmartAlertsFullScreen, mobileApp_id, mobileAppId);
  setOrDeleteMatrixKey(location, mobileAppSmartAlertsFullScreen, custom_event_name, customEventName);
  setOrDeleteMatrixKey(location, mobileAppSmartAlertsFullScreen, tag_filters, JSON.stringify(tagFilters));

  // alert config id
  if (alertConfigId) setOrDeleteMatrixKey(location, mobileAppSmartAlertsFullScreen, alertId, String(alertConfigId));

  // alert created timestamp
  if (alertConfigCreated)
    setOrDeleteMatrixKey(location, mobileAppSmartAlertsFullScreen, alertCreated, alertConfigCreated);

  // for duplicate mode
  if (duplicateMode)
    setOrDeleteMatrixKey(location, mobileAppSmartAlertsFullScreen, isDuplicateMode, String(duplicateMode));

  // for edit mode
  if (editMode) setOrDeleteMatrixKey(location, mobileAppSmartAlertsFullScreen, isEditMode, String(editMode));

  // Keep the cancelURL parameter at the end so that the URL parameters added are not mixed with the cancel URL.
  setOrDeleteMatrixKey(location, mobileAppSmartAlertsFullScreen, cancelUrl, returnUrlWithParams);

  location.pathname = mobileAppSmartAlertsFullScreen;
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
