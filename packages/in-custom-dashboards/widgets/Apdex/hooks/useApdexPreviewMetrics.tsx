/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { isUndefined } from 'lodash';

import {
  MetricResult,
  Result,
  TimeConfig,
  ApdexEntityUnion,
  WebsiteApdexEntity,
  ApplicationApdexEntity
} from '@instana/types';
import { generateStableHash } from '@instana/utils';
import { useObservable } from '@instana/hooks';

import getApdexPreview from 'in-custom-dashboards/widgets/Apdex/subscriptions/getApdexPreview';
import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';
import { successObservable } from 'in-services/util/result';
import { pendingResult } from 'in-services/fixedObjects';
import { FetchedState } from 'in-hooks/utils/types';

export type WebsiteApdexPreviewEntity = Omit<WebsiteApdexEntity, 'threshold' | 'tagFilterExpression'> &
  Partial<Pick<WebsiteApdexEntity, 'threshold' | 'tagFilterExpression'>>;

export type ApplicationApdexPreviewEntity = Omit<ApplicationApdexEntity, 'threshold' | 'tagFilterExpression'> &
  Partial<Pick<ApplicationApdexEntity, 'threshold' | 'tagFilterExpression'>>;

export type ApdexPreviewEntityUnion = WebsiteApdexPreviewEntity | ApplicationApdexPreviewEntity;

interface UseApdexPreviewMetricsProps {
  timeConfig: TimeConfig;
  apdexEntity?: ApdexPreviewEntityUnion;
}

export default function useApdexPreviewMetrics({
  timeConfig,
  apdexEntity
}: UseApdexPreviewMetricsProps): FetchedState<MetricResult> {
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
