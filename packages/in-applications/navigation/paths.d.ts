/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { TagFilter } from '@instana/types/typeDefinitions';

import { Group, Order, TagCatalog, TimeConfig, ApplicationBoundaryScope, BoundaryScope } from 'in-types';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';

export declare const applicationsList: string;
export declare const alertsList: string;
export declare const alertsTab: string;
export declare const alertsTabDetailsFullyQualified: string;
export declare const alertsTabListFullyQualified: string;
export declare const applicationDashboard: string;
export declare const configurationTab: string;
export declare const dependencyMapTab: string;
export declare const serviceDashboard: string;
export declare const endpointDashboard: string;
export declare const getLinkToAlertConfig: string;
export declare const getLinkToGlobalAlertConfigWithoutAPDashboard: string;
export declare const globalAlertDetails: string;
export declare const globalSmartAlertPath: string;
export declare const smartAlertPath: string;
export declare const smartAlertsTab: string;
export declare const summaryTab: string;
export declare const resourceOptimizationsTab: string;
export declare const syntheticsTab: string;
export declare const servicesList: string;
export declare const subtracesList: string;
export declare const subtraceDashboard: string;
export declare const subtraceConfigurationFullyQualified: string;

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

interface GetLinkToAnalyzeProps {
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
  contextScope?: string;
}

interface UseLinkToListProps {
  timeConfig?: TimeConfig;
  applicationId: string;
  serviceId?: string;
  endpointId?: string;
  contextScope: string;
  tagFilters?: TagFilter[];
  snapshotId: string;
  plugin?: string;
}

export function useLinkToApplicationList(): (props: UseLinkToListProps) => string;

export function useLinkToServiceList(): (props: UseLinkToListProps) => string;

export function useLinkToAnalyze(): (props: Partial<GetLinkToAnalyzeProps>) => string;

export function useAlertConfig(): (alertConfigId: string, applicationId: string) => string;

export function useLinkToGlobalAlertConfigWithoutAPDashboard(): (alertConfigId: string) => string;

export function useNavigationToGlobalAlertConfigWithoutAPDashboard(): (alertConfigId: string) => void;

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

export function useNavigationToAlertConfig(): (
  alertConfigId: string,
  alertConfigVersion: number,
  applicationId: string
) => void;

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

export function isApplicationsView(path: string): boolean;

export function useLinkToApplicationDashboard(): (applicationDashboardProps: ApplicationDashboardProps) => string;

export function useLinkToServiceDashboard(): (serviceDashboardProps: ServiceDashboardProps) => string;

export function useLinkToEndpointDashboard(): (endpointDashboardProps: EndpointDashboardProps) => string;
export function useLinkToUngroupedView(): string;
