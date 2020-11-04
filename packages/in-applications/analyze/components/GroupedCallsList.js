import { partition } from 'lodash';
import React from 'react';

import MetricAndSortingConfigurator from 'in-new-components/MetricAndSortingConfigurator/MetricAndSortingConfigurator';
import { ColumnizedContent, Ul, Li, LoadingSkeletonLi, HorizontalIndicatorLi } from 'in-new-components/lists/List';
import { type as TAG_FILTER_TYPE } from 'in-new-components/QueryBuilder/transformation/tagFilter';
import { addTagFilters } from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import FacetedSearch from 'in-applications/analyze/components/FacetedSearch/FacetedSearch';
import { EQUALS, IS_EMPTY } from 'in-new-components/QueryBuilder/tagFilter/operators';
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
import LoadMoreLi from 'in-new-components/lists/List/LoadMoreLi/LoadMoreLi';
import { number, percentage, millis } from 'in-services/formatters/number';
import { UNSPECIFIED } from 'in-analyze/components/GroupedTraces/Group';
import InlineTabNavigation from 'in-new-components/InlineTabNavigation';
import NoDataAvailable from 'in-new-components/Errors/NoDataAvailable';
import getCallGroups from 'in-subscription/application/getCallGroups';
import CallsList from 'in-applications/analyze/components/CallsList';
import { error as errorType } from 'in-new-components/Message/types';
import { getSparkChartGranularity } from 'in-applications/metrics';
import { aggregateMetric } from 'in-applications/analyze/metrics';
import { indeterminateProgress } from 'in-services/fixedObjects';
import { evaluateClassNames } from 'in-services/util/classnames';
import IconButton from 'in-new-components/IconButton/IconButton';
import useCursorPagination from 'in-hooks/useCursorPagination';
import KeyValue from 'in-new-components/lists/KeyValue';
import Tooltip from 'in-components/Tooltip/Tooltip';
import useTimeConfig from 'in-hooks/useTimeConfig';
import Message from 'in-new-components/Message';
import { empty } from 'reactive-observables';
import SvgIcon from 'in-components/SvgIcon';

import locals from './List.mless';

const defaultOrder = aggregateMetric('calls', 'SUM');
const defaultDirection = 'DESC';

export default function GroupedCallsList({
  tagFilterExpression,
  groupBy,
  orderBy,
  orderByCalls,
  metrics,
  onFocusOnGroup,
  onChangeOrderBy,
  onChangeOrderByCalls,
  onChangeMetrics,
  isValid,
  updateFilter,
  hiddenCalls,
  onChangeHiddenCalls
}) {
  const timeConfig = useTimeConfig();
  const granularity = getSparkChartGranularity(timeConfig);
  const order = { by: orderBy.by || defaultOrder, direction: orderBy.direction || defaultDirection };

  const props = useCursorPagination(
    ({ cursor }) =>
      isValid
        ? getGroups({
            timeConfig,
            tagFilterExpression,
            groupBy,
            order,
            metrics: convertMetricListToMetricObject(metrics, granularity),
            cursor,
            hiddenCalls
          })
        : empty,
    [timeConfig, groupBy, orderBy, metrics, isValid, hiddenCalls]
  );

  return (
    <Presenter
      timeConfig={timeConfig}
      groupBy={groupBy}
      order={order}
      orderByCalls={orderByCalls}
      metrics={metrics}
      granularity={granularity}
      hiddenCalls={hiddenCalls}
      onFocusOnGroup={onFocusOnGroup}
      onChangeOrderBy={onChangeOrderBy}
      onChangeMetrics={onChangeMetrics}
      onChangeOrderByCalls={onChangeOrderByCalls}
      onChangeHiddenCalls={onChangeHiddenCalls}
      tagFilterExpression={tagFilterExpression}
      updateFilter={updateFilter}
      isValid={isValid}
      {...props}
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
  orderByCalls,
  metrics,
  granularity,
  onFocusOnGroup,
  onChangeOrderBy,
  onChangeMetrics,
  onChangeOrderByCalls,
  tagFilterExpression,
  updateFilter,
  hiddenCalls,
  onChangeHiddenCalls,
  isValid
}) {
  const hasErrors = errors?.length > 0;
  const isLoading = progress?.loading;
  const columnDefinitions = columns({ groupBy, onFocusOnGroup, metrics });
  const columnDefinitionsForUnspecified = columnsForUnspecified({ metrics });

  const totalGroups = totalHits != null ? `${number.compact(totalHits)} Groups` : null;
  return (
    <div className={locals.wrapper}>
      <div className={locals.hitsAndFacetedSearch}>
        <InlineTabNavigation tabList={[{ text: totalGroups }]} />
        <FacetedSearch
          tagFilterExpression={tagFilterExpression}
          updateFilter={updateFilter}
          hiddenCalls={hiddenCalls}
          onChangeHiddenCalls={onChangeHiddenCalls}
          isValid={isValid}
        />
      </div>
      <div className={locals.table}>
        <HeaderRow
          order={order}
          metrics={metrics}
          onChangeOrderBy={onChangeOrderBy}
          onChangeMetrics={onChangeMetrics}
        />
        <Ul space="xsmall">
          {partition(items, item => item.name !== UNSPECIFIED).map(partition =>
            partition.map((item, rowIndex) => {
              const filterForGroup = groupingFilter(
                {
                  groupBy,
                  group: item.name,
                  operator: item.name !== UNSPECIFIED ? undefined : IS_EMPTY
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
                      orderByCalls={orderByCalls}
                      onChangeOrderByCalls={onChangeOrderByCalls}
                      hiddenCalls={hiddenCalls}
                    />
                  )}
                >
                  <ColumnizedContent
                    columnDefinitions={item.name !== UNSPECIFIED ? columnDefinitions : columnDefinitionsForUnspecified}
                    group={item}
                    timeConfig={timeConfig}
                    progress={progress}
                    granularity={granularity}
                    onFocusOnGroup={onFocusOnGroup}
                    orderByCalls={orderByCalls}
                    onChangeOrderByCalls={onChangeOrderByCalls}
                    hiddenCalls={hiddenCalls}
                  />
                </Li>
              );
            })
          )}
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

function columns({ groupBy, onFocusOnGroup, metrics }) {
  const { groupbyTag, groupbyTagSecondLevelKey } = groupBy;
  return [
    {
      width: '3rem',
      getContent() {
        return <SvgIcon type="lib_views_tag" />;
      }
    }
  ]
    .concat({
      getContent({ group }) {
        const label = groupbyTagSecondLevelKey ? `${groupbyTag} > ${groupbyTagSecondLevelKey}` : groupbyTag;
        return <KeyValue label={label} value={group.name} accentuated />;
      }
    })
    .concat(metrics.map(metric => metricToColumn(metric)))
    .concat({
      width: '3rem',
      getContent({ group }) {
        return (
          <Tooltip content="Focus on this group">
            <IconButton
              type="lib_actions_filter"
              onClick={() => onFocusOnGroup(groupingFilter({ groupBy, group: group.name }))}
            />
          </Tooltip>
        );
      }
    });
}

function columnsForUnspecified({ metrics }) {
  return [
    {
      width: '3rem',
      getContent() {
        return <SvgIcon type="lib_missing_data" />;
      }
    },
    {
      getContent() {
        return 'Not grouped/Unspecified';
      }
    }
  ].concat(metrics.filter(metric => metric.metric === 'calls').map(metric => metricToColumn(metric)));
}

function metricToColumn(metric) {
  const configuration = metricConfiguration[metric.metric];
  return {
    width: '13rem',
    getContent({ group, timeConfig, progress, granularity }) {
      return (
        <SparkChart
          loading={progress?.loading}
          rollup={granularity}
          timeConfig={timeConfig}
          aggregation={metric.aggregation}
          metrics={group.metrics[`${metric.metric}_${metric.aggregation}`]}
          metric={group.metrics[aggregateMetric(metric.metric, metric.aggregation)]}
          tooltipFormatter={configuration.formatter}
          label={configuration.label}
          valueTheme={'blue'}
          percentageMetric={configuration.type === 'rate'}
        />
      );
    }
  };
}

function getGroups({ timeConfig, tagFilterExpression, groupBy, order, metrics, cursor, hiddenCalls }) {
  const { includeSynthetic = false, includeInternal = false } = hiddenCalls;
  return getCallGroups({
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

function HeaderRow({ order, onChangeOrderBy, metrics, onChangeMetrics }) {
  const metricOptions = Object.entries(metricConfiguration).map(([key, value]) => ({
    metric: key,
    label: value.label,
    aggregations: value.aggregations
  }));
  const sortingOptions = metrics.map(metric => {
    const aggregation = aggregationLabel(metric.aggregation, metricConfiguration[metric.metric].type);
    return {
      value: aggregateMetric(metric.metric, metric.aggregation),
      label: `${metricConfiguration[metric.metric].label} ${aggregation}`
    };
  });
  return (
    <div className={locals.header}>
      <MetricAndSortingConfigurator
        sortOptions={sortingOptions}
        order={order}
        setOrder={order => onChangeOrderBy(order)}
        metrics={metrics}
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
  orderByCalls,
  onChangeOrderByCalls,
  hiddenCalls
}) {
  return (
    <CallsList
      tagFilterExpression={tagFilterExpression}
      timeConfig={timeConfig}
      retrievalSize={20}
      numSkeletonRows={Math.min(group.metrics[aggregateMetric('calls', 'SUM')][0][1], 20)}
      filterBy={() => onFocusOnGroup(groupingFilter({ groupBy, group: group.name }))}
      orderBy={orderByCalls}
      onChangeOrderBy={onChangeOrderByCalls}
      tableOnly
      isValid
      hiddenCalls={hiddenCalls}
    />
  );
}

function groupingFilter({ groupBy, group, operator = EQUALS }, tagFilterExpression = null) {
  const groupFilter = {
    type: TAG_FILTER_TYPE,
    operator: operator,
    name: groupBy.groupbyTag,
    key: groupBy.groupbyTagSecondLevelKey,
    value: operator === EQUALS ? group : undefined
  };
  return addTagFilters(tagFilterExpression, [groupFilter]);
}

const metricConfiguration = {
  calls: { formatter: number.compact, label: 'Calls', type: 'count', aggregations: ['SUM'] },
  latency: {
    formatter: millis.forcedCompactOnMs.detailed,
    label: 'Latency',
    type: 'time',
    aggregations: ['MIN', 'P25', 'P50', 'P75', 'P90', 'P95', 'P98', 'P99', 'MAX', 'MEAN']
  },
  errors: { formatter: percentage.detailed, label: 'Erroneous Calls Rate', type: 'rate', aggregations: ['MEAN'] },
  erroneousCalls: { formatter: number.compact, label: 'Erroneous Calls', type: 'count', aggregations: ['SUM'] }
};

const convertMetricListToMetricObject = (metrics, granularity) =>
  metrics.reduce(
    (obj, metric) => ({
      ...obj,
      ...convertMetricToObject(metric, granularity)
    }),
    {}
  );

const convertMetricToObject = (metric, granularity) => ({
  [`${metric.metric}_${metric.aggregation}`]: {
    metric: metric.metric,
    aggregation: metric.aggregation,
    granularity
  },
  [aggregateMetric(metric.metric, metric.aggregation)]: {
    metric: metric.metric,
    aggregation: metric.aggregation
  }
});
