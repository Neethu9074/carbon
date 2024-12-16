/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useState, useMemo, useCallback } from 'react';
import { sortBy } from 'lodash';

import { Typography } from '@instana/components';

import {
  alreadyConvertedAnalyticsWithHiddenTagsLocation,
  isAnalyticsWithHiddenTagsLocation
} from 'in-applications/analyze/AnalyzeView2_0/components/AnalyzeHiddenTagsViewParameterConversion/transformHelper';
import AnalyzeHiddenTagsViewParameterConversion from 'in-applications/analyze/AnalyzeView2_0/components/AnalyzeHiddenTagsViewParameterConversion/AnalyzeHiddenTagsViewParameterConversion';
import AnalyzeOneToTwoViewParameterConversion from 'in-applications/analyze/AnalyzeView2_0/components/AnalyzeOneToTwoViewParameterConversion/AnalyzeOneToTwoViewParameterConversion';
import {
  dataSource as dataSourceName,
  dataSourceMatrixParameter,
  hiddenCallsMatrixParameter,
  fastQueryModeEnabledMatrixParameter
} from 'in-applications/navigation/matrix';
import AnalyzeTwoBetaViewParameterConversion from 'in-applications/analyze/AnalyzeView2_0//components/AnalyzeTwoBetaViewParameterConversion/AnalyzeTwoBetaViewParameterConversion';
import { isAnalyticsTwoBetaLocation } from 'in-applications/analyze/AnalyzeView2_0/components/AnalyzeTwoBetaViewParameterConversion/transformHelper';
import { isAnalyticsOneLocation } from 'in-applications/analyze/AnalyzeView2_0/components/AnalyzeOneToTwoViewParameterConversion/transformHelper';
import {
  groupedChartingOptions,
  ungroupedChartingOptions
} from 'in-applications/analyze/components/ChartingPresenter/chartingOptions';
import { getTagCatalog as getTracesTagCatalog } from 'in-applications/analyze/components/workspace/TraceQueryBuilder';
import { NO_VALUE, NO_VALUE_LABEL, UNSPECIFIED, UNSPECIFIED_LABEL } from 'in-analyze/components/GroupedTraces/Group';
import { getTagCatalog as getCallsTagCatalog } from 'in-applications/analyze/components/workspace/CallQueryBuilder';
import FacetedFilterHiddenCalls from 'in-applications/analyze/components/FacetedSearch/FacetedFilterHiddenCalls';
import { createTableTimestampColumnDefinition } from 'in-components/AnalyzeView/commonTableColumnDefinitions';
import { createListTimestampColumnDefinition } from 'in-components/AnalyzeView/commonListColumnDefinitions';
import FacetedFilterMultiSelect from 'in-components/AnalyzeView/FacetedFilters/FacetedFilterMultiSelect';
import FacetedFilterRangeInput from 'in-components/AnalyzeView/FacetedFilters/FacetedFilterRangeInput';
import { custom as customType, metric as metricType } from 'in-components/AnalyzeView/fieldTypes';
import FacetedFilterGeneric from 'in-components/AnalyzeView/FacetedFilters/FacetedFilterGeneric';
import GroupedResults from 'in-applications/analyze/AnalyzeView2_0/components/GroupedResults';
import BatchingIndicator from 'in-analyze/components/BatchingIndicator/BatchingIndicator';
import { toBackendQuery } from 'in-components/AnalyzeView/FacetedFilters/facets';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import Results from 'in-applications/analyze/AnalyzeView2_0/components/Results';
import getTagSuggestions from 'in-applications/subscriptions/getTagSuggestions';
import { DESTINATION } from 'in-components/QueryBuilder/tagFilter/entities';
import { LESS_THAN } from 'in-components/QueryBuilder/tagFilter/operators';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import { getMetricTemplates } from 'in-applications/api/metricTemplates';
import StateManagement from 'in-components/AnalyzeView/StateManagement';
import { useAnalyzeTracker } from 'in-analyze/hooks/useAnalyzeTracker';
import { dataSourceConstants } from 'in-applications/analyze/metrics';
import { getMetricCatalog } from 'in-applications/api/metricCatalog';
import { getTypeTextByCount } from 'in-applications/analyze/metrics';
import { GROUP_COLORS } from 'in-components/AnalyzeView/utils.ts';
import useTagCatalog from 'in-applications/hooks/useTagCatalog';
import { perSecondDetailed } from 'in-stores/metric/formatters';
import { analyzePath } from 'in-applications/navigation/paths';
import { getTagCatalog } from 'in-applications/api/tagCatalog';
import { formatDateTime } from 'in-services/formatters/date';
import { latencyFixed } from 'in-services/formatters/number';
import { getPluginName } from 'in-sdk/pluginName';
import useUrlState from 'in-hooks/useUrlState';
import { t } from 'in-i18n';

const defaultSelectableFields = [
  { type: 'metric', metricId: 'latency', aggregationId: 'MEAN' },
  { type: 'metric', metricId: 'errors', aggregationId: 'MEAN' }
];
const defaultChartedMetrics = {
  calls: [
    {
      templateId: 'calls.overview',
      metrics: [
        {
          metricId: 'calls',
          aggregationId: 'SUM'
        },
        {
          metricId: 'errors',
          aggregationId: 'MEAN'
        },
        {
          metricId: 'latency',
          aggregationId: 'MEAN'
        }
      ]
    }
  ],
  traces: [
    {
      templateId: 'calls.overview',
      metrics: [
        {
          metricId: 'traces',
          aggregationId: 'SUM'
        },
        {
          metricId: 'errors',
          aggregationId: 'MEAN'
        },
        {
          metricId: 'latency',
          aggregationId: 'MEAN'
        }
      ]
    }
  ]
};
const dataSourceParameter = {
  path: analyzePath,
  name: dataSourceName
};

const timestampNames = {
  calls: {
    ungrouped: 'started',
    grouped: 'firstTimestamp'
  },
  traces: {
    ungrouped: 'startTime',
    grouped: 'firstTimestamp'
  }
};

const groupedView = {
  calls: getGroupedView('calls'),
  traces: getGroupedView('traces')
};

const ungroupedView = {
  calls: getUngroupedView('calls'),
  traces: getUngroupedView('traces')
};

const fixedFields = {
  calls: getFixedFields('calls'),
  traces: getFixedFields('traces')
};

const typePerDataSource = {
  calls: 'call',
  traces: 'trace'
};

const callsMetricCatalogTransformer = createMetricCatalogTransformer('calls');
const tracesMetricCatalogTransformer = createMetricCatalogTransformer('traces');

const callsChartableMetricCatalogTransformer = createChartableMetricCatalogTransformer('calls');
const tracesChartableMetricCatalogTransformer = createChartableMetricCatalogTransformer('traces');

export default function ApplicationsAnalyzeView() {
  const [{ dataSource, hiddenCalls, fastQueryModeEnabled }, onChange] = useUrlState({
    bind: [dataSourceMatrixParameter, hiddenCallsMatrixParameter, fastQueryModeEnabledMatrixParameter],
    replaceHistory: false
  });
  const { trackUa2FastQueryModeChanged } = useAnalyzeTracker();
  const location = useLocation();
  const [skipHiddenTagConversion, setSkipHiddenTagConversion] = useState(
    alreadyConvertedAnalyticsWithHiddenTagsLocation(location)
  );

  const onChangeHiddenCalls = useCallback(
    hiddenCalls => {
      onChange({ hiddenCalls });
    },
    [onChange]
  );

  const onChangeFastQueryModeEnabled = fastQueryModeEnabled => {
    trackUa2FastQueryModeChanged({ dataSource, enabled: fastQueryModeEnabled });
    onChange({ fastQueryModeEnabled });
  };
  const dataSourceConfigurations = useMemo(
    () => getDataSourceConfigurations({ hiddenCalls, onChangeHiddenCalls }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [hiddenCalls]
  );

  const tagCatalog = useTagCatalog(dataSource === 'traces' ? getTracesTagCatalog : getCallsTagCatalog);

  if (isAnalyticsOneLocation(location)) {
    return <AnalyzeOneToTwoViewParameterConversion dataSourceConfigurations={dataSourceConfigurations} />;
  }

  if (isAnalyticsTwoBetaLocation(location)) {
    return <AnalyzeTwoBetaViewParameterConversion />;
  }

  // we have to avoid repeating conversion attempts
  if (!skipHiddenTagConversion && isAnalyticsWithHiddenTagsLocation(location, tagCatalog)) {
    return <AnalyzeHiddenTagsViewParameterConversion onConversionCompleted={setSkipHiddenTagConversion} />;
  }
  return (
    <StateManagement
      path={analyzePath}
      defaultDataSource="calls"
      dataSourceParameter={dataSourceParameter}
      getTagCatalog={getTagCatalog}
      getMetricCatalog={getMetricCatalog}
      getMetricTemplates={getMetricTemplates}
      dataSourceConfigurations={dataSourceConfigurations}
      getCustomGroupingTagFilter={getCustomGroupingTagFilter}
    >
      {opts =>
        opts.isGrouped ? (
          <GroupedResults
            {...opts}
            getFacetedSearchSuggestions={params => getFacetedSearchSuggestions({ ...params, hiddenCalls })}
            hiddenCalls={hiddenCalls}
            onChangeHiddenCalls={onChangeHiddenCalls}
            fastQueryModeEnabled={fastQueryModeEnabled}
            onChangeFastQueryModeEnabled={onChangeFastQueryModeEnabled}
            useLastValidStateWhenErroneous
            getCustomGroupingTagFilter={getCustomGroupingTagFilter}
            getColor={opts.chartedMetrics.length && opts.chartedMetrics[0]?.metricId === 'latency' ? getColor : null}
          />
        ) : (
          <Results
            {...opts}
            getFacetedSearchSuggestions={params => getFacetedSearchSuggestions({ ...params, hiddenCalls })}
            hiddenCalls={hiddenCalls}
            onChangeHiddenCalls={onChangeHiddenCalls}
            fastQueryModeEnabled={fastQueryModeEnabled}
            onChangeFastQueryModeEnabled={onChangeFastQueryModeEnabled}
            useLastValidStateWhenErroneous
          />
        )
      }
    </StateManagement>
  );
}

function getCustomGroupingTagFilter(groupBy, groupValue) {
  if (groupBy.groupbyTag === 'call.latency' && groupValue === '0') {
    return tagFilter('call.latency', LESS_THAN, 1);
  }
  return null;
}

export function getDataSourceConfigurations({ hiddenCalls, onChangeHiddenCalls }) {
  return {
    calls: {
      metricCatalogTransformer: callsMetricCatalogTransformer,
      chartableMetricCatalogTransformer: callsChartableMetricCatalogTransformer,
      facetedSearchItems: getFacetedSearchItems({ dataSource: 'calls', hiddenCalls, onChangeHiddenCalls }),
      groupedView: groupedView.calls,
      ungroupedView: ungroupedView.calls,
      fixedFields: fixedFields.calls,
      defaultSelectableFields,
      defaultChartedMetrics: defaultChartedMetrics['calls'],
      supportedCustomMetrics: dataSourceConstants.calls.supportedCustomMetrics,
      // the metric catalog from the backend currently provides only a single formatter per metric type,
      // we have to override the default formatter if aggregation type 'PER_SECOND' is used
      getCustomMetricUiFormatterName: (_metricId, aggregationId) =>
        aggregationId === 'PER_SECOND' ? perSecondDetailed.id : null
    },
    traces: {
      metricCatalogTransformer: tracesMetricCatalogTransformer,
      chartableMetricCatalogTransformer: tracesChartableMetricCatalogTransformer,
      facetedSearchItems: getFacetedSearchItems({ dataSource: 'traces', hiddenCalls, onChangeHiddenCalls }),
      groupedView: groupedView.traces,
      ungroupedView: ungroupedView.traces,
      fixedFields: fixedFields.traces,
      defaultSelectableFields,
      defaultChartedMetrics: defaultChartedMetrics['traces']
    }
  };
}

function getGroupedView(dataSource) {
  return {
    defaultOrderBy: `${dataSource}_SUM`,
    defaultOrderDirection: 'DESC',
    timestampName: timestampNames[dataSource].grouped,
    orderByGroupName: 'group',
    customFieldRenderingInstructions: {
      timestamp: createListTimestampColumnDefinition({
        getTimestamp: ({ item }) => item.timestamp
      })
    },
    chartingOptions: groupedChartingOptions[dataSource],
    getCustomGroupLabel
  };
}

function getCustomGroupLabel(groupName, groupbyTag) {
  if (groupName === UNSPECIFIED) {
    return UNSPECIFIED_LABEL;
  }
  if (groupName === NO_VALUE) {
    return NO_VALUE_LABEL;
  }
  if (groupbyTag === 'call.latency' && groupName === '0') {
    return '< 1';
  }
  if (groupbyTag === 'call.ingestion_time') {
    return `${formatDateTime(new Date(Number(groupName)))} (${groupName})`;
  }
  return groupName;
}

function getUngroupedView(dataSource) {
  return {
    defaultOrderBy: 'timestamp',
    defaultOrderDirection: 'DESC',
    timestampName: timestampNames[dataSource].ungrouped,
    customFieldRenderingInstructions: {
      timestamp: createTableTimestampColumnDefinition({
        getTimestamp: item => {
          const type = typePerDataSource[dataSource];
          const timestampName = timestampNames[dataSource].ungrouped;
          return item[type][timestampName];
        }
      })
    },
    metricFieldExtractors: {
      getColumnId({ metricDefinition }) {
        // 'latency' is the only metric whose raw value (duration) should be displayed in ungrouped view
        return metricDefinition.metricId === 'latency' ? metricDefinition.metricId : null;
      },
      getColumnLabel({ metricDefinition }) {
        // 'latency' is the only metric whose raw value (duration) should be displayed in ungrouped view
        return metricDefinition.metricId === 'latency' ? t('in-applications:labelLatency') : null;
      },
      ColumnContent(item) {
        const type = typePerDataSource[dataSource];
        return (
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <Typography variant="body-regular">{latencyFixed.compact(item[type].duration)}</Typography>
            <BatchingIndicator
              batchCount={item[type].batchCount}
              tooltipContent={t('in-applications:analyze.listBatchLatencyTooltip', {
                batchCount: item[type].batchCount,
                types: getTypeTextByCount(type, item[type].batchCount)
              })}
              noTopPosition
            />
          </div>
        );
      },
      hasRawValue({ metricDefinition }) {
        return metricDefinition.metricId === 'latency';
      }
    },
    chartingOptions: ungroupedChartingOptions
  };
}

function getFixedFields(dataSource) {
  return [
    { type: customType, customFieldId: 'timestamp' },
    { type: metricType, metricId: dataSource, aggregationId: 'SUM' }
  ];
}

function createMetricCatalogTransformer(dataSource) {
  const supportedMetrics = dataSourceConstants[dataSource].metricCatalogSupportedMetrics;
  return metricDefinition => {
    if (!supportedMetrics[metricDefinition.metricId]) {
      return null;
    }
    return {
      ...metricDefinition,
      aggregations: supportedMetrics[metricDefinition.metricId],
      label:
        dataSource === 'traces'
          ? t('in-applications:metrics.traces', { context: metricDefinition.metricId })
          : t('in-applications:metrics.calls', { context: metricDefinition.metricId })
    };
  };
}

function createChartableMetricCatalogTransformer(dataSource) {
  // For chartable metrics (unifiedMetricsQuery) the 'traces' dataSource uses 'calls' metric instead of 'traces'
  const supportedMetrics = dataSourceConstants.calls.metricCatalogSupportedChartableMetrics;
  return metricDefinition => {
    if (!supportedMetrics[metricDefinition.metricId] || (dataSource === 'traces' && metricDefinition.customMetric)) {
      return null;
    }
    return {
      ...metricDefinition,
      label:
        dataSource === 'traces'
          ? t('in-applications:metrics.traces', { context: metricDefinition.metricId })
          : t('in-applications:metrics.calls', { context: metricDefinition.metricId.replace('.', '_') }),
      aggregations: supportedMetrics[metricDefinition.metricId],
      formatter: metricFormatter(metricDefinition)
    };
  };
}

function metricFormatter({ metricId, formatter }) {
  if (metricId === 'latency') {
    return 'LATENCY';
  }
  return formatter;
}

function orderByValue(suggestions) {
  const hasValueData = Boolean(suggestions?.length > 0 && suggestions[0]?.value);
  return hasValueData ? sortBy(suggestions, 'value') : suggestions;
}

function getItems({ results }) {
  return results;
}

function getSuggestionName({ label }) {
  return label;
}

function getMetric({ metrics }) {
  return metrics?.facetedSearchMetric?.[0]?.[1];
}

function getFacetedSearchItems({ dataSource, hiddenCalls, onChangeHiddenCalls }) {
  const isCallsDataSource = dataSource !== 'traces';
  const renderer = isCallsDataSource ? FacetedFilterMultiSelect : FacetedFilterGeneric;

  return [
    {
      renderer: FacetedFilterRangeInput,
      title: isCallsDataSource ? t('in-applications:analyze.latency') : t('in-applications:analyze.traceLatency'),
      tag: isCallsDataSource ? 'call.latency' : 'trace.latency',
      openByDefault: true
    },
    {
      renderer,
      title: t('in-applications:analyze.erroneous'),
      tag: 'call.erroneous',
      enableUseAsGroup: isCallsDataSource,
      getItems: ({ results }) => results.filter(result => result.label === 'true'),
      customLabelMapper: () => t('in-applications:analyze.facetedSearch.showOnlyErroneous'),
      getSuggestionName,
      getMetric,
      openByDefault: true,
      fallbackValues: [{ name: t('in-applications:analyze.facetedSearch.showOnlyErroneous'), value: true }]
    },
    {
      renderer,
      title: t('in-applications:analyze.httpStatusCode'),
      tag: 'call.http.statusClass',
      enableUseAsGroup: isCallsDataSource,
      getItems,
      getSuggestionName,
      getMetric,
      orderSuggestions: orderByValue,
      fallbackValues: [
        { name: '1xx', value: '1xx' },
        { name: '2xx', value: '2xx' },
        { name: '3xx', value: '3xx' },
        { name: '4xx', value: '4xx' },
        { name: '5xx', value: '5xx' }
      ]
    },
    {
      renderer,
      title: t('in-applications:analyze.applications'),
      tag: 'application.name',
      entity: DESTINATION,
      enableUseAsGroup: isCallsDataSource,
      getItems,
      getSuggestionName,
      getMetric
    },
    {
      renderer,
      title: t('in-applications:analyze.services'),
      tag: 'service.name',
      entity: DESTINATION,
      enableUseAsGroup: isCallsDataSource,
      getItems,
      getSuggestionName,
      getMetric
    },
    {
      renderer,
      title: t('in-applications:analyze.endpoints'),
      tag: 'endpoint.name',
      entity: DESTINATION,
      enableUseAsGroup: isCallsDataSource,
      getItems,
      getSuggestionName,
      getMetric
    },
    {
      renderer,
      title: t('in-applications:analyze.types'),
      tag: 'call.type',
      enableUseAsGroup: isCallsDataSource,
      getItems,
      getSuggestionName,
      getMetric
    },
    {
      renderer,
      title: t('in-applications:analyze.technologies'),
      tag: 'technology',
      entity: DESTINATION,
      enableUseAsGroup: isCallsDataSource,
      customLabelMapper: label => getPluginName(label),
      getItems,
      getSuggestionName,
      getMetric
    },
    {
      renderer: FacetedFilterHiddenCalls,
      title: t('in-applications:analyze.hiddenCalls'),
      key: 'hiddenCalls',
      openByDefault: true,
      extraProps: {
        includeSynthetic: hiddenCalls?.includeSynthetic,
        includeInternal: hiddenCalls?.includeInternal,
        setIncludeSynthetic: includeSynthetic =>
          onChangeHiddenCalls({
            includeInternal: hiddenCalls?.includeInternal,
            includeSynthetic: includeSynthetic
          }),
        setIncludeInternal: includeInternal =>
          onChangeHiddenCalls({
            includeInternal: includeInternal,
            includeSynthetic: hiddenCalls?.includeSynthetic
          })
      }
    }
  ];
}

function getFacetedSearchSuggestions({
  timeConfig,
  facets,
  tag,
  facetedSearchItems,
  formModel,
  group,
  metricKey,
  hiddenCalls
}) {
  const { includeSynthetic = false, includeInternal = false } = hiddenCalls;
  const backendQuery = toBackendQuery({
    formModel,
    facets,
    facetedSearchConfiguration: facetedSearchItems,
    tagToExclude: tag
  });
  return getTagSuggestions({
    tagFilterExpression: backendQuery,
    tagName: group.groupbyTag,
    filter: {
      timeConfig: timeConfig
    },
    filterOnTagName: true,
    includeInternal,
    includeSynthetic,
    metrics: {
      [metricKey]: {
        metric: 'calls',
        aggregation: 'SUM'
      }
    },
    removeRequestedTagFromFilters: false
  });
}

function getColor(_, index) {
  if (GROUP_COLORS[index]) {
    return GROUP_COLORS[index];
  } else {
    return '#716A6A';
  }
}
