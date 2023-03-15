/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Observable } from '@instana/observables';

import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import { AggregationType, Group, Order, TimeConfig } from 'in-types';

interface MetricItem {
  metric: string;
  aggregation: AggregationType;
}

interface ChartedMetric {
  metricId: string;
  aggregationId: AggregationType;
  rendererId: string;
}

interface GetLinkToExploreProps {
  tagFilterExpression?: FormModelElement[];
  group?: Group;
  charts?: object;
  type?: string;
  metrics?: Array<MetricItem>;
  order?: Order;
  timeConfig?: TimeConfig;
  chartedMetrics?: Array<ChartedMetric>;
}

export function getLinkToExplore({
  tagFilterExpression,
  group,
  charts,
  type,
  metrics,
  order,
  timeConfig,
  chartedMetrics
}: GetLinkToExploreProps): Observable<string>;
