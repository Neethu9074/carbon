/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Group, Order } from '@instana/types';

import { getMetricKey } from 'in-infrastructure/Explore/services/metrics';
import { defaultOrder } from 'in-infrastructure/Explore/constants';
import { MetricItem } from 'in-infrastructure/navigation/paths';

export function toBackendGroupBy(groupBy?: Group[]) {
  if (!groupBy) {
    return [];
  }
  return groupBy?.filter(g => g?.groupbyTag).map(g => toGroupTag(g));
}

export function toGroupTag(group: Group) {
  return group?.groupbyTagSecondLevelKey ? group.groupbyTag + '.' + group.groupbyTagSecondLevelKey : group.groupbyTag;
}

export function getDefaultOrder(backendGroupBy: string[], direction = defaultOrder.direction) {
  if (!backendGroupBy || backendGroupBy.length === 0) {
    return defaultOrder;
  }
  return {
    by: backendGroupBy[0],
    direction
  };
}

export function getUpdatedOrder(order: Order, metrics: MetricItem[], groupBys: string[]) {
  const sortedMetric = order && metrics.find(metric => order.by.startsWith(metric.metric));
  if (sortedMetric) {
    return {
      by: getMetricKey(sortedMetric.metric, sortedMetric.aggregation, sortedMetric.crossSeriesAggregation),
      direction: order.direction
    };
  }
  const sortedGroup = order && groupBys.find(groupBy => order.by === groupBy);
  if (sortedGroup) {
    return {
      by: sortedGroup,
      direction: order.direction
    };
  }
  return getDefaultOrder(groupBys, order.direction);
}

export function fixOrderForBackwardsCompatibility(order: Order, metrics: MetricItem[]) {
  const metricKeys = metrics.map(({ metric, aggregation, crossSeriesAggregation }) =>
    getMetricKey(metric, aggregation, crossSeriesAggregation)
  );
  if (metricKeys.includes(order.by)) {
    return order;
  }
  for (const metric of metricKeys) {
    if (metric.startsWith(order.by)) {
      return {
        by: metric,
        direction: order.direction
      };
    }
  }
  return order;
}
