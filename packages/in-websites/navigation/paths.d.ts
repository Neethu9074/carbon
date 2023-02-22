/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { Observable } from '@instana/observables';

import { BeaconType, Group, TagCatalog, TimeConfig, AggregationType, Nullish } from 'in-types';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';

export declare const alertsTab: string;
export declare const alertsTabListFullyQualified: string;
export declare const alertsTabDetailsFullyQualified: string;

export declare const analyzePath: string;

export declare const websiteMonitoringPath: string;
export declare const websitesPathFullyQualified: string;

export function getLinkToAlertConfig(
  alertConfigId?: string | Nullish,
  alertConfigVersion?: string | Nullish,
  websiteId?: string | Nullish
): Observable<string>;

export function getLinkToWebsite(
  websiteId: string | Nullish,
  {
    tabPath,
    tabParameters,
    pageId,
    timeConfig
  }?: {
    tabPath?: string | Nullish;
    tabParameters?: string | Nullish;
    pageId?: string | Nullish;
    timeConfig?: string | Nullish;
  }
): Observable<string>;

export function getAlertConfig(alertConfigId?: string | Nullish, websiteId?: string | Nullish): Observable<string>;

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
