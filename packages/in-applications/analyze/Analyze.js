import React from 'react';

import {
  tagFilterExpressionMatrixParameter,
  groupByMatrixParameter,
  orderByGroupsMatrixParameter,
  orderByCallsMatrixParameter,
  metricsMatrixParameter,
  hiddenCallsMatrixParameter
} from 'in-applications/navigation/matrix';
import TraceGroupingConfigurator, {
  isTraceGroupingConfigurationValid
} from 'in-applications/analyze/components/workspace/TraceGroupingConfigurator';
import CallGroupingConfigurator, {
  isCallGroupingConfigurationValid
} from 'in-applications/analyze/components/workspace/CallGroupingConfigurator';
import TraceQueryBuilder, { isTraceQueryValid } from 'in-applications/analyze/components/workspace/TraceQueryBuilder';
import CallQueryBuilder, { isCallQueryValid } from 'in-applications/analyze/components/workspace/CallQueryBuilder';
import { joinExpressions, removeTopLevelFilters } from 'in-new-components/QueryBuilder/transformation/formModel';
import GroupingConfiguratorSection from 'in-new-components/GroupingConfigurator/GroupingConfiguratorSection';
import FixatedTimeConfigContextModification from 'in-stores/time/FixatedTimeConfigContextModification';
import { toBackendQueryModel } from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import ApiQueryAction from 'in-new-components/QueryBuilder/workspace/ApiQueryAction/ApiQueryAction';
import QueryBuilderSection from 'in-new-components/QueryBuilder/workspace/QueryBuilderSection';
import { ActionSection } from 'in-new-components/workspace/ActionSection/ActionSection';
import GroupedList from 'in-applications/analyze/components/GroupedList';
import { dataSourceConstants } from 'in-applications/analyze/metrics';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import { aggregateMetric } from 'in-applications/analyze/metrics';
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

const urlStateDefinition = {
  bind: [
    tagFilterExpressionMatrixParameter,
    groupByMatrixParameter,
    orderByGroupsMatrixParameter,
    orderByCallsMatrixParameter,
    metricsMatrixParameter,
    hiddenCallsMatrixParameter
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
            [groupByMatrixParameter.name]: null,
            [metricsMatrixParameter.name]: [
              { metric: dataSource, aggregation: 'SUM' },
              { metric: 'latency', aggregation: 'MEAN' },
              { metric: 'errors', aggregation: 'MEAN' }
            ],
            [orderByGroupsMatrixParameter.name]: {
              by: dataSourceConstants[dataSource].metricKey,
              direction: 'DESC'
            }
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

function ApplicationAnalyzeViewWithFixatedTimeConfig({ dataSource }) {
  const [
    {
      tagFilterExpression,
      groupBy,
      orderByGroups = {
        by: dataSourceConstants[dataSource].metricKey,
        direction: 'DESC'
      },
      orderByCalls,
      metrics = [
        { metric: dataSource, aggregation: 'SUM' },
        { metric: 'latency', aggregation: 'MEAN' },
        { metric: 'errors', aggregation: 'MEAN' }
      ],
      hiddenCalls
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
  const isValid = validTagFilterExpressionResult.data === true && validGroupResult.data === true;
  const isInvalid = validTagFilterExpressionResult.data === false && validGroupResult.data === false;

  const backendQueryModel = isValid && toBackendQueryModel(tagFilterExpression);

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
      .map(metric => aggregateMetric(metric.metric, metric.aggregation))
      .includes(orderByGroups.by);
    if (isOrderByInMetricList) {
      onChange({ metrics });
    } else {
      onChange({
        metrics,
        orderByGroups: {
          by: aggregateMetric(metrics[0].metric, metrics[0].aggregation),
          aggregation: metrics[0].aggregation
        }
      });
    }
  };
  const onChangeHiddenCalls = hiddenCalls => {
    onChange({ hiddenCalls });
  };
  const updateFilter = ({ add = emptyArray, remove = emptyArray }) =>
    onChange({
      tagFilterExpression: joinExpressions({
        expressions: [removeTopLevelFilters(tagFilterExpression, ...remove), ...add]
      })
    });

  return (
    <Sticky header={<AnalyzeHeader isGrouped={Boolean(groupBy?.groupbyTag)} />}>
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
              tagFilterExpression={backendQueryModel || toBackendQueryModel([])}
            />

            <ActionSection
              /*left={
                <>
                  <Action icon="lib_bar_chart">Add chart</Action>
                </>
              }*/
              right={<ApiQueryAction backendQueryModel={backendQueryModel} />}
            />
          </Sections>

          {isInvalid && (
            <Message type={error} withIcon small>
              The query configuration is invalid. Please address the validation failures before continuing.
            </Message>
          )}

          {!groupBy?.groupbyTag && (
            <List
              timeConfig={timeConfig}
              tagFilterExpression={backendQueryModel}
              orderBy={orderByCalls}
              onChangeOrderBy={onChangeOrderByCalls}
              isValid={isValid}
              updateFilter={updateFilter}
              hiddenCalls={hiddenCalls}
              onChangeHiddenCalls={onChangeHiddenCalls}
              dataSource={dataSource}
            />
          )}

          {groupBy?.groupbyTag && (
            <GroupedList
              timeConfig={timeConfig}
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
            />
          )}
        </Stack>
      </LeftRightPadding>

      <Footer />
    </Sticky>
  );
}
