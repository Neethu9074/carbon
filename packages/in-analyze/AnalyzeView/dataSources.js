import { getAnalyzeFilterTagKeys, getCallGroupTagKeys, getTraceGroupTagKeys } from 'in-applications/tags';
import { dataSourceTitles as websiteDataSourceTitles } from 'in-websites/tags';
import { entityTypes } from 'in-analyze/applicationFilter';

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
        defaultGrouping: { name: 'endpoint.name', value: '', entity: entityTypes.DESTINATION },
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

export function getIconByType(type) {
  if (type === 'traces') {
    return 'lib_application_trace';
  } else if (type === 'calls') {
    return 'lib_application_call';
  } else if (type === 'pageLoad') {
    return 'lib_website_page_load';
  } else if (type === 'resourceLoad') {
    return 'lib_website_resource';
  } else if (type === 'httpRequest') {
    return 'lib_website_ajax';
  } else if (type === 'error') {
    return 'lib_website_error';
  } else if (type === 'custom') {
    return 'lib_website_custom';
  } else if (type === 'profiles') {
    return 'lib_profiling';
  }
}

export function getEntityNameByType(type) {
  if (type === 'pageLoad') {
    return 'page loads';
  } else if (type === 'resourceLoad') {
    return 'resources';
  } else if (type === 'httpRequest') {
    return 'HTTP requests';
  } else if (type === 'error') {
    return 'JavaScript errors';
  } else if (type === 'custom') {
    return 'custom events';
  } else if (type === 'profiles') {
    return 'profiles';
  }

  return type;
}

export function getLabelByType(type) {
  if (type === 'pageLoad') {
    return `${websiteDataSourceTitles.pageLoad}s`;
  } else if (type === 'resourceLoad') {
    return `${websiteDataSourceTitles.resourceLoad}s`;
  } else if (type === 'httpRequest') {
    return `${websiteDataSourceTitles.httpRequest}s`;
  } else if (type === 'error') {
    return `${websiteDataSourceTitles.error}s`;
  } else if (type === 'custom') {
    return `${websiteDataSourceTitles.custom}s`;
  } else if (type === 'profiles') {
    return 'Profiles';
  } else if (type === 'traces') {
    return 'Traces';
  } else if (type === 'calls') {
    return 'Calls';
  }

  return type;
}
