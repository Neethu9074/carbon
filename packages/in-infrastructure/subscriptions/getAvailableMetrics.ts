/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { AvailableMetrics, GetAvailableMetricsQuery, Result } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';
import { hiddenPlugins } from 'in-forge/constants';
import { mapData } from 'in-services/util/result';

export default createResultSubscriptionFactory<GetAvailableMetricsQuery, Result<AvailableMetrics>>({
  eventId: 'infrastructure.getAvailableMetrics',
  mapResult: filterOutHiddenPlugins
});

function filterOutHiddenPlugins(result: Result<AvailableMetrics>): Result<AvailableMetrics> {
  return mapData(result, data => ({
    metrics: data.metrics?.filter(item => !hiddenPlugins.includes(item.ownerType))
  }));
}
