/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { Observable } from '@instana/observables';

import { Group, Order, TagCatalog, TimeConfig } from 'in-types';

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
