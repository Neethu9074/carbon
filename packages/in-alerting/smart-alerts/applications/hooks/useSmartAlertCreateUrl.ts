/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { useCallback } from 'react';

import {
  applicationId as applicationIdFromURL,
  boundaryScope as boundaryScopeFromURL,
  alertsCategory,
  isMigration,
  alertId,
  eventId,
  alertCreated,
  serviceId as serviceIdFromURL,
  endpointId as endpointIdFromURL,
  isPotentialProblem,
  isDuplicateMode,
  isEditMode
} from 'in-applications/navigation/matrix';
import { categoryGlobal, categoryLocal } from 'in-alerting/smart-alerts/components/list/constants';
import { AlertURLProps } from 'in-alerting/smart-alerts/components/list/AlertsBaseList';
import { cancelUrl } from 'in-alerting/smart-alerts/components/list/constants';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { cloneLocation } from 'in-stores/navigation/routing/clone';
import { smartAlertPath } from 'in-applications/navigation/paths';
import { Location } from 'in-stores/navigation/types';
import {} from 'in-applications/navigation/matrix';

interface ApplicationAlertURLProps extends AlertURLProps {
  isGlobal: boolean;
  migration?: boolean;
  boundaryScope?: string;
  serviceId?: string;
  applicationId?: string;
  endpointId?: string;
  eventSpecificationId?: string;
  potentialProblem?: string;
}

export function useSmartAlertCreateUrl(): ({
  isGlobal,
  migration,
  alertId,
  alertConfigCreated,
  boundaryScope,
  serviceId,
  applicationId,
  endpointId,
  eventSpecificationId,
  potentialProblem,
  duplicateMode,
  editMode
}: ApplicationAlertURLProps) => string {
  const { createHref, location } = useNavigation();
  const currentLocation = useLocation();

  return useCallback(
    ({
      isGlobal,
      migration,
      boundaryScope,
      alertId,
      alertConfigCreated,
      serviceId,
      applicationId,
      endpointId,
      eventSpecificationId,
      potentialProblem,
      duplicateMode,
      editMode
    }: ApplicationAlertURLProps) => {
      const returnUrlWithParams = createHref(currentLocation);
      const clonedLocation = cloneLocation(location);
      updateCreatePathMetrixParams(
        clonedLocation,
        isGlobal,
        returnUrlWithParams,
        migration,
        boundaryScope,
        alertId,
        alertConfigCreated,
        serviceId,
        applicationId,
        endpointId,
        eventSpecificationId,
        potentialProblem,
        duplicateMode,
        editMode
      );
      return createHref({
        ...clonedLocation
      });
    },
    [createHref, currentLocation, location]
  );
}

function updateCreatePathMetrixParams(
  location: Location,
  isGlobal: boolean,
  returnUrlWithParams: string,
  migration?: boolean,
  boundaryScope?: string,
  alertConfigId?: string,
  alertConfigCreated?: number,
  serviceId?: string,
  applicationId?: string,
  endpointId?: string,
  eventSpecificationId?: string,
  potentialProblem?: string,
  duplicateMode?: boolean,
  editMode?: boolean
) {
  const configsCategory = isGlobal ? categoryGlobal : categoryLocal;

  setOrDeleteMatrixKey(location, smartAlertPath, alertsCategory, configsCategory);
  if (applicationId && !isGlobal) setOrDeleteMatrixKey(location, smartAlertPath, applicationIdFromURL, applicationId);
  if (boundaryScope) setOrDeleteMatrixKey(location, smartAlertPath, boundaryScopeFromURL, boundaryScope);
  if (alertConfigId) setOrDeleteMatrixKey(location, smartAlertPath, alertId, String(alertConfigId));
  if (alertConfigCreated) setOrDeleteMatrixKey(location, smartAlertPath, alertCreated, alertConfigCreated);
  if (eventSpecificationId && migration) setOrDeleteMatrixKey(location, smartAlertPath, eventId, eventSpecificationId);
  if (migration) setOrDeleteMatrixKey(location, smartAlertPath, isMigration, String(migration));
  if (serviceId) setOrDeleteMatrixKey(location, smartAlertPath, serviceIdFromURL, serviceId);
  if (endpointId) setOrDeleteMatrixKey(location, smartAlertPath, endpointIdFromURL, endpointId);
  if (potentialProblem) setOrDeleteMatrixKey(location, smartAlertPath, isPotentialProblem, String(potentialProblem));
  if (duplicateMode) setOrDeleteMatrixKey(location, smartAlertPath, isDuplicateMode, String(duplicateMode));
  if (editMode) setOrDeleteMatrixKey(location, smartAlertPath, isEditMode, String(editMode));
  //always keep the cancelURL param at the end.
  setOrDeleteMatrixKey(location, smartAlertPath, cancelUrl, returnUrlWithParams);
  location.pathname = smartAlertPath;
}
