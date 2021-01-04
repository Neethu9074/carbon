import React, { useEffect, useState } from 'react';
import { empty } from 'reactive-observables';

import { getGroupingTagCatalog as getTraceGroupingTagCatalog } from 'in-applications/analyze/components/workspace/TraceGroupingConfigurator';
import { getGroupingTagCatalog as getCallGroupingTagCatalog } from 'in-applications/analyze/components/workspace/CallGroupingConfigurator';
import MetricAndSortingConfigurator from 'in-new-components/MetricAndSortingConfigurator/MetricAndSortingConfigurator';
import { ColumnizedContent, Ul, Li, LoadingSkeletonLi, HorizontalIndicatorLi } from 'in-new-components/lists/List';
import { EQUALS, IS_EMPTY, NOT_EMPTY, IS_BLANK } from 'in-new-components/QueryBuilder/tagFilter/operators';
import { aggregateMetricKey, sparkChartMetricKey, chartMetricKey } from 'in-applications/analyze/metrics';
import { type as TAG_FILTER_TYPE } from 'in-new-components/QueryBuilder/transformation/tagFilter';
import { addTagFilters } from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import FacetedSearch from 'in-applications/analyze/components/FacetedSearch/FacetedSearch';
import { joinExpressions } from 'in-new-components/QueryBuilder/transformation/formModel';
import { emptyArray, emptyObject, indeterminateProgress } from 'in-services/fixedObjects';
import { getChartGranularity, getSparkChartGranularity } from 'in-applications/metrics';
import { NUMBER, KEY_VALUE_PAIR } from 'in-new-components/QueryBuilder/tagFilter/types';
import { UNSPECIFIED, NO_VALUE } from 'in-analyze/components/GroupedTraces/Group';
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
import LoadMoreLi from 'in-new-components/lists/List/LoadMoreLi/LoadMoreLi';
import NoDataAvailable from 'in-new-components/Errors/NoDataAvailable';
import { dataSourceConstants } from 'in-applications/analyze/metrics';
import { error as errorType } from 'in-new-components/Message/types';
import { evaluateClassNames } from 'in-services/util/classnames';
import IconButton from 'in-new-components/IconButton/IconButton';
import useTagCatalog from 'in-applications/hooks/useTagCatalog';
import useCursorPagination from 'in-hooks/useCursorPagination';
import List from 'in-applications/analyze/components/List';
import KeyValue from 'in-new-components/lists/KeyValue';
import { number } from 'in-services/formatters/number';
import Tooltip from 'in-components/Tooltip/Tooltip';
import useTimeConfig from 'in-hooks/useTimeConfig';
import Message from 'in-new-components/Message';
import SvgIcon from 'in-components/SvgIcon';

import locals from './List.mless';

export default function GroupedList({
  tagFilterExpression,
  groupBy,
  orderBy,
  subOrderBy,
  metrics,
  onFocusOnGroup,
  onChangeOrderBy,
  onChangeSubOrderBy,
  onChangeMetrics,
  isValid,
  updateFilter,
  hiddenCalls,
  onChangeHiddenCalls,
  dataSource,
  onResult,
  showChartGroupMarkers,
  groupColors,
  getNestedUngroupedData,
  linkFormModel
}) {
  // Store the last valid result so that we can show it, in case the tagFilterExpression won't be valid.
  const [{ lastDataSource, lastValidResult }, setLastState] = useState(emptyObject);
  const defaultOrder = dataSourceConstants[dataSource].metricKey;
  const defaultDirection = 'DESC';
  const timeConfig = useTimeConfig();
  const chartGranularity = getChartGranularity(timeConfig);
  const sparkChartGranularity = getSparkChartGranularity(timeConfig);
  const order = { by: orderBy.by || defaultOrder, direction: orderBy.direction || defaultDirection };
  const fixedMetrics = dataSourceConstants[dataSource].fixedMetrics;

  const result = useCursorPagination(
    ({ cursor }) =>
      isValid
        ? getGroups({
            timeConfig,
            tagFilterExpression,
            groupBy,
            order,
            metrics: convertMetricListToMetricObject(
              [...fixedMetrics, ...metrics],
              sparkChartGranularity,
              chartGranularity
            ),
            cursor,
            hiddenCalls,
            dataSource
          })
        : empty,
    [timeConfig, tagFilterExpression, groupBy, orderBy, metrics, isValid, hiddenCalls, dataSource]
  );

  const resultToDisplay = !isValid && lastValidResult && lastDataSource === dataSource ? lastValidResult : result;

  useEffect(() => {
    if (isValid) {
      if (onResult) {
        onResult(result);
      }
      setLastState({ lastDataSource: dataSource, lastValidResult: result });
    } else if (lastDataSource !== dataSource) {
      // the last result shouldn't be cached for a different data source
      setLastState(emptyObject);
    }
  }, [result?.progress.loading, isValid, dataSource, onResult, lastDataSource]);

  const groupingTagCatalog = useTagCatalog(
    dataSource === 'traces' ? getTraceGroupingTagCatalog : getCallGroupingTagCatalog
  );
  const groupByTagType = groupingTagCatalog?.tags.find(tag => tag.name === groupBy.groupbyTag)?.type;

  return (
    <Presenter
      timeConfig={timeConfig}
      groupBy={groupBy}
      order={order}
      subOrderBy={subOrderBy}
      fixedMetrics={fixedMetrics}
      selectableMetrics={metrics}
      granularity={sparkChartGranularity}
      hiddenCalls={hiddenCalls}
      onFocusOnGroup={onFocusOnGroup}
      onChangeOrderBy={onChangeOrderBy}
      onChangeMetrics={onChangeMetrics}
      onChangeSubOrderBy={onChangeSubOrderBy}
      onChangeHiddenCalls={onChangeHiddenCalls}
      tagFilterExpression={tagFilterExpression}
      updateFilter={updateFilter}
      showChartGroupMarkers={showChartGroupMarkers}
      groupColors={groupColors}
      isValid={isValid}
      groupByTagType={groupByTagType}
      dataSource={dataSource}
      getNestedUngroupedData={getNestedUngroupedData}
      linkFormModel={linkFormModel}
      {...resultToDisplay}
    />
  );
}

function Presenter({
  progress,
  errors,
  canLoadMore,
  loadMore,
  totalHits,
  items,
  timeConfig,
  groupBy,
  order,
  subOrderBy,
  fixedMetrics,
  selectableMetrics,
  granularity,
  onFocusOnGroup,
  onChangeOrderBy,
  onChangeMetrics,
  onChangeSubOrderBy,
  tagFilterExpression,
  updateFilter,
  hiddenCalls,
  onChangeHiddenCalls,
  showChartGroupMarkers,
  groupColors,
  isValid,
  groupByTagType,
  dataSource,
  getNestedUngroupedData,
  linkFormModel
}) {
  const hasErrors = errors?.length > 0;
  const isLoading = progress.loading || !groupByTagType;
  const labelColumnDefinitions = labelColumns({ groupBy, showChartGroupMarkers, groupColors });
  const metricColumnDefinitions = metricColumns({ metrics: [...fixedMetrics, ...selectableMetrics], dataSource });
  const actionColumnDefinitions = actionColumns({ groupBy, onFocusOnGroup, groupByTagType });

  const totalGroups = totalHits != null ? `${number.compact(totalHits)} Groups` : null;
  return (
    <div className={locals.wrapper}>
      <div className={locals.hitsAndFacetedSearch}>
        <div className={locals.hits}>
          <span>{totalGroups}</span>
        </div>
        <FacetedSearch
          tagFilterExpression={tagFilterExpression}
          updateFilter={updateFilter}
          hiddenCalls={hiddenCalls}
          onChangeHiddenCalls={onChangeHiddenCalls}
          isValid={isValid}
          dataSource={dataSource}
        />
      </div>
      <div className={locals.table}>
        <HeaderRow
          order={order}
          fixedMetrics={fixedMetrics}
          selectableMetrics={selectableMetrics}
          onChangeOrderBy={onChangeOrderBy}
          onChangeMetrics={onChangeMetrics}
          dataSource={dataSource}
        />
        <Ul space="xsmall">
          {(!isLoading || totalHits != null) &&
            items.map((item, rowIndex) => {
              const filterForGroup = groupingFilter(
                {
                  groupBy,
                  group: item.name,
                  operator: item.name !== UNSPECIFIED ? undefined : IS_EMPTY,
                  groupByTagType
                },
                tagFilterExpression
              );
              return (
                <Li
                  key={rowIndex}
                  noAlternatingBg
                  borderRadius="medium"
                  highlightOpenState={false}
                  toggleContentOnRowClick
                  className={evaluateClassNames({ [locals.unspecified]: item.name === UNSPECIFIED })}
                  renderNestedContent={() => (
                    <ExpandedGroup
                      groupBy={groupBy}
                      group={item}
                      tagFilterExpression={filterForGroup}
                      timeConfig={timeConfig}
                      onFocusOnGroup={onFocusOnGroup}
                      subOrderBy={subOrderBy}
                      onChangeSubOrderBy={onChangeSubOrderBy}
                      hiddenCalls={hiddenCalls}
                      groupByTagType={groupByTagType}
                      dataSource={dataSource}
                      getNestedUngroupedData={getNestedUngroupedData}
                      linkFormModel={linkFormModel}
                    />
                  )}
                >
                  <div className={locals.list}>
                    <div className={locals.labelColumn}>
                      <ColumnizedContent
                        columnDefinitions={labelColumnDefinitions}
                        group={item}
                        dataSource={dataSource}
                        getNestedUngroupedData={getNestedUngroupedData}
                        linkFormModel={linkFormModel}
                      />
                    </div>
                    <div className={locals.metricColumn}>
                      <ColumnizedContent
                        columnDefinitions={metricColumnDefinitions}
                        group={item}
                        timeConfig={timeConfig}
                        progress={progress}
                        granularity={granularity}
                        dataSource={dataSource}
                      />
                    </div>
                  </div>
                  <div className={locals.actionColumn}>
                    <ColumnizedContent
                      columnDefinitions={actionColumnDefinitions}
                      group={item}
                      dataSource={dataSource}
                    />
                  </div>
                </Li>
              );
            })}
          {isLoading && <HorizontalIndicatorLi progress={indeterminateProgress} />}
          {isLoading && <LoadingSkeletonLi />}
          {hasErrors &&
            errors.map((error, index) => (
              <Li key={index}>
                <Message className={locals.message} type={errorType} small>
                  {error.message}
                </Message>
              </Li>
            ))}
          {canLoadMore && <LoadMoreLi loadMore={loadMore} />}
        </Ul>
        {!isLoading && items.length === 0 && <NoDataAvailable height={240} />}
      </div>
    </div>
  );
}

function labelColumns({ groupBy, showChartGroupMarkers, groupColors }) {
  const { groupbyTag, groupbyTagSecondLevelKey } = groupBy;
  let i = 0;
  return [
    // conditionally add a column with chart color markers
    ...(showChartGroupMarkers
      ? [
          {
            width: '1.5rem',
            getContent() {
              const groupIdx = i++;
              return groupIdx < groupColors.length ? (
                <div className={locals.center}>
                  <div className={locals.rect} style={{ backgroundColor: groupColors[groupIdx] }} />
                </div>
              ) : null;
            }
          }
        ]
      : emptyArray),
    {
      width: '3rem',
      shrink: false,
      getContent() {
        return (
          <div className={locals.center}>
            <SvgIcon className={locals.tag} type={groupbyTag === UNSPECIFIED ? 'lib_missing_data' : 'lib_views_tag'} />
          </div>
        );
      }
    }
  ].concat({
    minWidth: '10rem',
    shrink: false,
    getContent({ group }) {
      const label = groupbyTagSecondLevelKey ? `${groupbyTag} > ${groupbyTagSecondLevelKey}` : groupbyTag;
      const groupName = group.name === UNSPECIFIED ? 'Not grouped/Unspecified' : group.name;
      const groupNameWithTooltip = (
        <Tooltip content={groupName} align="bottomLeft">
          <div>{groupName}</div>
        </Tooltip>
      );
      return <KeyValue label={label} customValue={groupNameWithTooltip} accentuated />;
    }
  });
}

function metricColumns({ metrics, dataSource }) {
  return metrics.map(metric => metricToColumn(metric, dataSource));
}

function actionColumns({ groupBy, onFocusOnGroup, groupByTagType }) {
  return [
    {
      width: '3rem',
      shrink: false,
      getContent({ group }) {
        return (
          <Tooltip content="Focus on this group">
            <IconButton
              type="lib_actions_filter"
              onClick={() => onFocusOnGroup(groupingFilter({ groupBy, group: group.name, groupByTagType }))}
            />
          </Tooltip>
        );
      }
    }
  ];
}

function metricToColumn(metric, dataSource) {
  const configuration =
    dataSourceConstants[dataSource].fixedMetricConfiguration[metric.metric] ??
    dataSourceConstants[dataSource].metricConfiguration[metric.metric];
  return {
    shrink: false,
    getContent({ group, timeConfig, progress, granularity }) {
      return (
        <div className={locals.metric}>
          <SparkChart
            loading={progress?.loading}
            rollup={granularity}
            timeConfig={timeConfig}
            aggregation={metric.aggregation}
            metrics={group.metrics[sparkChartMetricKey(metric.metric, metric.aggregation)]}
            metric={group.metrics[aggregateMetricKey(metric.metric, metric.aggregation)]}
            tooltipFormatter={configuration.formatter}
            label={configuration.label}
            valueTheme={'blue'}
            percentageMetric={configuration.type === 'rate'}
          />
        </div>
      );
    }
  };
}

function getGroups({ timeConfig, tagFilterExpression, groupBy, order, metrics, cursor, hiddenCalls, dataSource }) {
  const { includeSynthetic = false, includeInternal = false } = hiddenCalls;
  const getData = dataSourceConstants[dataSource].getGroupData;
  return getData({
    pagination: {
      cursor,
      retrievalSize: 20
    },
    group: groupBy,
    filter: {
      timeConfig
    },
    tagFilterExpression,
    order,
    metrics,
    includeSynthetic,
    includeInternal
  });
}

function aggregationLabel(aggregation, type) {
  if (aggregation.startsWith('P')) {
    return `(${aggregation.substring(1)}th)`;
  } else if (type === 'rate') {
    return '(rate)';
  } else if (type === 'count') {
    return '(count)';
  } else if (type === 'time') {
    return `(${aggregation.toLowerCase()})`;
  } else {
    return '';
  }
}

function HeaderRow({ order, onChangeOrderBy, fixedMetrics, selectableMetrics, onChangeMetrics, dataSource }) {
  const metricConfiguration = dataSourceConstants[dataSource].metricConfiguration;
  const sortingMetricConfiguration = {
    ...dataSourceConstants[dataSource].fixedMetricConfiguration,
    ...metricConfiguration
  };
  const metricOptions = Object.entries(metricConfiguration).map(([key, value]) => ({
    metric: key,
    label: value.label,
    aggregations: value.aggregations
  }));
  const sortingOptions = [...fixedMetrics, ...selectableMetrics].map(metric => {
    const aggregation = aggregationLabel(metric.aggregation, sortingMetricConfiguration[metric.metric].type);
    return {
      value: aggregateMetricKey(metric.metric, metric.aggregation),
      label: `${sortingMetricConfiguration[metric.metric].label} ${aggregation}`
    };
  });
  return (
    <div className={locals.header}>
      <MetricAndSortingConfigurator
        sortOptions={sortingOptions}
        order={order}
        setOrder={order => onChangeOrderBy(order)}
        metrics={selectableMetrics}
        setMetrics={onChangeMetrics}
        metricOptions={metricOptions}
      />
    </div>
  );
}

function ExpandedGroup({
  groupBy,
  group,
  tagFilterExpression,
  timeConfig,
  onFocusOnGroup,
  subOrderBy,
  onChangeSubOrderBy,
  hiddenCalls,
  groupByTagType,
  dataSource,
  getNestedUngroupedData,
  linkFormModel
}) {
  // Prevents the sublist from being rendered until the view can retrieve the appropriate metrics for Trace or Calls.
  if (!group.metrics[dataSourceConstants[dataSource].metricKey]) {
    return null;
  }
  return (
    <List
      tagFilterExpression={tagFilterExpression}
      timeConfig={timeConfig}
      retrievalSize={20}
      numSkeletonRows={Math.min(group.metrics[dataSourceConstants[dataSource].metricKey][0][1] ?? 20, 20)}
      filterBy={() => onFocusOnGroup(groupingFilter({ groupBy, group: group.name, groupByTagType }))}
      orderBy={subOrderBy}
      onChangeOrderBy={onChangeSubOrderBy}
      tableOnly
      isValid
      hiddenCalls={hiddenCalls}
      dataSource={dataSource}
      getNestedUngroupedData={getNestedUngroupedData}
      linkFormModel={joinExpressions({
        expressions: [linkFormModel, groupingFilter({ groupBy, group: group.name, groupByTagType })]
      })}
    />
  );
}

function groupingFilter({ groupBy, group, operator = EQUALS, groupByTagType }, tagFilterExpression = null) {
  let groupFilter;

  if (group === UNSPECIFIED) {
    groupFilter = {
      type: TAG_FILTER_TYPE,
      operator: IS_EMPTY,
      name: groupBy.groupbyTag,
      key: groupBy.groupbyTagSecondLevelKey,
      entity: groupBy.groupbyTagEntity
    };
  } else if (group === NO_VALUE) {
    groupFilter = {
      type: TAG_FILTER_TYPE,
      operator: IS_BLANK,
      name: groupBy.groupbyTag,
      key: groupBy.groupbyTagSecondLevelKey,
      entity: groupBy.groupbyTagEntity
    };
  } else if (groupByTagType === KEY_VALUE_PAIR && !groupBy.groupbyTagSecondLevelKey) {
    // when grouping by key_value_pair tags without second level key (e.g. call.http.header),
    // expanding a group such as "user-agent" should show calls filtered by `call.http.header.user-agent is_present`
    groupFilter = {
      type: TAG_FILTER_TYPE,
      operator: NOT_EMPTY,
      name: groupBy.groupbyTag,
      key: group,
      entity: groupBy.groupbyTagEntity
    };
  } else {
    groupFilter = {
      type: TAG_FILTER_TYPE,
      operator: operator,
      name: groupBy.groupbyTag,
      key: groupBy.groupbyTagSecondLevelKey,
      value: operator === EQUALS ? (groupByTagType === NUMBER ? Number(group) : group) : undefined,
      entity: groupBy.groupbyTagEntity
    };
  }
  return addTagFilters(tagFilterExpression, [groupFilter]);
}

const convertMetricListToMetricObject = (metrics, sparkChartGranularity, chartGranularity) =>
  metrics.reduce(
    (obj, metric) => ({
      ...obj,
      // chart metrics
      [chartMetricKey(metric.metric, metric.aggregation)]: {
        metric: metric.metric,
        aggregation: metric.aggregation,
        granularity: chartGranularity
      },
      // spark chart metrics
      [sparkChartMetricKey(metric.metric, metric.aggregation)]: {
        metric: metric.metric,
        aggregation: metric.aggregation,
        granularity: sparkChartGranularity
      },
      [aggregateMetricKey(metric.metric, metric.aggregation)]: {
        metric: metric.metric,
        aggregation: metric.aggregation
      }
    }),
    {}
  );
