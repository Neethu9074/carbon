/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { useCallback } from 'react';

import {
  applicationId,
  boundaryScope as boundaryScopeFromURL,
  alertsCategory,
  isMigration,
  alertId,
  alertCreated
} from 'in-applications/navigation/matrix';
import { categoryGlobal, categoryLocal } from 'in-alerting/smart-alerts/components/list/constants';
import { smartAlertPath, applicationDashboard } from 'in-applications/navigation/paths';
import { getMatrixParameter, setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { cancelUrl } from 'in-alerting/smart-alerts/components/list/constants';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import { cloneLocation } from 'in-stores/navigation/routing/clone';
import { Location } from 'in-stores/navigation/types';

export function useSmartAlertCreateUrl(): ({
  isGlobal,
  migration,
  alertId,
  alertConfigCreated,
  boundaryScope
}: {
  isGlobal: boolean;
  migration?: boolean;
  alertId?: string;
  alertConfigCreated?: number;
  boundaryScope?: string;
}) => string {
  const { createHref, location } = useNavigation();
  const currentLocation = useLocation();

  return useCallback(
    ({
      isGlobal,
      migration,
      boundaryScope,
      alertId,
      alertConfigCreated
    }: {
      isGlobal: boolean;
      migration?: boolean;
      boundaryScope?: string;
      alertId?: string;
      alertConfigCreated?: number;
    }) => {
      const returnUrlWithParams = createHref(currentLocation);
      const clonedLocation = cloneLocation(location);
      updateCreatePathMetrixParams(
        clonedLocation,
        isGlobal,
        returnUrlWithParams,
        migration,
        boundaryScope,
        alertId,
        alertConfigCreated
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
  alertConfigCreated?: number
) {
  const appId = getMatrixParameter(location, applicationDashboard, applicationId) ?? undefined;
  const configsCategory = isGlobal ? categoryGlobal : categoryLocal;

  if (applicationId && !isGlobal) setOrDeleteMatrixKey(location, smartAlertPath, applicationId, appId);
  if (boundaryScope) setOrDeleteMatrixKey(location, smartAlertPath, boundaryScopeFromURL, boundaryScope);
  if (alertConfigId) setOrDeleteMatrixKey(location, smartAlertPath, alertId, String(alertConfigId));
  if (alertConfigCreated) setOrDeleteMatrixKey(location, smartAlertPath, alertCreated, alertConfigCreated);
  if (migration) setOrDeleteMatrixKey(location, smartAlertPath, isMigration, String(migration));
  setOrDeleteMatrixKey(location, smartAlertPath, alertsCategory, configsCategory);
  setOrDeleteMatrixKey(location, smartAlertPath, cancelUrl, returnUrlWithParams);
  setOrDeleteMatrixKey(location, smartAlertPath, isMigration, String(migration));
  location.pathname = smartAlertPath;
}
