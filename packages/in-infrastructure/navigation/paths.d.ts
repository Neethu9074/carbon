/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import { AggregationType, Group, Order, TimeConfig } from 'in-types';
import { Grouping } from 'in-custom-dashboards/widgets/Table/types';

export interface MetricItem {
  metric: string;
  aggregation: AggregationType;
}

interface GetLinkToExploreProps {
  tagFilterExpression?: FormModelElement[] | TagFilterExpressionElementUnion;
  group?: Group;
  type?: string;
  metrics?: Array<MetricItem>;
  order?: Order;
  timeConfig?: TimeConfig;
  groupBy?: Partial<Grouping[]>;
  chartedMetrics?: Array<MetricItem>;
}

export function useLinkToExplore(): (getLinkToExploreProps: GetLinkToExploreProps) => string;

export const defaultInfraExploreViewParams: GetLinkToExploreProps;
