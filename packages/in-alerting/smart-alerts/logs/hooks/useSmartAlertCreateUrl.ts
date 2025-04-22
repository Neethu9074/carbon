/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { isEmpty } from 'lodash';

import { useObservable } from '@instana/hooks';

import { logSmartAlertsFullScreen, logSmartAlertsFullScreenFullyQualifiedPath } from 'in-logging/navigation/paths';
import { LogSmartAlertConfigWithMetadata } from 'in-alerting/smart-alerts/logs/form/logAlertConfigTypes';
import useRemoveQueryFromNavigation from 'in-alerting/smart-alerts/hooks/useRemoveQueryFromLocation';
import { getAlertConfigByIdAndTimestamp } from 'in-alerting/smart-alerts/logs/api/logsAlertConfig';
import { alertCreated, isDuplicateMode, isEditMode, alertId } from 'in-logging/navigation/matrix';
import generateAlertConfig from 'in-alerting/smart-alerts/logs/data/generateAlertConfig';
import { AlertURLProps } from 'in-alerting/smart-alerts/components/list/AlertsBaseList';
import { cancelUrl } from 'in-alerting/smart-alerts/components/list/constants';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { successObservable } from 'in-services/util/result';
import { Location } from 'in-stores/navigation/types';
import { Result } from 'in-types';

export function useSmartAlertCreateUrl({ alertId, alertConfigCreated, duplicateMode, editMode }: AlertURLProps) {
  const { createHref, location, currentLocation } = useRemoveQueryFromNavigation();

  const returnUrlWithParams = createHref(currentLocation);
  const navigateURL = updateCreatePathMatrixParams(
    location,
    returnUrlWithParams,
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
  alertConfigId?: string,
  alertConfigCreated?: number,
  duplicateMode?: boolean,
  editMode?: boolean
) {
  setOrDeleteMatrixKey(location, logSmartAlertsFullScreen, '');

  // alert config id
  if (alertConfigId) setOrDeleteMatrixKey(location, logSmartAlertsFullScreen, alertId, String(alertConfigId));

  // alert created timestamp
  if (alertConfigCreated) setOrDeleteMatrixKey(location, logSmartAlertsFullScreen, alertCreated, alertConfigCreated);

  // for duplicate mode
  if (duplicateMode) setOrDeleteMatrixKey(location, logSmartAlertsFullScreen, isDuplicateMode, String(duplicateMode));

  // for edit mode
  if (editMode) setOrDeleteMatrixKey(location, logSmartAlertsFullScreen, isEditMode, String(editMode));

  // Keep the cancelURL parameter at the end so that the URL parameters added are not mixed with the cancel URL.
  setOrDeleteMatrixKey(location, logSmartAlertsFullScreen, cancelUrl, returnUrlWithParams);

  location.pathname = logSmartAlertsFullScreenFullyQualifiedPath;
  return location;
}

export function useAlertConfig(
  alertConfigId: string,
  alertConfigCreated: number,
  editMode: boolean,
  duplicateMode: boolean
) {
  const alertConfig =
    editMode || duplicateMode
      ? getAlertConfigByIdAndTimestamp(alertConfigId, alertConfigCreated)
      : successObservable(generateAlertConfig());

  const result: Result<LogSmartAlertConfigWithMetadata> | {} = useObservable(() => alertConfig, []) ?? {};

  return !isEmpty(result)
    ? {
        alertConfig: (result as Result<LogSmartAlertConfigWithMetadata>).data,
        alertConfigErrors: (result as Result<LogSmartAlertConfigWithMetadata>).errors
      }
    : {};
}
