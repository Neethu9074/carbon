import GroupedTraces from 'in-analyze/components/GroupedTraces';
import { blacklists, getTagTree } from 'in-applications/tags';
import GroupedCalls from 'in-analyze/components/GroupedCalls';
import RawTraces from 'in-analyze/components/RawTraces';
import RawCalls from 'in-analyze/components/RawCalls';

let configs;
export default function getByDataSource(dataSource) {
  if (!configs) {
    configs = {
      traces: {
        groupTags: [{ name: 'trace.endpoint.name' }, { name: 'trace.service.name' }],
        errorneousTagPreset: 'trace.erroneous',
        latencyTagPreset: 'trace.latency',
        countMetricText: 'Traces',
        countMetricKey: 'traces',
        defaultGrouping: { name: 'trace.endpoint.name', value: '' },
        analyzeFilterBlacklist: blacklists.analyzeFilterBlacklist,
        breadcrumbLabel: 'Analyze Traces',
        getMatcher: traceId => item => item.trace.id === traceId,
        typeLabel: 'Trace',
        getTraceIdByItem: item => item.trace.id,
        getCallIdByItem: () => undefined,
        RawView: RawTraces,
        GroupedView: GroupedTraces
      },
      calls: {
        groupTags: getTagTree().getChildren({ blacklist: blacklists.callGroupBlacklist }),
        errorneousTagPreset: 'call.erroneous',
        latencyTagPreset: 'call.latency',
        countMetricText: 'Calls',
        countMetricKey: 'calls',
        defaultGrouping: { name: 'endpoint.name', value: '' },
        analyzeFilterBlacklist: blacklists.analyzeFilterBlacklist,
        breadcrumbLabel: 'Analyze Calls',
        getMatcher: (traceId, callId) => item => item.call.id === callId && item.call.traceId === traceId,
        typeLabel: 'Call',
        getTraceIdByItem: item => item.call.traceId,
        getCallIdByItem: item => item.call.id,
        RawView: RawCalls,
        GroupedView: GroupedCalls
      }
    };
  }
  return configs[dataSource] || {};
}
