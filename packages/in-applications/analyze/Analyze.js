import React from 'react';

import {
  tagFilterExpressionMatrixParameter,
  groupByMatrixParameter,
  orderByGroupsMatrixParameter,
  orderByCallsMatrixParameter,
  metricsMatrixParameter,
  hiddenCallsMatrixParameter
} from 'in-applications/navigation/matrix';
import CallGroupingConfigurator, {
  isCallGroupingConfigurationValid
} from 'in-applications/analyze/components/workspace/CallGroupingConfigurator';
import CallQueryBuilder, { isCallQueryValid } from 'in-applications/analyze/components/workspace/CallQueryBuilder';
import { joinExpressions, removeTopLevelFilters } from 'in-new-components/QueryBuilder/transformation/formModel';
import GroupingConfiguratorSection from 'in-new-components/GroupingConfigurator/GroupingConfiguratorSection';
import FixatedTimeConfigContextModification from 'in-stores/time/FixatedTimeConfigContextModification';
import { toBackendQueryModel } from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import ApiQueryAction from 'in-new-components/QueryBuilder/workspace/ApiQueryAction/ApiQueryAction';
import QueryBuilderSection from 'in-new-components/QueryBuilder/workspace/QueryBuilderSection';
import { ActionSection } from 'in-new-components/workspace/ActionSection/ActionSection';
import GroupedCallsList from 'in-applications/analyze/components/GroupedCallsList';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import CallsList from 'in-applications/analyze/components/CallsList';
import { aggregateMetric } from 'in-applications/analyze/metrics';
import AnalyzeHeader from 'in-analyze/components/AnalyzeHeader';
import Sections from 'in-new-components/workspace/Sections';
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
  ]
};

export default function ApplicationAnalyzeView() {
  return (
    <FixatedTimeConfigContextModification>
      {({ refresh }) => <ApplicationAnalyzeViewWithFixatedTimeConfig refreshFixatedTimeConfig={refresh} />}
    </FixatedTimeConfigContextModification>
  );
}

function ApplicationAnalyzeViewWithFixatedTimeConfig() {
  const [{ tagFilterExpression, groupBy, orderByGroups, orderByCalls, metrics, hiddenCalls }, onChange] = useUrlState(
    urlStateDefinition
  );
  const timeConfig = useTimeConfig();

  const validTagFilterExpressionResult =
    useObservable(isCallQueryValid, [tagFilterExpression, timeConfig]) ?? pendingResult;

  const validGroupResult = useObservable(isCallGroupingConfigurationValid, [groupBy, timeConfig]) ?? pendingResult;

  // in case of a pending result (validTagFilterExpressionResult.data === null) we do not want to show the user an error message
  const isValid = validTagFilterExpressionResult.data === true && validGroupResult.data === true;
  const isInvalid = validTagFilterExpressionResult.data === false && validGroupResult.data === false;

  const backendQueryModel = isValid && toBackendQueryModel(tagFilterExpression);

  const onTagFilterExpressionChange = tagFilterExpression => onChange({ tagFilterExpression });
  const onGroupByChange = groupBy => onChange({ groupBy });
  const onFocusOnGroup = tagFilterToAdd =>
    onChange({ tagFilterExpression: joinExpressions(tagFilterExpression, [tagFilterToAdd]), groupBy: {} });
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
              QueryBuilder={CallQueryBuilder}
            />

            <GroupingConfiguratorSection
              value={groupBy}
              onChange={onGroupByChange}
              GroupingConfigurator={CallGroupingConfigurator}
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
            <CallsList
              timeConfig={timeConfig}
              tagFilterExpression={backendQueryModel}
              orderBy={orderByCalls}
              onChangeOrderBy={onChangeOrderByCalls}
              isValid={isValid}
              updateFilter={updateFilter}
              hiddenCalls={hiddenCalls}
              onChangeHiddenCalls={onChangeHiddenCalls}
            />
          )}

          {groupBy?.groupbyTag && (
            <GroupedCallsList
              timeConfig={timeConfig}
              tagFilterExpression={backendQueryModel}
              groupBy={groupBy}
              orderBy={orderByGroups}
              orderByCalls={orderByCalls}
              metrics={metrics}
              onFocusOnGroup={onFocusOnGroup}
              onChangeOrderBy={onChangeOrderByGroups}
              onChangeOrderByCalls={onChangeOrderByCalls}
              onChangeMetrics={onChangeMetrics}
              isValid={isValid}
              updateFilter={updateFilter}
              hiddenCalls={hiddenCalls}
              onChangeHiddenCalls={onChangeHiddenCalls}
            />
          )}
        </Stack>
      </LeftRightPadding>

      <Footer />
    </Sticky>
  );
}
