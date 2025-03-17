/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { isEmpty } from 'lodash';

import { SyntheticAlertConfigWithMetadata } from '@instana/types';
import { useObservable } from '@instana/hooks';

import { syntheticSmartAlertsFullScreen, syntheticSmartAlertsFullScreenPath } from 'in-synthetics/navigation/paths';
import { getAlertConfigByIdAndTimestamp } from 'in-alerting/smart-alerts/synthetics/api/syntheticAlertConfig';
import { alertCreated, isDuplicateMode, isEditMode, alertId } from 'in-synthetics/navigation/matrix';
import generateAlertConfig from 'in-alerting/smart-alerts/synthetics/data/generateAlertConfig';
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
  setOrDeleteMatrixKey(location, syntheticSmartAlertsFullScreenPath, '');

  // alert config id
  if (alertConfigId) setOrDeleteMatrixKey(location, syntheticSmartAlertsFullScreenPath, alertId, String(alertConfigId));

  // alert created timestamp
  if (alertConfigCreated)
    setOrDeleteMatrixKey(location, syntheticSmartAlertsFullScreenPath, alertCreated, alertConfigCreated);

  // for duplicate mode
  if (duplicateMode)
    setOrDeleteMatrixKey(location, syntheticSmartAlertsFullScreenPath, isDuplicateMode, String(duplicateMode));

  // for edit mode
  if (editMode) setOrDeleteMatrixKey(location, syntheticSmartAlertsFullScreenPath, isEditMode, String(editMode));

  // Keep the cancelURL parameter at the end so that the URL parameters added are not mixed with the cancel URL.
  setOrDeleteMatrixKey(location, syntheticSmartAlertsFullScreenPath, cancelUrl, returnUrlWithParams);

  location.pathname = syntheticSmartAlertsFullScreen;
  return location;
}
const endpointConfig: { asObservable: true } = { asObservable: true };

export function useAlertConfig(
  alertConfigId: string,
  alertConfigCreated: number,
  editMode: boolean,
  duplicateMode: boolean,
  syntheticTestId?: string
) {
  const alertConfig =
    editMode || duplicateMode
      ? getAlertConfigByIdAndTimestamp(alertConfigId, alertConfigCreated, endpointConfig)
      : successObservable(generateAlertConfig(syntheticTestId ? [syntheticTestId] : []));
  const result: Result<SyntheticAlertConfigWithMetadata> | {} = useObservable(() => alertConfig, []) ?? {};

  return !isEmpty(result)
    ? {
        alertConfig: (result as Result<SyntheticAlertConfigWithMetadata>).data,
        alertConfigErrors: (result as Result<SyntheticAlertConfigWithMetadata>).errors
      }
    : {};
}
