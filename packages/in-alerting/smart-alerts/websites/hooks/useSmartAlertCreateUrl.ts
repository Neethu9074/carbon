/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { isEmpty } from 'lodash';

import { Result, TagCatalog, TagFilter } from '@instana/types';
import { useObservable } from '@instana/hooks';

import {
  alertCreated,
  isDuplicateMode,
  isEditMode,
  alertId,
  errorMessage as error_message,
  customEventName as custom_event_name,
  websiteId as website_id,
  errorId as error_id,
  tagFilters as tag_filters
} from 'in-websites/navigation/matrix';
import useRemoveQueryFromNavigation, {
  useCheckLocationPath
} from 'in-alerting/smart-alerts/hooks/useRemoveQueryFromLocation';
import { websiteSmartAlerts, websiteSmartAlertsFullScreenFullyQualified } from 'in-websites/navigation/paths';
import { WebsiteSmartAlertConfigWithMetadata } from 'in-alerting/smart-alerts/eum/data/eumAlertConfigTypes';
import { getAlertConfigByIdAndTimestamp } from 'in-alerting/smart-alerts/websites/api/websiteAlertConfig';
import { generateAlertConfig } from 'in-alerting/smart-alerts/websites/TearSheet/sharedFunctions';
import { AlertURLProps } from 'in-alerting/smart-alerts/components/list/AlertsBaseList';
import { BluePrint } from 'in-alerting/smart-alerts/websites/data/blueprintConfig';
import { cancelUrl } from 'in-alerting/smart-alerts/components/list/constants';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { successObservable } from 'in-services/util/result';
import { Location } from 'in-stores/navigation/types';

interface WebsiteAlertURLProps extends AlertURLProps {
  websiteId: string;
  tagFilters?: TagFilter[];
  errorMessage?: string;
  customEventName?: string;
  errorId?: string;
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
}: WebsiteAlertURLProps) {
  const isClearQueryPath = useCheckLocationPath();
  const { createHref, location, currentLocation } = useRemoveQueryFromNavigation(isClearQueryPath);
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
  tagFilters?: TagFilter[],
  errorMessage?: string,
  customEventName?: string,
  errorId?: string,
  alertConfigId?: string,
  alertConfigCreated?: number,
  duplicateMode?: boolean,
  editMode?: boolean
) {
  setOrDeleteMatrixKey(location, websiteSmartAlerts, '');
  if (websiteId) setOrDeleteMatrixKey(location, websiteSmartAlerts, website_id, websiteId);
  if (errorId) setOrDeleteMatrixKey(location, websiteSmartAlerts, error_id, errorId);
  if (errorMessage) setOrDeleteMatrixKey(location, websiteSmartAlerts, error_message, errorMessage);
  if (customEventName) setOrDeleteMatrixKey(location, websiteSmartAlerts, custom_event_name, customEventName);
  if (tagFilters) setOrDeleteMatrixKey(location, websiteSmartAlerts, tag_filters, JSON.stringify(tagFilters));

  // alert config id
  if (alertConfigId) setOrDeleteMatrixKey(location, websiteSmartAlerts, alertId, String(alertConfigId));

  // alert created timestamp
  if (alertConfigCreated) setOrDeleteMatrixKey(location, websiteSmartAlerts, alertCreated, alertConfigCreated);

  // for duplicate mode
  if (duplicateMode) setOrDeleteMatrixKey(location, websiteSmartAlerts, isDuplicateMode, String(duplicateMode));

  // for edit mode
  if (editMode) setOrDeleteMatrixKey(location, websiteSmartAlerts, isEditMode, String(editMode));

  // Keep the cancelURL parameter at the end so that the URL parameters added are not mixed with the cancel URL.
  setOrDeleteMatrixKey(location, websiteSmartAlerts, cancelUrl, returnUrlWithParams);

  location.pathname = websiteSmartAlertsFullScreenFullyQualified;
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
      ? getAlertConfigByIdAndTimestamp(alertConfigId, alertConfigCreated, { asObservable: true })
      : successObservable(
          websiteId
            ? generateAlertConfig(websiteId, tagFilters, blueprintConfig, tagCatalog, errorMessage, customEventName)
            : []
        );

  const result: Result<WebsiteSmartAlertConfigWithMetadata> | {} = useObservable(() => alertConfig as any, []) ?? {};

  return !isEmpty(result)
    ? {
        alertConfig: (result as Result<WebsiteSmartAlertConfigWithMetadata>).data,
        alertConfigErrors: (result as Result<WebsiteSmartAlertConfigWithMetadata>).errors
      }
    : {};
}
