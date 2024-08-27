/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { useObservable } from '@instana/hooks';
import { TimeConfig } from '@instana/types';

import getBaselinePredictions from 'in-alerting/smart-alerts/applications/subscriptions/getApplicationAdaptiveBaselinePredictions';
import { ApplicationSmartAlertConfigWithMetadata } from 'in-alerting/smart-alerts/applications/data/applicationAlertConfigTypes';
import { extractBaselineFromResultsOrUseErrorFallback } from 'in-alerting/smart-alerts/components/utils/baselineUtils';
import { pendingResult } from 'in-services/fixedObjects';

interface useFetchAdaptiveBaselineProps {
  alertConfigWithFormModel: ApplicationSmartAlertConfigWithMetadata;
  viewConfig: {
    timeConfig: TimeConfig;
  };
  eventBasedAdaptiveBaseline: [number, number][];
  applicationId: string;
  serviceId?: string;
  endpointId?: string;
}

export function useFetchAdaptiveBaselineOrUseFallbackFromEvent(props: useFetchAdaptiveBaselineProps): {
  baseline: [number, number][];
  error?: boolean;
} {
  const {
    alertConfigWithFormModel: { created, id, granularity },
    viewConfig: { timeConfig },
    applicationId,
    serviceId,
    endpointId,
    eventBasedAdaptiveBaseline
  } = props;

  const selectedEntityId = endpointId ?? serviceId ?? applicationId;

  const queryParams = {
    alertConfigId: id,
    alertCreated: created,
    applicationId,
    entityId: selectedEntityId, // either endpoint or service or appId if selected
    timeConfig,
    granularity
  };

  const persistedBaseline = useObservable(
    selectedEntityId ? getBaselinePredictions(queryParams).startWith(pendingResult) : null,
    [id, created, applicationId, selectedEntityId, timeConfig]
  );

  return extractBaselineFromResultsOrUseErrorFallback(persistedBaseline, eventBasedAdaptiveBaseline);
}
