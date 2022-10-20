/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { Observable } from '@instana/observables';

import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import { BeaconType, Group, TagCatalog, TimeConfig, AggregationType } from 'in-types';

export declare const analyzePath: string;
export declare const websiteMonitoringPath: string;

interface Fields {
  metricId: string;
  aggregationId: AggregationType;
  type: metricType;
}

interface ChartedMetric {
  metricId: string;
  aggregationId: string;
}

interface getLinkToWebsiteAnalayzeProps {
  beaconType: BeaconType;
  groupBy: Group;
  formModel?: FormModelElement[];
  chartedMetrics?: ChartedMetric[];
  fields?: Fields[];
  timeConfig?: TimeConfig;
  tagCatalog?: TagCatalog;
  detailId?: string;
}

export function getLinkToAnalyze({
  beaconType,
  groupBy,
  formModel,
  chartedMetrics,
  fields,
  timeConfig,
  tagCatalog,
  detailId
}: getLinkToWebsiteAnalayzeProps): Observable<string>;
