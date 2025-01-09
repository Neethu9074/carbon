/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { isEmpty } from 'lodash';

import { useObservable } from '@instana/hooks';

import { InfraSmartAlertConfigWithMetadata } from 'in-alerting/smart-alerts/infrastructure/form/infraAlertConfigTypes';
import { getAlertConfigByIdAndTimestamp } from 'in-alerting/smart-alerts/infrastructure/api/infrastructureAlertConfig';
import { alertCreated, isDuplicateMode, isEditMode, alertId } from 'in-infrastructure/navigation/matrix';
import generateAlertConfig from 'in-alerting/smart-alerts/infrastructure/data/generateAlertConfig';
import { infraSmartAlertsFullScreen } from 'in-stores/navigation/paths/mainPaths';
import { cancelUrl } from 'in-alerting/smart-alerts/components/list/constants';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { successObservable } from 'in-services/util/result';
import { Location } from 'in-stores/navigation/types';
import { Result } from 'in-types';

interface AlertURLProps {
  alertId?: string;
  alertConfigCreated?: number;
  duplicateMode?: boolean;
  editMode?: boolean;
}

export function useSmartAlertCreateUrl({ alertId, alertConfigCreated, duplicateMode, editMode }: AlertURLProps) {
  const { createHref, location } = useNavigation();
  const currentLocation = useLocation();
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
  setOrDeleteMatrixKey(location, infraSmartAlertsFullScreen, '');

  // alert config id
  if (alertConfigId) setOrDeleteMatrixKey(location, infraSmartAlertsFullScreen, alertId, String(alertConfigId));

  // alert created timestamp
  if (alertConfigCreated) setOrDeleteMatrixKey(location, infraSmartAlertsFullScreen, alertCreated, alertConfigCreated);

  // for duplicate mode
  if (duplicateMode) setOrDeleteMatrixKey(location, infraSmartAlertsFullScreen, isDuplicateMode, String(duplicateMode));

  // for edit mode
  if (editMode) setOrDeleteMatrixKey(location, infraSmartAlertsFullScreen, isEditMode, String(editMode));

  // Keep the cancelURL parameter at the end so that the URL parameters added are not mixed with the cancel URL.
  setOrDeleteMatrixKey(location, infraSmartAlertsFullScreen, cancelUrl, returnUrlWithParams);

  location.pathname = infraSmartAlertsFullScreen;
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

  const result: Result<InfraSmartAlertConfigWithMetadata> | {} = useObservable(() => alertConfig, []) ?? {};

  return !isEmpty(result)
    ? {
        alertConfig: (result as Result<InfraSmartAlertConfigWithMetadata>).data,
        alertConfigErrors: (result as Result<InfraSmartAlertConfigWithMetadata>).errors
      }
    : {};
}
