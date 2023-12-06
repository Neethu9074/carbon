/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { useObservable } from '@instana/hooks';

import { getEventSpecifications, getApplicationSmartAlertConfigs } from 'in-automation/api';
import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';
import { all as allStatus } from 'in-hooks/utils/fetchStatus';
import { all as allProgress } from 'in-hooks/utils/progress';
import { Triggers } from 'in-automation/Policies/types';
import { FetchedState } from 'in-hooks/utils/types';
import { EventSpecificationInfo } from 'in-types';

export default function useTriggers(): FetchedState<Triggers> {
  const [eventSpecifications, eventSpecificationsStatus, eventSpecificationsErrors, eventSpecificationsProgress] =
    resultToFetchedStateResponse(useObservable(getEventSpecifications, []));
  const [
    applicationSmartAlerts,
    applicationSmartAlertsStatus,
    applicationSmartAlertsErrors,
    applicationSmartAlertsProgress
  ] = resultToFetchedStateResponse(useObservable(getApplicationSmartAlertConfigs, []));

  const status = allStatus(eventSpecificationsStatus, applicationSmartAlertsStatus);
  const progress = allProgress(eventSpecificationsProgress, applicationSmartAlertsProgress);
  const errors = [...eventSpecificationsErrors, ...applicationSmartAlertsErrors];

  if (status != 'resolved') {
    return [undefined, status, errors, progress];
  }

  const { customEvents, builtInEvents } =
    eventSpecifications?.reduce(
      (acc, eventSpecification) => {
        if (eventSpecification.type === 'CUSTOM') {
          acc.customEvents.push(eventSpecification);
        } else {
          acc.builtInEvents.push(eventSpecification);
        }
        return acc;
      },
      { customEvents: [], builtInEvents: [] } as {
        customEvents: EventSpecificationInfo[];
        builtInEvents: EventSpecificationInfo[];
      }
    ) ?? {};

  return [
    {
      customEvent: customEvents!,
      builtinEvent: builtInEvents!,
      applicationSmartAlert: applicationSmartAlerts!
    },
    status,
    errors,
    progress
  ];
}
