/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { useObservable } from '@instana/hooks';

import getBaselinePredictions from 'in-alerting/smart-alerts/websites/subscriptions/getWebsiteAdaptiveBaselinePredictions';
import { extractBaselineFromResultsOrUseErrorFallback } from 'in-alerting/smart-alerts/components/utils/baselineUtils';
import { pendingResult } from 'in-services/fixedObjects';

export function useFetchAdaptiveBaselineOrUseFallbackFromEvent(props) {
  const {
    alertConfigWithFormModel: { created, id, granularity, websiteId },
    viewConfig: { timeConfig },
    eventBasedAdaptiveBaseline
  } = props;

  const queryParams = {
    alertConfigId: id,
    alertCreated: created,
    websiteId,
    timeConfig,
    granularity
  };

  const persistedBaseline = useObservable(getBaselinePredictions(queryParams).startWith(pendingResult), [
    id,
    created,
    websiteId,
    timeConfig
  ]);

  return extractBaselineFromResultsOrUseErrorFallback(persistedBaseline, eventBasedAdaptiveBaseline);
}
