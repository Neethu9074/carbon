/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { useCallback } from 'react';

import { alertCreated, alertId, alertsCategory } from 'in-applications/navigation/matrix';
import { categoryGlobal } from 'in-alerting/smart-alerts/components/list/constants';
import { alertsList, globalAlertDetails } from 'in-applications/navigation/paths';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { cloneLocation } from 'in-stores/navigation/routing/clone';

export function useLinkToAlertDetails(): ({ created, id }: { created: number; id: string }) => string {
  const { location, createHref } = useNavigation();

  return useCallback(
    ({ created, id }: { created: number; id: string }) => {
      const clonedLocation = cloneLocation(location);

      clonedLocation.pathname = globalAlertDetails;
      setOrDeleteMatrixKey(clonedLocation, alertsList, alertsCategory, categoryGlobal);
      setOrDeleteMatrixKey(clonedLocation, alertsList, alertCreated, created);
      setOrDeleteMatrixKey(clonedLocation, alertsList, alertId, id);

      return createHref(clonedLocation);
    },
    [location, createHref]
  );
}
