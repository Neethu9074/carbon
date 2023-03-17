/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { ApplicationBoundaryScope } from '@instana/types';
import { Observable } from '@instana/observables';

import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import { Group, Order, TagCatalog, TimeConfig } from 'in-types';

export declare const alertsList: string;
export declare const alertsTab: string;
export declare const alertsTabDetailsFullyQualified: string;
export declare const alertsTabListFullyQualified: string;
export declare const applicationDashboard: string;
export declare const getLinkToAlertConfig: string;
export declare const getLinkToGlobalAlertConfigWithoutAPDashboard: string;
export declare const globalAlertDetails: string;

interface ChartedMetric {
  metricId: string;
  aggregationId: string;
}

interface ChartedTemplateMetric {
  templateId: string;
}

interface MetricFields {
  metricId: string;
  aggregationId: string;
  type: unknown;
}

interface GetLinkToAnalyzProps {
  beaconType: string;
  applicationName: string;
  serviceName: string;
  endpointName: string;
  boundaryScope: ApplicationBoundaryScope;
  jumpToSource: boolean;
  dataSource: Lowercase<ApplicationDataSource>;
  groupBy: Partial<Group>;
  orderBy: Partial<Order>;
  orderByGroups: Partial<Group>;
  formModel: FormModelElement[];
  facets: unknown;
  hiddenCalls: unknown;
  chartedMetrics: Array<ChartedMetric | ChartedTemplateMetric>;
  fields: Array<MetricFields>;
  fastQueryModeEnabled: boolean;
  timeConfig: TimeConfig;
  tagCatalog: TagCatalog;
  setOnClickNotificationMessage: (message: string) => void;
}

export function getLinkToAnalyze(props: Partial<GetLinkToAnalyzProps>): Observable<string>;
