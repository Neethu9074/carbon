/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { ApplicationSloEntity, Result, WebsiteSloEntity, isApplicationSloEntity } from '@instana/types';
import { useObservable } from '@instana/hooks';

import useBasicTagFilterExpression from 'in-service-levels/navigation/hooks/useBasicFilterExpression';
import getUnifiedMetrics, { UnifiedMetricsResult } from 'in-subscription/getUnifiedMetrics';
import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';
import { applicationMetrics, websiteMetrics } from 'in-service-levels/metrics';
import { pendingResult } from 'in-services/fixedObjects';
import { number } from 'in-services/formatters/number';
import useTimeConfig from 'in-hooks/useTimeConfig';

export default function useEstimatedEventBasedErrorBudget(
  entity: ApplicationSloEntity & WebsiteSloEntity,
  target?: number
) {
  const timeConfig = useTimeConfig();
  const tagFilterExpression = useBasicTagFilterExpression({ entity });

  const isApplication = isApplicationSloEntity(entity);

  const metrics = isApplication ? applicationMetrics.calls : websiteMetrics.beaconCount;

  const result: Result<UnifiedMetricsResult[]> =
    useObservable(
      () =>
        getUnifiedMetrics({
          metrics: {
            calls: metrics.singleNumber({
              entity,
              tagFilterExpression,
              timeConfig,
              aggregation: 'SUM'
            })
          }
        }),
      [entity]
    ) ?? pendingResult;

  const callsResult = result.data?.find(res => res.id === 'calls');
  const callsCount = callsResult?.values?.[0][1] ?? 0;

  if (!target) return valueMissingPlaceholder;

  return number.compact(Math.round((1 - target) * callsCount));
}
