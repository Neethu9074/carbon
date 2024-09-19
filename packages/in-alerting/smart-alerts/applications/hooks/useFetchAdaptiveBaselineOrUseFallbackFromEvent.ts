/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { useObservable } from '@instana/hooks';
import { TimeConfig } from '@instana/types';

import getBaselinePredictions from 'in-alerting/smart-alerts/applications/subscriptions/getApplicationAdaptiveBaselinePredictions';
import { ApplicationSmartAlertConfigWithMetadata } from 'in-alerting/smart-alerts/applications/data/applicationAlertConfigTypes';
import { extractMultiBaselineFromResultsOrUseErrorFallback } from 'in-alerting/smart-alerts/components/utils/baselineUtils';
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
    alertConfigWithFormModel,
    viewConfig: { timeConfig },
    applicationId,
    serviceId,
    endpointId,
    eventBasedAdaptiveBaseline
  } = props;

  const { created, id, granularity } = alertConfigWithFormModel;
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
  const extractedResult = extractMultiBaselineFromResultsOrUseErrorFallback(
    persistedBaseline,
    transformEventBasedAdaptiveBaseline(eventBasedAdaptiveBaseline, alertConfigWithFormModel)
  );
  return extractBaselineFromResult(alertConfigWithFormModel, extractedResult);
}

function isOnlyCriticalDefined(alertConfigWithFormModel: ApplicationSmartAlertConfigWithMetadata): boolean {
  const thresholds = alertConfigWithFormModel.rules?.[0]?.thresholds;
  return Boolean(thresholds?.CRITICAL);
}

function transformEventBasedAdaptiveBaseline(
  baseline: [number, number][],
  alertConfigWithFormModel: ApplicationSmartAlertConfigWithMetadata
): [number, number, number][] {
  if (!baseline) {
    return [];
  }
  const isCritical = isOnlyCriticalDefined(alertConfigWithFormModel);

  return baseline.map(datapoint => {
    return isCritical ? [datapoint[0], datapoint[1], 0] : [datapoint[0], 0, datapoint[1]];
  });
}

function extractBaselineFromResult(
  alertConfigWithFormModel: ApplicationSmartAlertConfigWithMetadata,
  extractedPersistedBaselineResult: {
    baseline: [number, number, number][];
    error?: boolean;
  }
): {
  baseline: [number, number][];
  error?: boolean;
} {
  const { baseline, error } = extractedPersistedBaselineResult;
  if (error) {
    return {
      baseline: [],
      error: true
    };
  }
  const isCritical = isOnlyCriticalDefined(alertConfigWithFormModel);
  const finalBaseline: [number, number][] = baseline.map(datapoint => {
    return isCritical ? [datapoint[0], datapoint[2]] : [datapoint[0], datapoint[1]];
  });

  return { baseline: finalBaseline };
}
