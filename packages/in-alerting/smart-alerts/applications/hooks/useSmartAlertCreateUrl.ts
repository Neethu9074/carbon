/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { useCallback } from 'react';

import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import { getMatrixParameter, setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { cloneLocation } from 'in-stores/navigation/routing/clone';
import { returnUrl } from 'in-alerting/smart-alerts/components/list/constants';
import { applicationId, alertsCategory, isMigration } from 'in-applications/navigation/matrix';
import { Location } from 'in-stores/navigation/types';
import { smartAlertPath, applicationDashboard } from 'in-applications/navigation/paths';

export function useSmartAlertCreateUrl(): ({
  isGlobal,
  migration
}: {
  isGlobal: boolean;
  migration: boolean;
}) => string {
  const { createHref, location } = useNavigation();
  const currentLocation = useLocation();

  return useCallback(
    ({ isGlobal, migration }: { isGlobal: boolean; migration: boolean }) => {
      const returnUrlWithParams = createHref(currentLocation);
      const clonedLocation = cloneLocation(location);
      updateCreatePathMetrixParams(clonedLocation, isGlobal, returnUrlWithParams, migration);
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
  migration: boolean
) {
  const appId = getMatrixParameter(location, applicationDashboard, 'appId') ?? undefined;
  const configsCategory = isGlobal ? 'global' : 'local';

  if (applicationId && !isGlobal) setOrDeleteMatrixKey(location, smartAlertPath, applicationId, appId);
  setOrDeleteMatrixKey(location, smartAlertPath, alertsCategory, configsCategory);
  setOrDeleteMatrixKey(location, smartAlertPath, returnUrl, returnUrlWithParams);
  setOrDeleteMatrixKey(location, smartAlertPath, isMigration, String(migration));
  location.pathname = smartAlertPath;
}
