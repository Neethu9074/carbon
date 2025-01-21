/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { isEmpty } from 'lodash';

import { Result, TagCatalog, TagFilter, WebsiteAlertConfigWithMetadata } from '@instana/types';
import { useObservable } from '@instana/hooks';

import { getAlertConfigByIdAndTimestamp } from 'in-alerting/smart-alerts/websites/api/websiteAlertConfig';
import { alertCreated, isDuplicateMode, isEditMode, alertId } from 'in-websites/navigation/matrix';
import { generateAlertConfig } from 'in-alerting/smart-alerts/websites/TearSheet/sharedFunctions';
import { BluePrint } from 'in-alerting/smart-alerts/websites/data/blueprintConfig';
import { cancelUrl } from 'in-alerting/smart-alerts/components/list/constants';
import { websiteSmartAlertsFullScreen } from 'in-websites/navigation/paths';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { successObservable } from 'in-services/util/result';
import { Location } from 'in-stores/navigation/types';

interface AlertURLProps {
  websiteId: string;
  tagFilters: TagFilter[];
  errorMessage?: string;
  customEventName?: string;
  errorId?: string;
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
  websiteId,
  errorMessage,
  customEventName,
  errorId,
  tagFilters
}: AlertURLProps) {
  const { createHref, location } = useNavigation();
  const currentLocation = useLocation();
  const returnUrlWithParams = createHref(currentLocation);
  const navigateURL = updateCreatePathMatrixParams(
    location,
    returnUrlWithParams,
    websiteId,
    tagFilters,
    errorMessage,
    customEventName,
    errorId,
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
  websiteId: string,
  tagFilters: TagFilter[],
  errorMessage?: string,
  customEventName?: string,
  errorId?: string,
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

export function useAlertConfig(
  tagFilters: TagFilter[],
  blueprintConfig: BluePrint,
  alertConfigId: string,
  alertConfigCreated: number,
  editMode: boolean,
  duplicateMode: boolean,
  websiteId?: string,
  tagCatalog?: TagCatalog,
  errorMessage?: string,
  customEventName?: string
) {
  const alertConfig =
    editMode || duplicateMode
      ? getAlertConfigByIdAndTimestamp(alertConfigId, alertConfigCreated)
      : successObservable(
          websiteId
            ? generateAlertConfig(websiteId, tagFilters, blueprintConfig, tagCatalog, errorMessage, customEventName)
            : []
        );

  //@ts-expect-error //TODO fix
  const result: Result<WebsiteAlertConfigWithMetadata> | {} = useObservable(() => alertConfig, []) ?? {};

  return !isEmpty(result)
    ? {
        alertConfig: (result as Result<WebsiteAlertConfigWithMetadata>).data,
        alertConfigErrors: (result as Result<WebsiteAlertConfigWithMetadata>).errors
      }
    : {};
}
