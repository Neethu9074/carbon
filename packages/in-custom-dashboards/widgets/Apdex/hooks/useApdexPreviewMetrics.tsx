/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { isUndefined } from 'lodash';

import { MetricResult, Result, TimeConfig, ApdexEntityUnion } from '@instana/types';
import { generateStableHash } from '@instana/utils';
import { useObservable } from '@instana/hooks';

import getApdexPreview from 'in-custom-dashboards/widgets/Apdex/subscriptions/getApdexPreview';
import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';
import { successObservable } from 'in-services/util/result';
import { pendingResult } from 'in-services/fixedObjects';
import { FetchedState } from 'in-hooks/utils/types';

export type ApdexWebsitePreviewEntity = Omit<ApdexEntityUnion, 'threshold' | 'tagFilterExpression'> &
  Partial<Pick<ApdexEntityUnion, 'threshold' | 'tagFilterExpression'>>;

export type ApdexApplicationPreviewEntity = Omit<ApdexEntityUnion, 'threshold' | 'tagFilterExpression'> &
  Partial<Pick<ApdexEntityUnion, 'threshold' | 'tagFilterExpression'>>;

export type ApdexPreviewEntityUnion = ApdexWebsitePreviewEntity | ApdexApplicationPreviewEntity;

interface UseApdexPreviewMetricsProps<APDEX_TYPE> {
  timeConfig: TimeConfig;
  apdexEntity?: APDEX_TYPE;
}

export default function useApdexPreviewMetrics({
  timeConfig,
  apdexEntity
}: UseApdexPreviewMetricsProps<ApdexWebsitePreviewEntity>): FetchedState<MetricResult>;
export default function useApdexPreviewMetrics({
  timeConfig,
  apdexEntity
}: UseApdexPreviewMetricsProps<ApdexApplicationPreviewEntity>): FetchedState<MetricResult> {
  const result: Result<MetricResult> =
    useObservable(() => {
      const hasThreshold = !isUndefined(apdexEntity?.threshold);
      const hasTagFilterExpression = !isUndefined(apdexEntity?.tagFilterExpression);
      const isEntityValid = !!apdexEntity && hasThreshold && hasTagFilterExpression;

      if (!isEntityValid) return successObservable([]);

      return getApdexPreview({ timeConfig, apdexEntity: apdexEntity as ApdexEntityUnion });
    }, [timeConfig, generateStableHash(apdexEntity)]) ?? pendingResult;
  return resultToFetchedStateResponse(result);
}
