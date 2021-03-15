/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useEffect, useState } from 'react';
import { useRouteMatch } from 'react-router';
import { range } from 'lodash';

import {
  tagFilterExpressionMatrixParameter,
  groupByMatrixParameter,
  orderByGroupsMatrixParameter,
  orderByMatrixParameter,
  metricsMatrixParameter,
  hiddenCallsMatrixParameter,
  chartsMatrixParameter,
  dataSourceMatrixParameter,
  previewEnabledMatrixParameter
} from 'in-applications/navigation/matrix';
import {
  ua2QueryBuilderFilterAddedTracker,
  ua2GroupChangedTracker,
  ua2ChartChangedTracker,
  ua2OrderByChangedTracker,
  ua2OrderByGroupChangedTracker,
  ua2ApiQueryPressedTracker,
  ua2NestingDepthTracker
} from 'in-applications/tracker';
import {
  EMPTY_EXPRESSION,
  toBackendQueryModel,
  getMaximumExpressionDepth
} from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import TraceGroupingConfigurator, {
  isTraceGroupingConfigurationValid
} from 'in-applications/analyze/components/workspace/TraceGroupingConfigurator';
import CallGroupingConfigurator, {
  isCallGroupingConfigurationValid
} from 'in-applications/analyze/components/workspace/CallGroupingConfigurator';
import {
  ungroupedChartingOptions,
  groupedChartingOptions
} from 'in-applications/analyze/components/ChartingPresenter/chartingOptions';
import TraceQueryBuilder, { isTraceQueryValid } from 'in-applications/analyze/components/workspace/TraceQueryBuilder';
import CallQueryBuilder, { isCallQueryValid } from 'in-applications/analyze/components/workspace/CallQueryBuilder';
import { joinExpressions, removeTopLevelFilters } from 'in-new-components/QueryBuilder/transformation/formModel';
import GroupingConfiguratorSection from 'in-new-components/GroupingConfigurator/GroupingConfiguratorSection';
import ChartingConfiguratorSection from 'in-new-components/ChartingConfigurator/ChartingConfiguratorSection';
import ChartingPresenter from 'in-applications/analyze/components/ChartingPresenter/ChartingPresenter';
import FixatedTimeConfigContextModification from 'in-stores/time/FixatedTimeConfigContextModification';
import ApiQueryAction from 'in-new-components/QueryBuilder/workspace/ApiQueryAction/ApiQueryAction';
import QueryBuilderSection from 'in-new-components/QueryBuilder/workspace/QueryBuilderSection';
import { ActionSection } from 'in-new-components/workspace/ActionSection/ActionSection';
import { analyze, traceDetailFullyQualified } from 'in-analyze/navigation/paths';
import TraceDetails from 'in-applications/analyze/components/TraceDetails';
import GroupedList from 'in-applications/analyze/components/GroupedList';
import { dataSourceConstants } from 'in-applications/analyze/metrics';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import { aggregateMetricKey } from 'in-applications/analyze/metrics';
import AnalyzeHeader from 'in-analyze/components/AnalyzeHeader';
import Sections from 'in-new-components/workspace/Sections';
import List from 'in-applications/analyze/components/List';
import { pendingResult } from 'in-services/fixedObjects';
import { error } from 'in-new-components/Message/types';
import { emptyArray } from 'in-services/fixedObjects';
import { isNotBlank } from 'in-services/util/string';
import useTimeConfig from 'in-hooks/useTimeConfig';
import useObservable from 'in-hooks/useObservable';
import Stack from 'in-new-components/layout/Stack';
import Message from 'in-new-components/Message';
import useUrlState from 'in-hooks/useUrlState';
import Footer from 'in-new-components/Footer';
import Sticky from 'in-components/Sticky';
import theme from 'in-themes';
import { t } from 'in-i18n';

export default function ApplicationAnalyzeView() {
  return (
    <FixatedTimeConfigContextModification>
      {({ refresh }) => <ApplicationAnalyzeViewWithFixatedTimeConfig refreshFixatedTimeConfig={refresh} />}
    </FixatedTimeConfigContextModification>
  );
}
const maxGroupsOnChart = Math.min(5, theme.lib.colors.chart.strokeColors100.length);
const groupColors = range(maxGroupsOnChart).map(i => theme.lib.colors.chart.strokeColors100[i]);

function ApplicationAnalyzeViewWithFixatedTimeConfig() {
  const showTraceDetails = useRouteMatch(traceDetailFullyQualified);

  const [
    {
      dataSource,
      dataSourceUA1,
      tagFilterExpression,
      groupBy,
      orderByGroups = dataSourceConstants[dataSource].defaultOrderByGroups,
      orderBy,
      metrics = dataSourceConstants[dataSource].defaultMetrics,
      hiddenCalls,
      charts,
      previewEnabled
    },
    onChange
  ] = useUrlState({
    bind: [
      dataSourceMatrixParameter,
      {
        path: analyze,
        name: 'callList.dataSource',
        as: 'dataSourceUA1'
      },
      tagFilterExpressionMatrixParameter,
      groupByMatrixParameter,
      orderByGroupsMatrixParameter,
      orderByMatrixParameter,
      metricsMatrixParameter,
      hiddenCallsMatrixParameter,
      chartsMatrixParameter,
      previewEnabledMatrixParameter
    ],
    resets: [
      {
        bind: [dataSourceMatrixParameter],
        reset: ({ dataSource }) => {
          if (dataSource === 'calls' || dataSource === 'traces') {
            if (dataSourceUA1) {
              // When opening an old UA1 link, the UA1 matrix parameters are converted to UA2
              // matrix parameters in the 'AnalyzeView' component. Conversion of the dataSource
              // matrix parameter triggers this reset callback, which would normally reset
              // all previously converted matrix parameters. In order to avoid that, the UA1
              // matrix parameter 'callList.dataSource' is not reset in the 'AnalyzeView' component
              // so that we can detect this use case here and short-circuit this reset callback.
              return {
                // Reset the UA1 matrix parameter 'callList.dataSource' to complete the conversion
                ['dataSourceUA1']: null
              };
            }
            return {
              [tagFilterExpressionMatrixParameter.name]: emptyArray,
              // Keep the grouping turned on or off
              [groupByMatrixParameter.name]: groupBy != null ? dataSourceConstants[dataSource].defaultGrouping : null,
              [orderByGroupsMatrixParameter.name]:
                groupBy != null ? dataSourceConstants[dataSource].defaultOrderByGroups : null,
              [metricsMatrixParameter.name]: dataSourceConstants[dataSource].defaultMetrics,
              [chartsMatrixParameter.name]: dataSourceConstants[dataSource].defaultCharts,
              [previewEnabledMatrixParameter.name]: previewEnabled
            };
          }
          return {};
        }
      }
    ],
    replaceHistory: false
  });

  const timeConfig = useTimeConfig();

  const validTagFilterExpressionResult =
    useObservable(dataSource === 'traces' ? isTraceQueryValid : isCallQueryValid, [
      tagFilterExpression,
      timeConfig,
      dataSource
    ]) ?? pendingResult;

  const validGroupResult =
    useObservable(dataSource === 'traces' ? isTraceGroupingConfigurationValid : isCallGroupingConfigurationValid, [
      groupBy,
      timeConfig,
      dataSource
    ]) ?? pendingResult;

  const isValidExpression = validTagFilterExpressionResult.data === true;
  const isInvalidExpression = validTagFilterExpressionResult.data === false;
  const isValid = isValidExpression && validGroupResult.data === true;
  const isInvalid = !isValidExpression && validGroupResult.data === false;

  // The backendQueryModel stores the last valid representation of tagFilterExpression.
  // Since some hooks depend on it, it must not changes unless the tagFilterExpression changes.
  const [{ backendQueryModel }, setBackendQueryModel] = useState({
    backendQueryModel: isValidExpression ? toBackendQueryModel(tagFilterExpression) : EMPTY_EXPRESSION,
    lastTagFilterExpression: isValidExpression ? tagFilterExpression : null
  });

  useEffect(() => {
    setBackendQueryModel(prev => {
      if (isValidExpression && !Object.is(prev.lastTagFilterExpression, tagFilterExpression)) {
        return {
          backendQueryModel: toBackendQueryModel(tagFilterExpression),
          lastTagFilterExpression: tagFilterExpression
        };
      }
      return prev;
    });
  }, [isValidExpression, tagFilterExpression]);

  const onTagFilterExpressionChange = tagFilterExpression => onChange({ tagFilterExpression });
  const onGroupByChange = groupBy => onChange({ groupBy });
  const onFocusOnGroup = tagFilterToAdd => {
    onChange({
      tagFilterExpression: joinExpressions({ expressions: [tagFilterExpression, tagFilterToAdd] }),
      groupBy: {}
    });
  };
  const onChangeOrderByGroups = orderBy => {
    ua2OrderByGroupChangedTracker({ dataSource, ...orderBy });
    onChange({ orderByGroups: orderBy });
  };
  const onChangeOrderBy = orderBy => {
    ua2OrderByChangedTracker({ dataSource, by: orderBy.orderBy, direction: orderBy.orderDirection });
    onChange({ orderBy: { by: orderBy.orderBy, direction: orderBy.orderDirection } });
  };
  const onChangeMetrics = metrics => {
    const isOrderByInMetricList = [...dataSourceConstants[dataSource].fixedMetrics, ...metrics]
      .map(metric => aggregateMetricKey(metric.metric, metric.aggregation))
      // fixed non-metric columns
      .concat(['group', 'firstTimestamp'])
      .includes(orderByGroups.by);
    if (isOrderByInMetricList) {
      onChange({ metrics });
    } else {
      const metric = dataSourceConstants[dataSource].fixedMetrics[0];
      onChange({
        metrics,
        orderByGroups: {
          by: aggregateMetricKey(metric.metric, metric.aggregation),
          aggregation: metric.aggregation
        }
      });
    }
  };
  const onChangeHiddenCalls = hiddenCalls => {
    onChange({ hiddenCalls });
  };
  const onChangeCharts = chart => {
    onChange({
      charts: chart && [
        {
          metric: chart.metricId,
          aggregation: chart.aggregationId
        }
      ]
    });
  };
  const onChangePreviewEnabled = previewEnabled => onChange({ previewEnabled });
  const updateFilter = ({ add = emptyArray, remove = emptyArray }) =>
    onChange({
      tagFilterExpression: joinExpressions({
        expressions: [removeTopLevelFilters(tagFilterExpression, ...remove), ...add]
      })
    });
  const updateGroup = groupBy => onChange({ groupBy });

  const isGrouped = isNotBlank(groupBy?.groupbyTag);

  // for UA2 closed beta charts will be always enabled
  const chartEnabled = true;
  const activeChart = charts?.length > 0 ? charts[0] : dataSourceConstants[dataSource].defaultCharts[0];
  const showChartGroupMarkers = activeChart.aggregation !== 'DISTRIBUTION';

  // Group metric time series data for charts are queried together with the aggregated group
  // metric data in the GroupedList child component. The result is stored here, so that it
  // can be passed to the ChartingPresenter component, which then renders the charts.
  const [result, setResult] = useState();

  if (showTraceDetails) {
    return (
      <TraceDetails
        tagFilterExpression={backendQueryModel}
        order={orderBy}
        hiddenCalls={hiddenCalls}
        getUngroupedData={getUngroupedData}
        isValid={isValid}
        dataSource={dataSource}
        onChangeOrder={onChangeOrderBy}
      />
    );
  }

  return (
    <Sticky header={<AnalyzeHeader isGrouped={isGrouped} />}>
      <LeftRightPadding>
        <Stack space="gutter">
          <Sections>
            <QueryBuilderSection
              value={tagFilterExpression}
              onChange={onTagFilterExpressionChange}
              QueryBuilder={dataSource === 'traces' ? TraceQueryBuilder : CallQueryBuilder}
              hasError={isInvalidExpression}
              errors={validTagFilterExpressionResult.errors}
              useLastValidStateWhenErroneous
              tracking={{
                onTagAdded: tagFilter => ua2QueryBuilderFilterAddedTracker({ dataSource, tagName: tagFilter.name }),
                onQueryChanged: formModel =>
                  ua2NestingDepthTracker({
                    dataSource,
                    nestingDepth: getMaximumExpressionDepth(toBackendQueryModel(formModel))
                  })
              }}
            />

            <GroupingConfiguratorSection
              value={groupBy}
              onChange={onGroupByChange}
              GroupingConfigurator={dataSource === 'traces' ? TraceGroupingConfigurator : CallGroupingConfigurator}
              tagFilterExpression={backendQueryModel}
              tracking={{
                onGroupAdded: group => ua2GroupChangedTracker({ dataSource, tagName: group.groupbyTag })
              }}
            />

            <ChartingConfiguratorSection
              value={chartEnabled ? { metricId: activeChart.metric, aggregationId: activeChart.aggregation } : null}
              options={isGrouped ? groupedChartingOptions[dataSource] : ungroupedChartingOptions}
              onChange={onChangeCharts}
              hideRenderer
              disableClose
              tracking={{
                onChartChanged: ({ metricId, aggregationId }) =>
                  ua2ChartChangedTracker({ dataSource, metric: metricId, aggregation: aggregationId })
              }}
            />

            {chartEnabled && (
              <ChartingPresenter
                dataSource={dataSource}
                metric={activeChart.metric}
                aggregation={activeChart.aggregation}
                groupBy={groupBy}
                tagFilterExpression={backendQueryModel}
                hiddenCalls={hiddenCalls}
                orderBy={orderByGroups}
                updateFilter={updateFilter}
                result={result}
                groupColors={groupColors}
              />
            )}

            <ActionSection
              right={
                <ApiQueryAction
                  backendQueryModel={backendQueryModel}
                  tracking={{
                    onClick: () => ua2ApiQueryPressedTracker({ dataSource })
                  }}
                />
              }
            />
          </Sections>

          {isInvalid && (
            <Message type={error} withIcon small>
              {t('in-applications:analyze.invalidQueryConfig')}
            </Message>
          )}

          {isGrouped ? (
            <GroupedList
              tagFilterExpression={backendQueryModel}
              groupBy={groupBy}
              orderBy={orderByGroups}
              subOrderBy={orderBy}
              metrics={metrics}
              onFocusOnGroup={onFocusOnGroup}
              onChangeOrderBy={onChangeOrderByGroups}
              onChangeSubOrderBy={onChangeOrderBy}
              onChangeMetrics={onChangeMetrics}
              onChangePreviewEnabled={onChangePreviewEnabled}
              previewEnabled={previewEnabled}
              isValid={isValid}
              updateFilter={updateFilter}
              updateGroup={updateGroup}
              hiddenCalls={hiddenCalls}
              onChangeHiddenCalls={onChangeHiddenCalls}
              dataSource={dataSource}
              onResult={setResult}
              showChartGroupMarkers={showChartGroupMarkers}
              groupColors={groupColors}
              getNestedUngroupedData={getUngroupedData}
              linkFormModel={tagFilterExpression}
            />
          ) : (
            <List
              tagFilterExpression={backendQueryModel}
              orderBy={orderBy}
              onChangeOrderBy={onChangeOrderBy}
              isValid={isValid}
              updateFilter={updateFilter}
              updateGroup={updateGroup}
              hiddenCalls={hiddenCalls}
              onChangeHiddenCalls={onChangeHiddenCalls}
              onChangePreviewEnabled={onChangePreviewEnabled}
              previewEnabled={previewEnabled}
              dataSource={dataSource}
              getNestedUngroupedData={getUngroupedData}
            />
          )}
        </Stack>
      </LeftRightPadding>

      <Footer />
    </Sticky>
  );
}

function getUngroupedData({
  timeConfig,
  retrievalSize,
  tagFilterExpression,
  order,
  cursor,
  hiddenCalls,
  dataSource,
  queryPrecision
}) {
  const { includeSynthetic = false, includeInternal = false } = hiddenCalls;
  const getData = dataSourceConstants[dataSource].getData;
  return getData({
    pagination: {
      cursor,
      retrievalSize
    },
    order,
    filter: {
      timeConfig: timeConfig
    },
    tagFilterExpression,
    includeSynthetic,
    includeInternal,
    queryPrecision
  });
}
