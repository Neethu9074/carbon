/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { AggregationType, TagCatalog, TimeConfig } from '@instana/types';
import { Group } from '@instana/types/typeDefinitions';

import { ChartedMetric, ChartedTemplateMetric } from 'in-applications/navigation/paths';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import { MetricField } from 'in-analyze/navigation/paths';

export interface Fields {
  metricId: string;
  aggregationId: AggregationType;
  type: string;
}
export interface NavigateToWebsiteParams {
  tabPath?: string;
  tabParameters?: any;
  pageId?: string;
  timeConfig?: TimeConfig;
}

export interface UseLinkToAnalyzeParams {
  beaconType: string;
  groupBy: Group;
  formModel: FormModelElement[];
  chartedMetrics: Array<ChartedMetric | ChartedTemplateMetric>;
  fields: MetricField[];
  timeConfig: TimeConfig;
  tagCatalog: TagCatalog;
  detailId: string;
}

export interface UseLinkToPageLoadParams {
  pageLoadId: string;
  beaconId: string;
  beaconTimestamp: string;
}
