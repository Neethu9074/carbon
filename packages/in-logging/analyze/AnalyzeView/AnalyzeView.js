import React, { useMemo } from 'react';

import {
  tagFilterExpressionMatrixParameter,
  groupByMatrixParameter,
  orderByMatrixParameter,
  logIdMatrixParameter
} from 'in-logging/navigation/matrix';
import { isGroupingConfigurationValid } from 'in-logging/analyze/AnalyzeView/workspace/LogsGroupingConfigurator';
import { joinExpressions, removeTopLevelFilters } from 'in-new-components/QueryBuilder/transformation/formModel';
import { toBackendQueryModel } from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import { isQueryValid } from 'in-logging/analyze/AnalyzeView/workspace/LogsQueryBuilder';
import LogDetail from 'in-logging/analyze/AnalyzeView/LogDetail/LogDetail';
import GroupedLogs from 'in-logging/analyze/AnalyzeView/GroupedLogs';
import { pendingResult } from 'in-services/fixedObjects';
import { generateStableHash } from 'in-services/util/id';
import Logs from 'in-logging/analyze/AnalyzeView/Logs';
import useTimeConfig from 'in-hooks/useTimeConfig';
import useObservable from 'in-hooks/useObservable';
import useUrlState from 'in-hooks/useUrlState';

const defaultOrder = 'timestamp';
const defaultDirection = 'DESC';

const urlStateDefinition = {
  bind: [tagFilterExpressionMatrixParameter, groupByMatrixParameter, orderByMatrixParameter, logIdMatrixParameter]
};

export default function LoggingAnalyzeView() {
  const timeConfig = useTimeConfig();
  const [{ tagFilterExpression, groupBy, orderBy, logId }, onChange, onChangeAndGetAsUrl] = useUrlState(
    urlStateDefinition
  );
  const tagFilterExpressionHash = generateStableHash(tagFilterExpression);

  const resolvedOrderBy = {
    by: orderBy ? orderBy.by : defaultOrder,
    direction: orderBy ? orderBy.direction : defaultDirection
  };

  const spreadedTimeConfig = spreadTimeConfig(timeConfig);
  const validTagFilterExpressionResult =
    useObservable(() => isQueryValid(tagFilterExpression, timeConfig), [
      tagFilterExpressionHash,
      ...spreadedTimeConfig
    ]) ?? pendingResult;
  const validGroupResult =
    useObservable(() => isGroupingConfigurationValid(groupBy, timeConfig), [
      groupBy?.groupbyTag,
      ...spreadedTimeConfig
    ]) ?? pendingResult;

  // in case of a pending result (validTagFilterExpressionResult.data === null) we do not want to show the user an error message
  const isValid = validTagFilterExpressionResult.data === true && validGroupResult.data === true;
  const isInvalid = validTagFilterExpressionResult.data === false && validGroupResult.data === false;

  const setLogId = logId => onChange({ logId });
  const isGrouped = Boolean(groupBy?.groupbyTag);

  const backendQueryModel = useMemo(() => (isValid ? toBackendQueryModel(tagFilterExpression) : null), [
    isValid,
    tagFilterExpressionHash
  ]);
  const backendQueryModelHash = generateStableHash(backendQueryModel);

  if (logId) {
    return (
      <LogDetail
        logId={logId}
        setLogId={setLogId}
        orderBy={resolvedOrderBy}
        backendQueryModel={backendQueryModel}
        hash={backendQueryModelHash}
        onChangeAndGetAsUrl={onChangeAndGetAsUrl}
      />
    );
  }

  const onTagFilterExpressionChange = tagFilterExpression => onChange({ tagFilterExpression });
  const onGroupByChange = groupBy => onChange({ groupBy });
  const onChangeOrderBy = ({ orderBy, orderDirection }) =>
    onChange({ orderBy: { by: orderBy, direction: orderDirection } });

  const addFilter = (...filters) =>
    onChange({ tagFilterExpression: joinExpressions({ expressions: [tagFilterExpression, ...filters] }) });
  const removeFilter = (...filters) =>
    onChange({ tagFilterExpression: removeTopLevelFilters(tagFilterExpression, ...filters) });

  const componentProps = {
    addFilter,
    backendQueryModel,
    groupBy,
    isGrouped,
    onChange,
    isInvalid,
    onChangeOrderBy,
    onGroupByChange,
    onTagFilterExpressionChange,
    removeFilter,
    setLogId,
    tagFilterExpression,
    timeConfig,
    onChangeAndGetAsUrl,
    orderBy: resolvedOrderBy
  };

  if (isGrouped) {
    return (
      <GroupedLogs
        {...componentProps}
        getRowHref={({ logId, groupFilter }) =>
          onChangeAndGetAsUrl({
            logId,
            tagFilterExpression: joinExpressions({ expressions: [tagFilterExpression, groupFilter] })
          })
        }
      />
    );
  }

  return <Logs key="logs" {...componentProps} getRowHref={log => onChangeAndGetAsUrl({ logId: log.id })} />;
}

function spreadTimeConfig(timeConfig) {
  return [timeConfig.to, timeConfig.focusedMoment, timeConfig.windowSize, timeConfig.autoRefresh];
}
