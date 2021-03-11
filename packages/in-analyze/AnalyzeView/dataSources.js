/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { get } from 'lodash';

import { getAnalyzeFilterTagKeys, getCallGroupTagKeys, getTraceGroupTagKeys } from 'in-applications/tags';
import { entityTypes } from 'in-analyze/applicationFilter';
import { deepFreeze } from 'in-services/util/object';
import { t } from 'in-i18n';

let configs;
export default function getByDataSource(dataSource) {
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
        defaultFilters: [],
        breadcrumbLabel: t('in-analyze:analyzeView.dataSources.traceAnalytics'),
        getMatcher: traceId => item => item.trace.id === traceId,
        typeLabel: t('in-analyze:analyzeView.dataSources.trace'),
        getTraceIdByItem: item => item.trace.id,
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
        defaultFilters: [],
        breadcrumbLabel: t('in-analyze:analyzeView.dataSources.callAnalytics'),
        getMatcher: (traceId, callId) => item => item.call.id === callId && item.call.traceId === traceId,
        typeLabel: t('in-analyze:analyzeView.dataSources.call'),
        getTraceIdByItem: item => item.call.traceId,
        getCallIdByItem: item => item.call.id
      },
      profiles: {
        filterTagKeys
      }
    };
  }
  return configs[dataSource] || {};
}

export const groupByEndpointName = {
  name: 'endpoint.name',
  value: '',
  entity: entityTypes.DESTINATION
};

export const groupByServiceName = {
  name: 'service.name',
  value: '',
  entity: entityTypes.DESTINATION
};

export const productAreaLabels = Object.freeze({
  application: t('in-analyze:analyzeView.dataSources.applications'),
  website: t('in-analyze:analyzeView.dataSources.websites'),
  mobileApp: t('in-analyze:analyzeView.dataSources.mobileApps'),
  profiles: t('in-analyze:analyzeView.dataSources.profiles'),
  logs: t('in-analyze:analyzeView.dataSources.logs')
});

export const productAreaTrackingNames = Object.freeze({
  application: t('in-analyze:analyzeView.dataSources.applications'),
  website: t('in-analyze:analyzeView.dataSources.eumWebsites'),
  mobileApp: t('in-analyze:analyzeView.dataSources.eumMobileApps'),
  profiles: t('in-analyze:analyzeView.dataSources.profiles'),
  logs: t('in-analyze:analyzeView.dataSources.logs')
});

export const productAreaIcons = Object.freeze({
  application: 'lib_application_invert',
  website: 'lib_website',
  mobileApp: 'lib_mobile_app',
  profiles: 'lib_profiling',
  logs: 'lib_application_logging'
});

const icons = deepFreeze({
  application: {
    traces: 'lib_application_trace',
    calls: 'lib_application_call',
    callsUQB: 'lib_application_call',
    tracesUQB: 'lib_application_trace',
    logs: 'lib_application_logging',
    rawlogs: 'lib_website_page_load'
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
    viewChange: 'lib_mobile_app',
    httpRequest: 'lib_mobile_app_request',
    custom: 'lib_mobile_app_custom_event'
  },
  profiles: {
    profiles: 'lib_profiling'
  }
});

export function getIconByType(type, productArea) {
  return get(icons, [productArea, type]);
}

export function getEntityNameByType(type) {
  if (type === 'pageLoad') {
    return t('in-analyze:analyzeView.dataSources.pageLoads');
  } else if (type === 'pageChange') {
    return t('in-analyze:analyzeView.dataSources.pageTransitions');
  } else if (type === 'resourceLoad') {
    return t('in-analyze:analyzeView.dataSources.resources');
  } else if (type === 'httpRequest') {
    return t('in-analyze:analyzeView.dataSources.httpRequests');
  } else if (type === 'error') {
    return t('in-analyze:analyzeView.dataSources.javaScriptErrors');
  } else if (type === 'custom') {
    return t('in-analyze:analyzeView.dataSources.customEvents');
  } else if (type === 'profiles') {
    return t('in-analyze:analyzeView.dataSources.profiles');
  } else if (type === 'logs' || type === 'rawlogs') {
    return t('in-analyze:analyzeView.dataSources.logs');
  } else if (type === 'sessionStart') {
    return t('in-analyze:analyzeView.dataSources.sessionStarts');
  } else if (type === 'viewChange') {
    return t('in-analyze:analyzeView.dataSources.viewTransitions');
  }

  return type;
}

export function getLabelByType(type) {
  if (type === 'pageLoad') {
    return t('in-analyze:analyzeView.dataSources.pageLoads2');
  } else if (type === 'pageChange') {
    return t('in-analyze:analyzeView.dataSources.pageTransitions2');
  } else if (type === 'resourceLoad') {
    return t('in-analyze:analyzeView.dataSources.resources');
  } else if (type === 'httpRequest') {
    return t('in-analyze:analyzeView.dataSources.httpRequests2');
  } else if (type === 'error') {
    return t('in-analyze:analyzeView.dataSources.jsErrors');
  } else if (type === 'custom') {
    return t('in-analyze:analyzeView.dataSources.customEvents2');
  } else if (type === 'sessionStart') {
    return t('in-analyze:analyzeView.dataSources.sessionStarts');
  } else if (type === 'viewChange') {
    return t('in-analyze:analyzeView.dataSources.viewTransitions2');
  } else if (type === 'profiles') {
    return t('in-analyze:analyzeView.dataSources.profiles');
  } else if (type === 'calls') {
    return t('in-analyze:analyzeView.dataSources.calls');
  } else if (type === 'traces') {
    return t('in-analyze:analyzeView.dataSources.traces');
  } else if (type === 'logs') {
    return t('in-analyze:analyzeView.dataSources.logs');
  } else if (type === 'rawlogs') {
    return t('in-analyze:analyzeView.dataSources.console');
  }

  return type;
}
