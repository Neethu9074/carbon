/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { useLocation } from 'react-router';
import React, { useState } from 'react';
import { sortBy } from 'lodash';

import AnalyzeHiddenTagsViewParameterConversion from 'in-applications/analyze/AnalyzeView2_0/components/AnalyzeHiddenTagsViewParameterConversion/AnalyzeHiddenTagsViewParameterConversion';
import AnalyzeOneToTwoViewParameterConversion from 'in-applications/analyze/AnalyzeView2_0/components/AnalyzeOneToTwoViewParameterConversion/AnalyzeOneToTwoViewParameterConversion';
import AnalyzeTwoBetaViewParameterConversion from 'in-applications/analyze/AnalyzeView2_0//components/AnalyzeTwoBetaViewParameterConversion/AnalyzeTwoBetaViewParameterConversion';
import {
  dataSource as dataSourceName,
  dataSourceMatrixParameter,
  hiddenCallsMatrixParameter,
  previewEnabledMatrixParameter
} from 'in-applications/navigation/matrix';
import { isAnalyticsWithHiddenTagsLocation } from 'in-applications/analyze/AnalyzeView2_0/components/AnalyzeHiddenTagsViewParameterConversion/transformHelper';
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
import Results from 'in-applications/analyze/AnalyzeView2_0/components/Results';
import getTagSuggestions from 'in-subscription/application/getTagSuggestions';
import { DESTINATION } from 'in-components/QueryBuilder/tagFilter/entities';
import StateManagement from 'in-components/AnalyzeView/StateManagement';
import { getMetricCatalog } from 'in-applications/api/metricCatalog';
import { getTypeTextByCount } from 'in-applications/analyze/metrics';
import useTagCatalog from 'in-applications/hooks/useTagCatalog';
import { analyzePath } from 'in-applications/navigation/paths';
import { getTagCatalog } from 'in-applications/api/tagCatalog';
import { latencyFixed } from 'in-services/formatters/number';
import { emptyArray } from 'in-services/fixedObjects';
import { getPluginName } from 'in-sdk/pluginName';
import useUrlState from 'in-hooks/useUrlState';
import { t } from 'in-i18n';

const defaultSelectableFields = [
  { type: 'metric', metricId: 'latency', aggregationId: 'MEAN' },
  { type: 'metric', metricId: 'errors', aggregationId: 'MEAN' }
];

const defaultChartedMetrics = [{ metricId: 'latency', aggregationId: 'DISTRIBUTION' }];

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
  const [{ dataSource, hiddenCalls, previewEnabled }, onChange] = useUrlState({
    bind: [dataSourceMatrixParameter, hiddenCallsMatrixParameter, previewEnabledMatrixParameter],
    replaceHistory: false
  });

  const [lastHiddenTagConversionResult, setLastHiddenTagConversionResult] = useState({
    unresolvedServiceIds: emptyArray,
    unresolvedEndpointIds: emptyArray
  });

  const onChangeHiddenCalls = hiddenCalls => {
    onChange({ hiddenCalls });
  };

  const onChangePreviewEnabled = previewEnabled => {
    onChange({ previewEnabled });
  };

  const dataSourceConfigurations = getDataSourceConfigurations({ hiddenCalls, onChangeHiddenCalls });

  const tagCatalog = useTagCatalog(dataSource === 'traces' ? getTracesTagCatalog : getCallsTagCatalog);

  const location = useLocation();
  if (isAnalyticsOneLocation(location)) {
    return <AnalyzeOneToTwoViewParameterConversion dataSourceConfigurations={dataSourceConfigurations} />;
  }

  if (isAnalyticsTwoBetaLocation(location)) {
    return <AnalyzeTwoBetaViewParameterConversion />;
  }

  // we have to avoid repeating failing conversion attempts
  if (
    isAnalyticsWithHiddenTagsLocation(
      location,
      tagCatalog,
      lastHiddenTagConversionResult.unresolvedServiceIds,
      lastHiddenTagConversionResult.unresolvedEndpointIds
    )
  ) {
    const isLoading = tagCatalog == null;
    return (
      <AnalyzeHiddenTagsViewParameterConversion
        isLoading={isLoading}
        onConversionCompleted={setLastHiddenTagConversionResult}
      />
    );
  }

  return (
    <StateManagement
      path={analyzePath}
      defaultDataSource="calls"
      dataSourceParameter={dataSourceParameter}
      getTagCatalog={getTagCatalog}
      getMetricCatalog={getMetricCatalog}
      dataSourceConfigurations={dataSourceConfigurations}
    >
      {opts =>
        opts.isGrouped ? (
          <GroupedResults
            {...opts}
            getFacetedSearchSuggestions={params => getFacetedSearchSuggestions({ ...params, hiddenCalls })}
            hiddenCalls={hiddenCalls}
            onChangeHiddenCalls={onChangeHiddenCalls}
            previewEnabled={previewEnabled}
            onChangePreviewEnabled={onChangePreviewEnabled}
            useLastValidStateWhenErroneous
          />
        ) : (
          <Results
            {...opts}
            getFacetedSearchSuggestions={params => getFacetedSearchSuggestions({ ...params, hiddenCalls })}
            hiddenCalls={hiddenCalls}
            onChangeHiddenCalls={onChangeHiddenCalls}
            previewEnabled={previewEnabled}
            onChangePreviewEnabled={onChangePreviewEnabled}
            useLastValidStateWhenErroneous
          />
        )
      }
    </StateManagement>
  );
}

function getDataSourceConfigurations({ hiddenCalls, onChangeHiddenCalls }) {
  return {
    calls: {
      metricCatalogTransformer: callsMetricCatalogTransformer,
      chartableMetricCatalogTransformer: callsChartableMetricCatalogTransformer,
      facetedSearchItems: getFacetedSearchItems({ dataSource: 'calls', hiddenCalls, onChangeHiddenCalls }),
      groupedView: groupedView.calls,
      ungroupedView: ungroupedView.calls,
      fixedFields: fixedFields.calls,
      defaultSelectableFields,
      defaultChartedMetrics
    },
    traces: {
      metricCatalogTransformer: tracesMetricCatalogTransformer,
      chartableMetricCatalogTransformer: tracesChartableMetricCatalogTransformer,
      facetedSearchItems: getFacetedSearchItems({ dataSource: 'traces', hiddenCalls, onChangeHiddenCalls }),
      groupedView: groupedView.traces,
      ungroupedView: ungroupedView.traces,
      fixedFields: fixedFields.traces,
      defaultSelectableFields,
      defaultChartedMetrics
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

function getCustomGroupLabel(groupName) {
  if (groupName === UNSPECIFIED) {
    return UNSPECIFIED_LABEL;
  }
  if (groupName === NO_VALUE) {
    return NO_VALUE_LABEL;
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
          <>
            {latencyFixed.compact(item[type].duration)}
            <BatchingIndicator
              batchCount={item[type].batchCount}
              tooltipContent={t('in-applications:analyze.listBatchLatencyTooltip', {
                batchCount: item[type].batchCount,
                types: getTypeTextByCount(type, item[type].batchCount)
              })}
              noTopPosition
            />
          </>
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
  const supportedMetrics = {
    calls: ['calls', 'latency', 'erroneousCalls', 'errors'],
    traces: ['traces', 'latency', 'erroneousCalls', 'errors']
  };
  return metricDefinition => {
    if (!supportedMetrics[dataSource].includes(metricDefinition.metricId)) {
      return null;
    }
    return {
      ...metricDefinition,
      label:
        dataSource === 'traces'
          ? t('in-applications:metrics.traces', { context: metricDefinition.metricId })
          : t('in-applications:metrics.calls', { context: metricDefinition.metricId })
    };
  };
}

function createChartableMetricCatalogTransformer(dataSource) {
  // For chartable metrics (unifiedMetricsQuery) the 'traces' dataSource uses 'calls' metric instead of 'traces'
  const supportedMetrics = ['calls', 'latency', 'erroneousCalls', 'errors'];
  return metricDefinition => {
    if (!supportedMetrics.includes(metricDefinition.metricId)) {
      return null;
    }
    return {
      ...metricDefinition,
      label:
        dataSource === 'traces'
          ? t('in-applications:metrics.traces', { context: metricDefinition.metricId })
          : t('in-applications:metrics.calls', { context: metricDefinition.metricId }),
      aggregations:
        metricDefinition.metricId === 'latency'
          ? [...metricDefinition.aggregations, 'DISTRIBUTION']
          : metricDefinition.aggregations,
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
  return metrics?.facetedSearchMetric[0][1];
}

function getFacetedSearchItems({ dataSource, hiddenCalls, onChangeHiddenCalls }) {
  const isCallsDataSource = dataSource !== 'traces';
  const renderer = isCallsDataSource ? FacetedFilterMultiSelect : FacetedFilterGeneric;

  return [
    {
      renderer: FacetedFilterRangeInput,
      title: isCallsDataSource ? t('in-applications:analyze.latency') : t('in-applications:analyze.traceLatency'),
      tag: isCallsDataSource ? 'call.latency' : 'trace.latency',
      openByDefault: true,
      stickyHeader: false
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
      stickyHeader: false
    },
    {
      renderer,
      title: t('in-applications:analyze.httpStatusCode'),
      tag: 'call.http.statusClass',
      enableUseAsGroup: isCallsDataSource,
      getItems,
      getSuggestionName,
      getMetric,
      orderSuggestions: orderByValue
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
