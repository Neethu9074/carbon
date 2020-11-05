import React, { useMemo } from 'react';

import LogsGroupingConfigurator, {
  isGroupingConfigurationValid
} from 'in-logging/analyze/AnalyzeView/workspace/LogsGroupingConfigurator';
import {
  tagFilterExpressionMatrixParameter,
  groupByMatrixParameter,
  orderByMatrixParameter
} from 'in-logging/navigation/matrix';
import { joinExpressions, removeTopLevelFilters } from 'in-new-components/QueryBuilder/transformation/formModel';
import GroupingConfiguratorSection from 'in-new-components/GroupingConfigurator/GroupingConfiguratorSection';
import LogsQueryBuilder, { isQueryValid } from 'in-logging/analyze/AnalyzeView/workspace/LogsQueryBuilder';
import { toBackendQueryModel } from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import ApiQueryAction from 'in-new-components/QueryBuilder/workspace/ApiQueryAction/ApiQueryAction';
import QueryBuilderSection from 'in-new-components/QueryBuilder/workspace/QueryBuilderSection';
import { ActionSection } from 'in-new-components/workspace/ActionSection/ActionSection';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import AnalyzeHeader from 'in-analyze/components/AnalyzeHeader';
import Sections from 'in-new-components/workspace/Sections';
import { pendingResult } from 'in-services/fixedObjects';
import { error } from 'in-new-components/Message/types';
import Logs from 'in-logging/analyze/AnalyzeView/Logs';
import useTimeConfig from 'in-hooks/useTimeConfig';
import useObservable from 'in-hooks/useObservable';
import Stack from 'in-new-components/layout/Stack';
import Message from 'in-new-components/Message';
import useUrlState from 'in-hooks/useUrlState';
import Footer from 'in-new-components/Footer';
import Sticky from 'in-components/Sticky';

const urlStateDefinition = {
  bind: [tagFilterExpressionMatrixParameter, groupByMatrixParameter, orderByMatrixParameter]
};

export default function LoggingAnalyzeView() {
  const timeConfig = useTimeConfig();
  const [{ tagFilterExpression, groupBy, orderBy }, onChange] = useUrlState(urlStateDefinition);

  const validTagFilterExpressionResult =
    useObservable(getIsQueryValidObservable, [tagFilterExpression, timeConfig]) ?? pendingResult;
  const validGroupResult = useObservable(getIsGroupingValidObservable, [groupBy, timeConfig]) ?? pendingResult;

  // in case of a pending result (validTagFilterExpressionResult.data === null) we do not want to show the user an error message
  const isValid = validTagFilterExpressionResult.data === true && validGroupResult.data === true;
  const isInvalid = validTagFilterExpressionResult.data === false && validGroupResult.data === false;

  const backendQueryModel = useMemo(() => (isValid ? toBackendQueryModel(tagFilterExpression) : null), [
    isValid,
    tagFilterExpression
  ]);

  const onTagFilterExpressionChange = tagFilterExpression => onChange({ tagFilterExpression });
  const onGroupByChange = groupBy => onChange({ groupBy });
  const onChangeOrderBy = orderBy => onChange({ orderBy: { by: orderBy.orderBy, direction: orderBy.orderDirection } });

  const addFilter = (...filters) =>
    onChange({ tagFilterExpression: joinExpressions({ expressions: [tagFilterExpression, ...filters] }) });
  const removeFilter = (...filters) =>
    onChange({ tagFilterExpression: removeTopLevelFilters(tagFilterExpression, ...filters) });

  return (
    <Sticky header={<AnalyzeHeader isGrouped={Boolean(groupBy?.groupbyTag)} />}>
      <LeftRightPadding>
        <Stack>
          <Sections>
            <QueryBuilderSection
              value={tagFilterExpression}
              onChange={onTagFilterExpressionChange}
              QueryBuilder={LogsQueryBuilder}
            />

            <GroupingConfiguratorSection
              value={groupBy}
              onChange={onGroupByChange}
              GroupingConfigurator={LogsGroupingConfigurator}
              tagFilterExpression={backendQueryModel || toBackendQueryModel([])}
            />

            <ActionSection right={<ApiQueryAction backendQueryModel={backendQueryModel} />} />
          </Sections>

          {isInvalid && (
            <Message type={error} withIcon small>
              The query configuration is invalid. Please address the validation failures before continuing.
            </Message>
          )}

          <Logs
            orderBy={orderBy}
            isValid={isValid}
            addFilter={addFilter}
            timeConfig={timeConfig}
            removeFilter={removeFilter}
            onChangeOrderBy={onChangeOrderBy}
            tagFilterExpression={backendQueryModel}
          />
        </Stack>
      </LeftRightPadding>

      <Footer />
    </Sticky>
  );
}

function getIsQueryValidObservable([tagFilterExpression, timeConfig]) {
  return isQueryValid(tagFilterExpression, timeConfig);
}

function getIsGroupingValidObservable([group, timeConfig]) {
  return isGroupingConfigurationValid(group, timeConfig);
}
