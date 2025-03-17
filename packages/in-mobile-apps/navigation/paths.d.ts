/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { TagCatalog, TimeConfig, Observable } from '@instana/types';
import { Group } from '@instana/types/typeDefinitions';

import { ChartedMetric, ChartedTemplateMetric } from 'in-applications/navigation/paths';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import { MetricField } from 'in-analyze/navigation/paths';

export declare const mobileAppMonitoringPath: string;
export declare const alertsTabDetailsFullyQualified: string;
export declare const alertsTabListFullyQualified: string;
export declare const crashesTabFullyQualified: string;
export declare const alertsTab: string;
export declare const summaryTab: string;
export declare const detailsPath: string;
export declare const mobileAppPathFullyQualified: string;
export declare const mobileAppSmartAlerts: string;
export declare const mobileAppSmartAlertsFullScreenFullyQualified: string;

export declare const isAnalyzeView: Observable<any>;

interface UseLinkToAnalyzeProps {
  beaconType: string;
  groupBy: Partial<Group>;
  formModel?: FormModelElement[];
  chartedMetrics?: Array<ChartedMetric | ChartedTemplateMetric>;
  timeConfig?: TimeConfig;
  fields?: MetricField[];
  tagCatalog?: TagCatalog;
  detailId?: string;
}

export function useLinkToAnalyze(): ({
  beaconType,
  groupBy,
  formModel,
  chartedMetrics,
  fields,
  tagCatalog,
  detailId,
  timeConfig
}: UseLinkToAnalyzeProps) => string;

export function useLinkToSession(): ({
  sessionId,
  beaconId,
  beaconTimestamp
}: {
  sessionId: string;
  beaconId?: string;
  beaconTimestamp: number;
}) => string;

export function useLinkToHttpRequest(): (
  mobileAppId: string,
  { httpRequestId, viewId }: { httpRequestId?: string; viewId?: string }
) => string;

export function useLinkToCustomEvent(): (
  mobileAppId: string,
  { customEventId, viewId }: { customEventId?: string; viewId?: string }
) => string;

export function useLinkToCrash(): (
  mobileAppId: string,
  { crashId, viewId }: { crashId?: string; viewId?: string }
) => string;

export const useGetAlertConfigLink: () => (
  alertConfigId: string,
  mobileAppId: string,
  alertConfigVersion?: number
) => string;

export function useGetLinkToMobileApp(
  mobileAppId: string,
  {
    tabPath = summaryTab,
    tabParameters,
    viewId,
    timeConfig
  }: {
    tabPath?: string;
    tabParameters?: Record<string, string>;
    viewId?: string;
    timeConfig?: TimeConfig;
  } = {}
): string;

export const useGenerateLinkToMobileApp: () => (
  mobileAppId: string,
  {
    tabPath = summaryTab,
    tabParameters,
    viewId,
    timeConfig
  }?: {
    tabPath?: string;
    tabParameters?: Record<string, string>;
    pageId?: string;
    timeConfig?: TimeConfig;
  }
) => string;
