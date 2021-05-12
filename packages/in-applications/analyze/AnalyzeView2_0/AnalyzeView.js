/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { useLocation } from 'react-router';
import React from 'react';

import AnalyzeOneToTwoViewParameterConversion from 'in-applications/analyze/AnalyzeView2_0/components/AnalyzeOneToTwoViewParameterConversion/AnalyzeOneToTwoViewParameterConversion';
import AnalyzeTwoBetaViewParameterConversion from 'in-applications/analyze/AnalyzeView2_0//components/AnalyzeTwoBetaViewParameterConversion/AnalyzeTwoBetaViewParameterConversion';
import { isAnalyticsTwoBetaLocation } from 'in-applications/analyze/AnalyzeView2_0/components/AnalyzeTwoBetaViewParameterConversion/transformHelper';
import { isAnalyticsOneLocation } from 'in-applications/analyze/AnalyzeView2_0/components/AnalyzeOneToTwoViewParameterConversion/transformHelper';
import {
  ungroupedChartingOptions,
  groupedChartingOptions
} from 'in-applications/analyze/components/ChartingPresenter/chartingOptions';
import { NO_VALUE, NO_VALUE_LABEL, UNSPECIFIED, UNSPECIFIED_LABEL } from 'in-analyze/components/GroupedTraces/Group';
import { createTableTimestampColumnDefinition } from 'in-new-components/AnalyzeView/commonTableColumnDefinitions';
import FacetedFilterHiddenCalls from 'in-applications/analyze/components/FacetedSearch/FacetedFilterHiddenCalls';
import { createListTimestampColumnDefinition } from 'in-new-components/AnalyzeView/commonListColumnDefinitions';
import { hiddenCallsMatrixParameter, previewEnabledMatrixParameter } from 'in-applications/navigation/matrix';
import FacetedFilterRangeInput from 'in-new-components/AnalyzeView/FacetedFilters/FacetedFilterRangeInput';
import FacetedFilterRangeList from 'in-new-components/AnalyzeView/FacetedFilters/FacetedFilterRangeList';
import { custom as customType, metric as metricType } from 'in-new-components/AnalyzeView/fieldTypes';
import FacetedFilterGeneric from 'in-new-components/AnalyzeView/FacetedFilters/FacetedFilterGeneric';
import GroupedResults from 'in-applications/analyze/AnalyzeView2_0/components/GroupedResults';
import BatchingIndicator from 'in-analyze/components/BatchingIndicator/BatchingIndicator';
import { dataSource as dataSourceName } from 'in-applications/navigation/matrix';
import Results from 'in-applications/analyze/AnalyzeView2_0/components/Results';
import { DESTINATION } from 'in-new-components/QueryBuilder/tagFilter/entities';
import getTagSuggestions from 'in-subscription/application/getTagSuggestions';
import StateManagement from 'in-new-components/AnalyzeView/StateManagement';
import { getMetricCatalog } from 'in-applications/api/metricCatalog';
import { getTypeTextByCount } from 'in-applications/analyze/metrics';
import { analyzePath } from 'in-applications/navigation/paths';
import { getTagCatalog } from 'in-applications/api/tagCatalog';
import { latencyFixed } from 'in-services/formatters/number';
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
  const [{ hiddenCalls, previewEnabled }, onChange] = useUrlState({
    bind: [hiddenCallsMatrixParameter, previewEnabledMatrixParameter],
    replaceHistory: false
  });

  const onChangeHiddenCalls = hiddenCalls => {
    onChange({ hiddenCalls });
  };

  const onChangePreviewEnabled = previewEnabled => {
    onChange({ previewEnabled });
  };

  const dataSourceConfigurations = getDataSourceConfigurations({ hiddenCalls, onChangeHiddenCalls });

  const location = useLocation();
  if (isAnalyticsOneLocation(location)) {
    return <AnalyzeOneToTwoViewParameterConversion dataSourceConfigurations={dataSourceConfigurations} />;
  }

  if (isAnalyticsTwoBetaLocation(location)) {
    return <AnalyzeTwoBetaViewParameterConversion />;
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

function getFacetedSearchItems({ dataSource, hiddenCalls, onChangeHiddenCalls }) {
  const enableUseAsGroup = dataSource !== 'traces';
  return [
    {
      renderer: FacetedFilterRangeInput,
      title: t('in-applications:analyze.latency'),
      tag: 'call.latency',
      openByDefault: true
    },
    {
      renderer: FacetedFilterGeneric,
      title: t('in-applications:analyze.erroneous'),
      tag: 'call.erroneous',
      enableUseAsGroup,
      getItems: ({ results }) => results,
      getSuggestionName: ({ label }) => label,
      openByDefault: true
    },
    {
      renderer: FacetedFilterRangeList,
      title: t('in-applications:analyze.httpStatusCode'),
      tag: 'call.http.status',
      ranges: [
        { start: 100, end: 199, label: '1xx' },
        { start: 200, end: 299, label: '2xx' },
        { start: 300, end: 399, label: '3xx' },
        { start: 400, end: 499, label: '4xx' },
        { start: 500, end: 599, label: '5xx' }
      ]
    },
    {
      renderer: FacetedFilterGeneric,
      title: t('in-applications:analyze.applications'),
      tag: 'application.name',
      entity: DESTINATION,
      enableUseAsGroup,
      getItems: ({ results }) => results,
      getSuggestionName: ({ label }) => label
    },
    {
      renderer: FacetedFilterGeneric,
      title: t('in-applications:analyze.services'),
      tag: 'service.name',
      entity: DESTINATION,
      enableUseAsGroup,
      getItems: ({ results }) => results,
      getSuggestionName: ({ label }) => label
    },
    {
      renderer: FacetedFilterGeneric,
      title: t('in-applications:analyze.endpoints'),
      tag: 'endpoint.name',
      entity: DESTINATION,
      enableUseAsGroup,
      getItems: ({ results }) => results,
      getSuggestionName: ({ label }) => label
    },
    {
      renderer: FacetedFilterGeneric,
      title: t('in-applications:analyze.types'),
      tag: 'call.type',
      enableUseAsGroup,
      getItems: ({ results }) => results,
      getSuggestionName: ({ label }) => label
    },
    {
      renderer: FacetedFilterGeneric,
      title: t('in-applications:analyze.technologies'),
      tag: 'technology',
      entity: DESTINATION,
      enableUseAsGroup,
      customLabelMapper: label => getPluginName(label),
      getItems: ({ results }) => results,
      getSuggestionName: ({ label }) => label
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
  backendQueryModel,
  backendQueryModelExcludingMissingGroupingTag,
  group,
  metricKey,
  hiddenCalls
}) {
  const { includeSynthetic = false, includeInternal = false } = hiddenCalls;
  return getTagSuggestions({
    tagFilterExpression: backendQueryModelExcludingMissingGroupingTag ?? backendQueryModel,
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
    }
  });
}
