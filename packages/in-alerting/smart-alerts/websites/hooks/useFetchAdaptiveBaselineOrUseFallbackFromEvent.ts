/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { useObservable } from '@instana/hooks';
import { TimeConfig } from '@instana/types';

import {
  AdaptiveBaselineFetchedPredictions,
  AdaptiveBaselinePredictionData
} from 'in-alerting/smart-alerts/data/adaptiveBaselinePredictionInfo';
import { extractMultiBaselineFromResultsOrUseErrorFallback } from 'in-alerting/smart-alerts/components/utils/baselineUtils';
import getBaselinePredictions from 'in-alerting/smart-alerts/websites/subscriptions/getWebsiteAdaptiveBaselinePredictions';
import { WebsiteSmartAlertConfigWithMetadata } from 'in-alerting/smart-alerts/eum/data/eumAlertConfigTypes';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import { pendingResult } from 'in-services/fixedObjects';

interface useFetchAdaptiveBaselineProps {
  alertConfigWithFormModel: Omit<WebsiteSmartAlertConfigWithMetadata, 'tagFilterExpression'> & {
    tagFilterExpression: FormModelElement[];
  };
  viewConfig: {
    timeConfig: TimeConfig;
  };
  eventBasedAdaptiveBaseline: Array<[string, AdaptiveBaselinePredictionData]>;
}

export function useFetchAdaptiveBaselineOrUseFallbackFromEvent(props: useFetchAdaptiveBaselineProps): {
  baseline: AdaptiveBaselineFetchedPredictions;
  error?: boolean;
} {
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

  return extractMultiBaselineFromResultsOrUseErrorFallback(persistedBaseline, eventBasedAdaptiveBaseline);
}
