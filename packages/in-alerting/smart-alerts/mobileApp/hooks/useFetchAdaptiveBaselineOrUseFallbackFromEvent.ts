/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { useObservable } from '@instana/hooks';
import { TimeConfig } from '@instana/types';

import getBaselinePredictions from 'in-alerting/smart-alerts/mobileApp/subscriptions/getMobileAppAdaptiveBaselinePredictions';
import { extractBaselineFromResultsOrUseErrorFallback } from 'in-alerting/smart-alerts/components/utils/baselineUtils';
import { MobileAppSmartAlertConfigWithMetadata } from 'in-alerting/smart-alerts/eum/data/eumAlertConfigTypes';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import { pendingResult } from 'in-services/fixedObjects';

interface useFetchAdaptiveBaselineProps {
  alertConfigWithFormModel: Omit<MobileAppSmartAlertConfigWithMetadata, 'tagFilterExpression'> & {
    tagFilterExpression: FormModelElement[];
  };
  viewConfig: {
    timeConfig: TimeConfig;
  };
  eventBasedAdaptiveBaseline: [number, number][];
}

export function useFetchAdaptiveBaselineOrUseFallbackFromEvent(props: useFetchAdaptiveBaselineProps): {
  baseline: [number, number][];
  error?: boolean;
} {
  const {
    alertConfigWithFormModel: { created, id, granularity, mobileAppId },
    viewConfig: { timeConfig },
    eventBasedAdaptiveBaseline
  } = props;

  const queryParams = {
    alertConfigId: id,
    alertCreated: created,
    mobileAppId,
    timeConfig,
    granularity
  };

  const persistedBaseline = useObservable(getBaselinePredictions(queryParams).startWith(pendingResult), [
    id,
    created,
    mobileAppId,
    timeConfig
  ]);

  return extractBaselineFromResultsOrUseErrorFallback(persistedBaseline, eventBasedAdaptiveBaseline);
}
