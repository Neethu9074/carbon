import React, { useEffect, useState } from 'react';
import { useRouteMatch } from 'react-router';
import { range } from 'lodash';

import {
  tagFilterExpressionMatrixParameter,
  groupByMatrixParameter,
  orderByGroupsMatrixParameter,
  orderByCallsMatrixParameter,
  metricsMatrixParameter,
  hiddenCallsMatrixParameter,
  chartsMatrixParameter
} from 'in-applications/navigation/matrix';
import TraceGroupingConfigurator, {
  isTraceGroupingConfigurationValid
} from 'in-applications/analyze/components/workspace/TraceGroupingConfigurator';
import CallGroupingConfigurator, {
  isCallGroupingConfigurationValid
} from 'in-applications/analyze/components/workspace/CallGroupingConfigurator';
import { EMPTY_EXPRESSION, toBackendQueryModel } from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import TraceQueryBuilder, { isTraceQueryValid } from 'in-applications/analyze/components/workspace/TraceQueryBuilder';
import CallQueryBuilder, { isCallQueryValid } from 'in-applications/analyze/components/workspace/CallQueryBuilder';
import { joinExpressions, removeTopLevelFilters } from 'in-new-components/QueryBuilder/transformation/formModel';
import GroupingConfiguratorSection from 'in-new-components/GroupingConfigurator/GroupingConfiguratorSection';
import ChartingConfiguratorSection from 'in-new-components/ChartingConfigurator/ChartingConfiguratorSection';
import ChartingPresenter from 'in-applications/analyze/components/ChartingPresenter/ChartingPresenter';
import { chartingOptions } from 'in-applications/analyze/components/ChartingPresenter/chartingOptions';
import FixatedTimeConfigContextModification from 'in-stores/time/FixatedTimeConfigContextModification';
import ApiQueryAction from 'in-new-components/QueryBuilder/workspace/ApiQueryAction/ApiQueryAction';
import QueryBuilderSection from 'in-new-components/QueryBuilder/workspace/QueryBuilderSection';
import { ActionSection } from 'in-new-components/workspace/ActionSection/ActionSection';
import TraceDetails from 'in-applications/analyze/components/TraceDetails';
import GroupedList from 'in-applications/analyze/components/GroupedList';
import { traceDetailFullyQualified } from 'in-analyze/navigation/paths';
import { dataSourceConstants } from 'in-applications/analyze/metrics';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import { aggregateMetricKey } from 'in-applications/analyze/metrics';
import AnalyzeHeader from 'in-analyze/components/AnalyzeHeader';
import Sections from 'in-new-components/workspace/Sections';
import List from 'in-applications/analyze/components/List';
import { pendingResult } from 'in-services/fixedObjects';
import { error } from 'in-new-components/Message/types';
import { emptyArray } from 'in-services/fixedObjects';
import useTimeConfig from 'in-hooks/useTimeConfig';
import useObservable from 'in-hooks/useObservable';
import Stack from 'in-new-components/layout/Stack';
import Message from 'in-new-components/Message';
import useUrlState from 'in-hooks/useUrlState';
import Footer from 'in-new-components/Footer';
import Sticky from 'in-components/Sticky';
import theme from 'in-themes';

const urlStateDefinition = {
  bind: [
    tagFilterExpressionMatrixParameter,
    groupByMatrixParameter,
    orderByGroupsMatrixParameter,
    orderByCallsMatrixParameter,
    metricsMatrixParameter,
    hiddenCallsMatrixParameter,
    chartsMatrixParameter
  ],
  resets: [
    {
      bind: [
        // TODO: reuse the 'dataSource' parameter definition from AnalyzeView (maybe move the param definition to some better/reusable location)
        {
          path: '/analyze',
          name: 'callList.dataSource',
          as: 'dataSource',
          initialState: 'calls'
        }
      ],
      reset: ({ dataSource }) => {
        if (dataSource === 'calls' || dataSource === 'traces') {
          return {
            [tagFilterExpressionMatrixParameter.name]: emptyArray,
            [groupByMatrixParameter.name]: undefined,
            [orderByGroupsMatrixParameter.name]: dataSourceConstants[dataSource].defaultOrderByGroups,
            [metricsMatrixParameter.name]: dataSourceConstants[dataSource].defaultMetrics,
            [chartsMatrixParameter.name]: dataSourceConstants[dataSource].defaultCharts
          };
        }
        return {};
      }
    }
  ]
};

export default function ApplicationAnalyzeView({ dataSource }) {
  return (
    <FixatedTimeConfigContextModification>
      {({ refresh }) => (
        <ApplicationAnalyzeViewWithFixatedTimeConfig refreshFixatedTimeConfig={refresh} dataSource={dataSource} />
      )}
    </FixatedTimeConfigContextModification>
  );
}
const maxGroupsOnChart = Math.min(5, theme.lib.colors.chart.strokeColors100.length);
const groupColors = range(maxGroupsOnChart).map(i => theme.lib.colors.chart.strokeColors100[i]);

function ApplicationAnalyzeViewWithFixatedTimeConfig({ dataSource }) {
  const showTraceDetails = useRouteMatch(traceDetailFullyQualified);
  const [
    {
      tagFilterExpression,
      groupBy,
      orderByGroups = dataSourceConstants[dataSource].defaultOrderByGroups,
      orderByCalls,
      metrics = dataSourceConstants[dataSource].defaultMetrics,
      hiddenCalls,
      charts
    },
    onChange
  ] = useUrlState(urlStateDefinition);
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

  // in case of a pending result (validTagFilterExpressionResult.data === null) we do not want to show the user an error message
  const isValidExpression = validTagFilterExpressionResult.data === true;
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
  const onChangeOrderByGroups = orderBy => onChange({ orderByGroups: orderBy });
  const onChangeOrderByCalls = orderBy =>
    onChange({ orderByCalls: { by: orderBy.orderBy, direction: orderBy.orderDirection } });
  const onChangeMetrics = metrics => {
    const isOrderByInMetricList = metrics
      .map(metric => aggregateMetricKey(metric.metric, metric.aggregation))
      .includes(orderByGroups.by);
    if (isOrderByInMetricList) {
      onChange({ metrics });
    } else {
      onChange({
        metrics,
        orderByGroups: {
          by: aggregateMetricKey(metrics[0].metric, metrics[0].aggregation),
          aggregation: metrics[0].aggregation
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
  const updateFilter = ({ add = emptyArray, remove = emptyArray }) =>
    onChange({
      tagFilterExpression: joinExpressions({
        expressions: [removeTopLevelFilters(tagFilterExpression, ...remove), ...add]
      })
    });

  const isGrouped = !!groupBy?.groupbyTag;
  const chartEnabled = charts?.length === 1;

  // Group metric time series data for charts are queried together with the aggregated group
  // metric data in the GroupedList child component. The result is stored here, so that it
  // can be passed to the ChartingPresenter component, which then renders the charts.
  const [result, setResult] = useState();

  if (showTraceDetails) {
    return (
      <TraceDetails
        tagFilterExpression={backendQueryModel}
        order={orderByCalls}
        hiddenCalls={hiddenCalls}
        getUngroupedData={getUngroupedData}
        isValid={isValid}
        dataSource={dataSource}
        onChangeOrder={onChangeOrderByCalls}
      />
    );
  }

  return (
    <Sticky header={<AnalyzeHeader isGrouped={isGrouped} />}>
      <LeftRightPadding>
        <Stack>
          <Sections>
            <QueryBuilderSection
              value={tagFilterExpression}
              onChange={onTagFilterExpressionChange}
              QueryBuilder={dataSource === 'traces' ? TraceQueryBuilder : CallQueryBuilder}
            />

            <GroupingConfiguratorSection
              value={groupBy}
              onChange={onGroupByChange}
              GroupingConfigurator={dataSource === 'traces' ? TraceGroupingConfigurator : CallGroupingConfigurator}
              tagFilterExpression={backendQueryModel}
            />

            <ChartingConfiguratorSection
              value={chartEnabled ? { metricId: charts[0].metric, aggregationId: charts[0].aggregation } : null}
              options={chartingOptions({ dataSource: dataSource, isGrouped: isGrouped, selectedMetrics: metrics })}
              onChange={onChangeCharts}
              hideRenderer
            />

            {chartEnabled && (
              <ChartingPresenter
                dataSource={dataSource}
                metric={charts[0].metric}
                aggregation={charts[0].aggregation}
                isGrouped={isGrouped}
                tagFilterExpression={backendQueryModel}
                updateFilter={updateFilter}
                result={result}
                groupColors={groupColors}
              />
            )}

            <ActionSection right={<ApiQueryAction backendQueryModel={backendQueryModel} />} />
          </Sections>

          {isInvalid && (
            <Message type={error} withIcon small>
              The query configuration is invalid. Please address the validation failures before continuing.
            </Message>
          )}

          {isGrouped ? (
            <GroupedList
              tagFilterExpression={backendQueryModel}
              groupBy={groupBy}
              orderBy={orderByGroups}
              subOrderBy={orderByCalls}
              metrics={metrics}
              onFocusOnGroup={onFocusOnGroup}
              onChangeOrderBy={onChangeOrderByGroups}
              onChangeSubOrderBy={onChangeOrderByCalls}
              onChangeMetrics={onChangeMetrics}
              isValid={isValid}
              updateFilter={updateFilter}
              hiddenCalls={hiddenCalls}
              onChangeHiddenCalls={onChangeHiddenCalls}
              dataSource={dataSource}
              onResult={setResult}
              chartEnabled={chartEnabled}
              groupColors={groupColors}
              getNestedUngroupedData={getUngroupedData}
            />
          ) : (
            <List
              tagFilterExpression={backendQueryModel}
              orderBy={orderByCalls}
              onChangeOrderBy={onChangeOrderByCalls}
              isValid={isValid}
              updateFilter={updateFilter}
              hiddenCalls={hiddenCalls}
              onChangeHiddenCalls={onChangeHiddenCalls}
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
  previewEnabled = false,
  cursor,
  hiddenCalls,
  dataSource
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
    queryPrecision: previewEnabled ? 'APPROXIMATE' : 'FULL',
    includeSynthetic,
    includeInternal
  });
}
