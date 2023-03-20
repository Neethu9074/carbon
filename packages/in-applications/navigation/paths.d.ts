/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { ApplicationBoundaryScope } from '@instana/types';
import { Observable } from '@instana/observables';

import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import { Group, Order, TagCatalog, TimeConfig, ApplicationBoundaryScope, BoundaryScope } from 'in-types';

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

export function useAlertConfig(): (alertConfigId: string, applicationId: string) => string;

export function useLinkToGlobalAlertConfigWithoutAPDashboard(): (alertConfigId: string) => string;

export function useLinkToGlobalAlertConfigWithAPDashboard(): (
  alertConfigId: string,
  alertConfigVersion: number,
  applicationId: string
) => string;

export function useLinkToAlertConfig(): (
  alertConfigId: string,
  alertConfigVersion: number,
  applicationId: string
) => string;

interface UseDashboardProps {
  applicationId?: string;
  boundaryScope?: BoundaryScope;
  tab?: string;
  syntheticCalls?: string;
  tabMatrix?: Record<string, string>;
  timeConfig?: TimeConfig;
}

interface ApplicationDashboardProps extends UseDashboardProps {
  applicationId: string;
}

interface ServiceDashboardProps extends UseDashboardProps {
  serviceId: string;
}

interface EndpointDashboardProps extends UseDashboardProps {
  endpointId: string;
  serviceId?: string;
}

export function useLinkToApplicationDashboard(): (applicationDashboardProps: ApplicationDashboardProps) => string;
export function useLinkToServiceDashboard(): (serviceDashboardProps: ServiceDashboardProps) => string;
export function useLinkToEndpointDashboard(): (endpointDashboardProps: EndpointDashboardProps) => string;
