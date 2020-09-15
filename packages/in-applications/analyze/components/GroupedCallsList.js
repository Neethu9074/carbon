import React from 'react';

import { ColumnizedContent, Ul, Li, LoadingSkeletonLi, HorizontalIndicatorLi } from 'in-new-components/lists/List';
import SortingConfigurator from 'in-new-components/SortingConfigurator/SortingConfigurator';
import MetricConfigurator from 'in-new-components/MetricConfigurator/MetricConfigurator';
import LoadMoreLi from 'in-new-components/lists/List/LoadMoreLi/LoadMoreLi';
import NoDataAvailable from 'in-new-components/Errors/NoDataAvailable';
import getCallGroups from 'in-subscription/application/getCallGroups';
import CallsList from 'in-applications/analyze/components/CallsList';
import { error as errorType } from 'in-new-components/Message/types';
import { indeterminateProgress } from 'in-services/fixedObjects';
import IconButton from 'in-new-components/IconButton/IconButton';
import useCursorPagination from 'in-hooks/useCursorPagination';
import CheckboxFancy from 'in-components/form/CheckboxFancy';
import KeyValue from 'in-new-components/lists/KeyValue';
import useTimeConfig from 'in-hooks/useTimeConfig';
import Message from 'in-new-components/Message';
import locals from './GroupedCallsList.mless';
import Link from 'in-components/Link';

const defaultOrder = 'calls_SUM_Agg';
const defaultDirection = 'DESC';

export default function GroupedCallsList({
  tagFilterExpression,
  groupBy,
  orderBy,
  orderByCalls,
  metrics,
  onChangeFilter,
  onChangeOrderBy,
  onChangeOrderByCalls,
  onChangeMetrics
}) {
  const timeConfig = useTimeConfig();
  const order = { by: orderBy.by || defaultOrder, direction: orderBy.direction || defaultDirection };

  const props = useCursorPagination(
    ({ cursor }) =>
      getGroups({
        timeConfig,
        tagFilterExpression,
        groupBy,
        order,
        metrics: allMetrics(metrics),
        cursor
      }),
    [timeConfig, groupBy, orderBy, metrics]
  );

  return (
    <Presenter
      timeConfig={timeConfig}
      tagFilterExpression={tagFilterExpression}
      groupBy={groupBy}
      order={order}
      orderByCalls={orderByCalls}
      metrics={metrics}
      onChangeFilter={onChangeFilter}
      onChangeOrderBy={onChangeOrderBy}
      onChangeMetrics={onChangeMetrics}
      onChangeOrderByCalls={onChangeOrderByCalls}
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
  tagFilterExpression,
  groupBy,
  order,
  orderByCalls,
  metrics,
  onChangeFilter,
  onChangeOrderBy,
  onChangeMetrics,
  onChangeOrderByCalls
}) {
  const hasErrors = errors?.length > 0;
  const isLoading = progress?.loading;
  const selectableGroups = items.slice(0, 5).map(item => item.name);
  const columnDefinitions = columns({ tagFilterExpression, groupBy, selectableGroups, onChangeFilter });

  return (
    <>
      <HeaderRow
        totalGroups={totalHits}
        order={order}
        metrics={metrics}
        onChangeOrderBy={onChangeOrderBy}
        onChangeMetrics={onChangeMetrics}
      />
      <Ul space="xsmall">
        {items.map((item, rowIndex) => (
          <Li
            key={rowIndex}
            noAlternatingBg
            borderRadius="medium"
            toggleContentOnRowClick
            highlightOpenState={false}
            renderNestedContent={() => (
              <ExpandedGroup
                group={item}
                tagFilterExpression={addTagFilters(tagFilterExpression, groupBy, item.name)}
                timeConfig={timeConfig}
                onChangeFilter={onChangeFilter}
                orderByCalls={orderByCalls}
                onChangeOrderByCalls={onChangeOrderByCalls}
              />
            )}
          >
            <ColumnizedContent columnDefinitions={columnDefinitions} group={item} />
          </Li>
        ))}
        {isLoading && <HorizontalIndicatorLi progress={indeterminateProgress} />}
        {isLoading && <LoadingSkeletonLi />}
        {hasErrors &&
          errors.map(error => (
            <Li key={error}>
              <Message className={locals.message} type={errorType} small>
                {error}
              </Message>
            </Li>
          ))}
        {canLoadMore && <LoadMoreLi loadMore={loadMore} />}
      </Ul>
      {!isLoading && items.length === 0 && <NoDataAvailable height={240} />}
    </>
  );
}

function columns({ tagFilterExpression, groupBy, selectableGroups, onChangeFilter }) {
  const { groupbyTag, groupbyTagSecondLevelKey } = groupBy;
  return [
    {
      width: '3rem',
      getContent({ group }) {
        return (
          selectableGroups.includes(group.name) && (
            <CheckboxFancy checked size="large" onChange={() => alert(`selected groupBy ${group.name}`)} />
          )
        );
      }
    },
    {
      width: '3rem',
      getContent() {
        return <IconButton type="lib_application_endpoint" />;
      }
    }
  ].concat({
    getContent({ group }) {
      const label = groupbyTagSecondLevelKey ? `${groupbyTag} > ${groupbyTagSecondLevelKey}` : groupbyTag;
      const value = (
        <Link onClick={() => onChangeFilter([addTagFilters(tagFilterExpression, groupBy, group.name)])}>
          {group.name}
        </Link>
      );
      return <KeyValue label={label} value={value} accentuated />;
    }
  });
}

function getGroups({ timeConfig, tagFilterExpression, groupBy, order, metrics, cursor }) {
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
    metrics
  });
}

function HeaderRow({ totalGroups, order, onChangeOrderBy, metrics, onChangeMetrics }) {
  const options = [
    {
      metricId: 'latency',
      label: 'Latency',
      aggregations: ['MEAN', 'MIN', 'P25', 'P50', 'P75', 'P90', 'P90', 'P95', 'P98', 'P99', 'MAX', 'SUM']
    },
    {
      metricId: 'calls',
      label: 'Calls',
      aggregations: ['MEAN']
    },
    {
      metricId: 'errors',
      label: 'Erroneous calls',
      aggregations: ['MEAN']
    }
  ];
  const values = metrics;
  return (
    <div className={locals.wrapper}>
      <div className={locals.resultInformation}>
        {totalGroups > 0 && <h3 className={locals.header}>{totalGroups} Groups</h3>}
      </div>
      <div className={locals.configurationWrapper}>
        {options.length > 0 && <MetricConfigurator values={values} options={options} onChange={onChangeMetrics} />}
        <SortingConfigurator
          options={[
            { value: 'firstTimestamp', label: 'Earliest Timestamp' },
            { value: 'calls_SUM_Agg', label: 'Count' }
          ]}
          orderBy={order}
          onChange={order => onChangeOrderBy(order)}
        />
      </div>
    </div>
  );
}

function ExpandedGroup({ group, tagFilterExpression, timeConfig, onChangeFilter, orderByCalls, onChangeOrderByCalls }) {
  return (
    <CallsList
      tagFilterExpression={tagFilterExpression}
      timeConfig={timeConfig}
      retrievalSize={20}
      numSkeletonRows={Math.min(group.metrics['calls_SUM_Agg'][0][1], 20)}
      filterBy={() => onChangeFilter([tagFilterExpression])}
      orderBy={orderByCalls}
      onChangeOrderBy={onChangeOrderByCalls}
    />
  );
}

function addTagFilters(tagFilterExpression, groupBy, group) {
  const tagFilter = {
    type: 'TAG_FILTER',
    operator: 'EQUALS',
    name: groupBy.groupbyTag,
    key: groupBy.groupbyTagSecondLevelKey,
    value: group
  };
  if (tagFilterExpression.type === 'EXPRESSION' && tagFilterExpression.elements.length === 0) {
    return tagFilter;
  }
  return {
    type: 'EXPRESSION',
    logicalOperator: 'AND',
    elements: [tagFilterExpression, tagFilter].filter(Boolean)
  };
}

const defaultMetrics = {
  calls_SUM_Agg: { metric: 'calls', aggregation: 'SUM' },
  calls_SUM: { metric: 'calls', aggregation: 'SUM', granularity: 60000 }
};

const convertMetricListToMetricObject = metrics =>
  metrics.reduce((obj, metric) => {
    if (metric.aggregation === 'SUM') {
      return {
        ...obj,
        [`${metric.metricId}_${metric.aggregation}_Agg'}`]: {
          metric: metric.metricId,
          aggregation: metric.aggregation
        }
      };
    } else {
      return {
        ...obj,
        [`${metric.metricId}_${metric.aggregation}`]: {
          metric: metric.metricId,
          aggregation: metric.aggregation,
          granularity: 60000
        }
      };
    }
  }, {});

const allMetrics = metrics => ({ ...defaultMetrics, ...convertMetricListToMetricObject(metrics) });
