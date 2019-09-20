import { getAnalyzeFilterTagKeys, getCallGroupTagKeys, getTraceGroupTagKeys } from 'in-applications/tags';

let configs;
export default function getByDataSource(dataSource) {
  if (!configs) {
    configs = {
      traces: {
        groupTagKeys: getTraceGroupTagKeys(),
        filterTagKeys: getAnalyzeFilterTagKeys(),
        errorneousTagPreset: 'trace.erroneous',
        latencyTagPreset: 'trace.latency',
        isSyntheticTagPreset: 'call.is_synthetic',
        countMetricText: 'Traces',
        countMetricKey: 'traces',
        defaultGrouping: { name: 'trace.endpoint.name', value: '' },
        defaultFilters: [{ name: 'call.is_synthetic', value: 'false' }],
        breadcrumbLabel: 'Analyze Traces',
        getMatcher: traceId => item => item.trace.id === traceId,
        typeLabel: 'Trace',
        getTraceIdByItem: item => item.trace.id,
        getCallIdByItem: () => undefined
      },
      calls: {
        groupTagKeys: getCallGroupTagKeys(),
        filterTagKeys: getAnalyzeFilterTagKeys(),
        errorneousTagPreset: 'call.erroneous',
        latencyTagPreset: 'call.latency',
        isSyntheticTagPreset: 'call.is_synthetic',
        countMetricText: 'Calls',
        countMetricKey: 'calls',
        defaultGrouping: { name: 'endpoint.name', value: '' },
        defaultFilters: [{ name: 'call.is_synthetic', value: 'false' }],
        breadcrumbLabel: 'Analyze Calls',
        getMatcher: (traceId, callId) => item => item.call.id === callId && item.call.traceId === traceId,
        typeLabel: 'Call',
        getTraceIdByItem: item => item.call.traceId,
        getCallIdByItem: item => item.call.id
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
  }

  return type;
}
