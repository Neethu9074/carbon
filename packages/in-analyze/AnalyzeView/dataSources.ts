/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { get } from 'lodash';

// eslint-disable-next-line no-restricted-imports
import { getAnalyzeFilterTagKeys, getCallGroupTagKeys, getTraceGroupTagKeys } from 'in-applications/tags';
import { ApplicationTagFilterEntity, CallItem, DataSource, TagFilter, TraceItem } from 'in-types';
import { entityTypes } from 'in-analyze/applicationFilter';
import { pageNames } from 'in-services/tracking/pageNames';
import { deepFreeze } from 'in-services/util/object';
import { t } from 'in-i18n';

export type AnalyzeDataSource = Lowercase<DataSource | 'profiles'>;
interface FilterTagKeysConfig {
  filterTagKeys: ReturnType<typeof getAnalyzeFilterTagKeys>;
}
interface DataSourceConfig<Entity> extends FilterTagKeysConfig {
  groupTagKeys: string[];
  errorneousTagPreset: string;
  latencyTagPreset: string;
  isSyntheticTagPreset: string;
  countMetricText: string;
  countMetricKey: string;
  defaultGrouping: {
    name: string;
    value: string;
    entity: ApplicationTagFilterEntity;
  };
  defaultFilters: TagFilter[];
  breadcrumbLabel: string;
  getMatcher: (traceId: string, callId?: string) => (item: Entity) => boolean;
  typeLabel: string;
  getTraceIdByItem: (item: Entity) => string | undefined;
  getCallIdByItem: (item: Entity) => string | undefined;
}
type AnalyzeDataSourceConfig<Source extends AnalyzeDataSource> = Source extends Lowercase<DataSource>
  ? DataSourceConfig<Source extends 'traces' ? TraceItem : CallItem>
  : FilterTagKeysConfig;

let configs: {
  [Source in AnalyzeDataSource]: AnalyzeDataSourceConfig<Source>;
};

export default function getByDataSource<Source extends AnalyzeDataSource>(
  dataSource: Source
): AnalyzeDataSourceConfig<Source> | {} {
  if (!configs) {
    const filterTagKeys = getAnalyzeFilterTagKeys();
    configs = {
      traces: {
        filterTagKeys,
        groupTagKeys: getTraceGroupTagKeys(),
        errorneousTagPreset: 'trace.erroneous',
        latencyTagPreset: 'trace.latency',
        isSyntheticTagPreset: 'call.is_synthetic',
        countMetricText: t('in-analyze:analyzeView.traces'),
        countMetricKey: 'traces',
        defaultGrouping: { name: 'trace.endpoint.name', value: '', entity: entityTypes.NOT_APPLICABLE },
        defaultFilters: [] as TagFilter[],
        breadcrumbLabel: t('in-analyze:analyzeView.dataSources.traceAnalytics'),
        getMatcher: (traceId: string) => (item: TraceItem) => item.trace.id === traceId,
        typeLabel: t('in-analyze:analyzeView.dataSources.trace'),
        getTraceIdByItem: (item: TraceItem) => item.trace.id,
        getCallIdByItem: () => undefined
      },
      calls: {
        filterTagKeys,
        groupTagKeys: getCallGroupTagKeys(),
        errorneousTagPreset: 'call.erroneous',
        latencyTagPreset: 'call.latency',
        isSyntheticTagPreset: 'call.is_synthetic',
        countMetricText: t('in-analyze:analyzeView.calls'),
        countMetricKey: 'calls',
        defaultGrouping: groupByEndpointName,
        defaultFilters: [] as TagFilter[],
        breadcrumbLabel: t('in-analyze:analyzeView.dataSources.callAnalytics'),
        getMatcher: (traceId: string, callId: string | undefined) => (item: CallItem) =>
          item.call.id === callId && item.call.traceId === traceId,
        typeLabel: t('in-analyze:analyzeView.dataSources.call'),
        getTraceIdByItem: (item: CallItem) => item.call.traceId,
        getCallIdByItem: (item: CallItem) => item.call.id
      },
      profiles: {
        filterTagKeys
      }
    } as const;
  }
  return configs[dataSource] || {};
}

export const groupByEndpointName = {
  name: 'endpoint.name',
  value: '',
  entity: entityTypes.DESTINATION
} as const;

export const groupByServiceName = {
  name: 'service.name',
  value: '',
  entity: entityTypes.DESTINATION
} as const;

export const productAreaLabels = Object.freeze<Record<ProductArea, string>>({
  application: t('in-analyze:analyzeView.dataSources.applications'),
  website: t('in-analyze:analyzeView.dataSources.websites'),
  mobileApp: t('in-analyze:analyzeView.dataSources.mobileApps'),
  profiles: t('in-analyze:analyzeView.dataSources.profiles'),
  logs: t('in-analyze:analyzeView.dataSources.logs'),
  infrastructure: t('in-analyze:analyzeView.dataSources.infrastructure')
} as const);

export const productAreaTrackingNames = Object.freeze({
  application: pageNames.applications,
  website: pageNames.websites,
  mobileApp: pageNames.mobile_apps,
  profiles: pageNames.profiles,
  logs: pageNames.log_smart_alerts,
  infrastructure: pageNames.infrastructure
} as const);

enum ProductAreaEnum {
  application,
  website,
  mobileApp,
  profiles,
  logs,
  infrastructure
}

enum EntityEnum {
  pageLoad,
  pageChange,
  resourceLoad,
  httpRequest,
  error,
  custom,
  profiles,
  infrastructure,
  calls,
  traces,
  logs,
  sessionStart,
  viewChange,
  crash,
  perf,
  dropBeacon
}

type Icon = Record<string, string>;

export type ProductArea = keyof typeof ProductAreaEnum;
export type DataSourceType<T extends ProductArea> = keyof (typeof icons)[T];
export type Entity = keyof typeof EntityEnum;

export const entityNames = Object.freeze<Record<Entity, string>>({
  pageLoad: t('in-analyze:analyzeView.dataSources.pageLoads'),
  pageChange: t('in-analyze:analyzeView.dataSources.pageTransitions'),
  resourceLoad: t('in-analyze:analyzeView.dataSources.resources'),
  httpRequest: t('in-analyze:analyzeView.dataSources.httpRequests'),
  error: t('in-analyze:analyzeView.dataSources.javaScriptErrors'),
  custom: t('in-analyze:analyzeView.dataSources.customEvents'),
  profiles: t('in-analyze:analyzeView.dataSources.profiles'),
  infrastructure: t('in-analyze:analyzeView.dataSources.infrastructure'),
  calls: t('in-analyze:analyzeView.dataSources.calls'),
  traces: t('in-analyze:analyzeView.dataSources.traces'),
  logs: t('in-analyze:analyzeView.dataSources.logs'),
  sessionStart: t('in-analyze:analyzeView.dataSources.sessionStarts'),
  viewChange: t('in-analyze:analyzeView.dataSources.viewTransitions'),
  crash: t('in-analyze:analyzeView.dataSources.crashes'),
  perf: t('in-analyze:analyzeView.dataSources.perf'),
  dropBeacon: t('in-analyze:analyzeView.dataSources.dropBeacon')
});

export const entityLabels = Object.freeze<Record<Entity, string>>({
  pageLoad: t('in-analyze:analyzeView.dataSources.pageLoads2'),
  pageChange: t('in-analyze:analyzeView.dataSources.pageTransitions2'),
  resourceLoad: t('in-analyze:analyzeView.dataSources.resources'),
  httpRequest: t('in-analyze:analyzeView.dataSources.httpRequests2'),
  error: t('in-analyze:analyzeView.dataSources.jsErrors'),
  custom: t('in-analyze:analyzeView.dataSources.customEvents2'),
  sessionStart: t('in-analyze:analyzeView.dataSources.sessionStarts'),
  viewChange: t('in-analyze:analyzeView.dataSources.viewTransitions2'),
  profiles: t('in-analyze:analyzeView.dataSources.profiles'),
  infrastructure: t('in-analyze:analyzeView.dataSources.infrastructure'),
  calls: t('in-analyze:analyzeView.dataSources.calls'),
  traces: t('in-analyze:analyzeView.dataSources.traces'),
  logs: t('in-analyze:analyzeView.dataSources.logs'),
  crash: t('in-analyze:analyzeView.dataSources.crashes'),
  perf: t('in-analyze:analyzeView.dataSources.perf'),
  dropBeacon: t('in-analyze:analyzeView.dataSources.dropBeacon')
});

export const getEntityNameByType = (type: Entity): string => entityNames[type] || type;
export const getLabelByType = (type: Entity): string => entityLabels[type] || type;

export const productAreaIcons = Object.freeze<Record<ProductArea, string>>({
  application: 'lib_application_invert',
  website: 'lib_website',
  mobileApp: 'lib_mobile_app',
  profiles: 'lib_profiling',
  logs: 'lib_application_logging',
  infrastructure: 'lib_infrastructure'
});

const icons = deepFreeze<Record<ProductArea, Icon>>({
  application: {
    traces: 'lib_application_trace',
    calls: 'lib_application_call',
    callsUQB: 'lib_application_call',
    tracesUQB: 'lib_application_trace',
    logs: 'lib_application_logging'
  },
  website: {
    pageLoad: 'lib_website_page_load',
    pageChange: 'lib_website_page_load',
    resourceLoad: 'lib_website_resource',
    httpRequest: 'lib_website_ajax',
    error: 'lib_website_error',
    custom: 'lib_website_custom'
  },
  mobileApp: {
    sessionStart: 'lib_mobile_app_session',
    viewChange: 'lib_mobile_app_view',
    httpRequest: 'lib_mobile_app_request',
    custom: 'lib_mobile_app_custom_event',
    crash: 'lib_mobile_app_crash',
    perf: 'lib_eum_performance',
    dropBeacon: 'lib_eum_dropped_beacon'
  },
  infrastructure: {
    infrastructure: 'lib_infrastructure',
    analytics: 'lib_bar_chart'
  },
  profiles: {
    profiles: 'lib_profiling'
  },
  logs: {
    logs: 'lib_application_logging'
  }
});

export function getIconByType<P extends ProductArea>(type: DataSourceType<P>, productArea: P): string {
  return get<typeof icons, P, DataSourceType<P>>(icons, [productArea, type]) as unknown as string;
}
