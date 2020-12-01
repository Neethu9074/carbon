import { get } from 'lodash';

import { getAnalyzeFilterTagKeys, getCallGroupTagKeys, getTraceGroupTagKeys } from 'in-applications/tags';
import { dataSourceTitles as mobileAppDataSourceTitles } from 'in-mobile-apps/tags';
import { dataSourceTitles as websiteDataSourceTitles } from 'in-websites/tags';
import { entityTypes } from 'in-analyze/applicationFilter';
import { deepFreeze } from 'in-services/util/object';

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
        countMetricText: 'Traces',
        countMetricKey: 'traces',
        defaultGrouping: { name: 'trace.endpoint.name', value: '', entity: entityTypes.NOT_APPLICABLE },
        defaultFilters: [],
        breadcrumbLabel: 'Trace Analytics',
        getMatcher: traceId => item => item.trace.id === traceId,
        typeLabel: 'Trace',
        getTraceIdByItem: item => item.trace.id,
        getCallIdByItem: () => undefined
      },
      calls: {
        filterTagKeys,
        groupTagKeys: getCallGroupTagKeys(),
        errorneousTagPreset: 'call.erroneous',
        latencyTagPreset: 'call.latency',
        isSyntheticTagPreset: 'call.is_synthetic',
        countMetricText: 'Calls',
        countMetricKey: 'calls',
        defaultGrouping: groupByEndpointName,
        defaultFilters: [],
        breadcrumbLabel: 'Call Analytics',
        getMatcher: (traceId, callId) => item => item.call.id === callId && item.call.traceId === traceId,
        typeLabel: 'Call',
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
  application: 'Applications',
  website: 'Websites',
  mobileApp: 'Mobile Apps',
  profiles: 'Profiles',
  logs: 'Logs'
});

export const productAreaTrackingNames = Object.freeze({
  application: 'Applications',
  website: 'EUM: Websites',
  mobileApp: 'EUM: Mobile Apps',
  profiles: 'Profiles',
  logs: 'Logs'
});

export const productAreaIcons = Object.freeze({
  application: 'lib_application_invert',
  website: 'lib_website',
  mobileApp: 'lib_mobile_app',
  profiles: 'lib_profiling',
  logs: 'lib_navigation_stan'
});

const icons = deepFreeze({
  application: {
    traces: 'lib_application_trace',
    calls: 'lib_application_call',
    callsUQB: 'lib_application_call',
    tracesUQB: 'lib_application_trace'
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
  },
  logs: {
    logs: 'lib_application_logging'
  }
});

export function getIconByType(type, productArea) {
  return get(icons, [productArea, type]);
}

export function getEntityNameByType(type) {
  if (type === 'pageLoad') {
    return 'Page loads';
  } else if (type === 'pageChange') {
    return 'Page transitions';
  } else if (type === 'resourceLoad') {
    return 'Resources';
  } else if (type === 'httpRequest') {
    return 'HTTP requests';
  } else if (type === 'error') {
    return 'JavaScript errors';
  } else if (type === 'custom') {
    return 'Custom events';
  } else if (type === 'profiles') {
    return 'Profiles';
  } else if (type === 'logs') {
    return 'Logs';
  } else if (type === 'sessionStart') {
    return 'Session Start';
  } else if (type === 'viewChange') {
    return 'View transitions';
  }

  return type;
}

export function getLabelByType(type) {
  if (type === 'pageLoad') {
    return `${websiteDataSourceTitles.pageLoad}s`;
  } else if (type === 'pageChange') {
    return `${websiteDataSourceTitles.pageChange}s`;
  } else if (type === 'resourceLoad') {
    return `${websiteDataSourceTitles.resourceLoad}s`;
  } else if (type === 'httpRequest') {
    return `${websiteDataSourceTitles.httpRequest}s`;
  } else if (type === 'error') {
    return `${websiteDataSourceTitles.error}s`;
  } else if (type === 'custom') {
    return `${websiteDataSourceTitles.custom}s`;
  } else if (type === 'sessionStart') {
    return `${mobileAppDataSourceTitles.sessionStart}s`;
  } else if (type === 'viewChange') {
    return `${mobileAppDataSourceTitles.viewChange}s`;
  } else if (type === 'profiles') {
    return 'Profiles';
  } else if (type === 'calls') {
    return 'Calls';
  } else if (type === 'traces') {
    return 'Traces';
  } else if (type === 'logs') {
    return 'Logs';
  }

  return type;
}
