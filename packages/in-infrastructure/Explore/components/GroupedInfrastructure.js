import React, { useCallback } from 'react';

import { average, getGranularity, getMetricKey, defaultFormatter } from 'in-infrastructure/Explore/services/metrics';
import { ColumnizedContent, Ul, Li, LoadingSkeletonLi, HorizontalIndicatorLi } from 'in-new-components/lists/List';
import InfrastructureList, { pagesLoaded } from 'in-infrastructure/Explore/components/InfrastructureList';
import { type as TAG_FILTER_TYPE } from 'in-new-components/QueryBuilder/transformation/tagFilter';
import { addTagFilters } from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import { joinExpressions } from 'in-new-components/QueryBuilder/transformation/formModel';
import { getUniqueErrors } from 'in-new-components/Errors/ErroneousResultPresenter';
import createGetGroupsSubscription from 'in-infrastructure/subscriptions/getGroups';
import { LOAD_MORE_CONTEXT } from 'in-infrastructure/Explore/services/tracking';
import { pluginTag, defaultOrder } from 'in-infrastructure/Explore/constants';
import { EQUALS } from 'in-new-components/QueryBuilder/tagFilter/operators';
import LoadMoreLi from 'in-new-components/lists/List/LoadMoreLi/LoadMoreLi';
import MetricLabel from 'in-infrastructure/Explore/components/MetricLabel';
import { getOptionalSnapshotDefinition } from 'in-sdk/snapshot/registry';
import NoDataAvailable from 'in-new-components/Errors/NoDataAvailable';
import { getLinkToExplore } from 'in-infrastructure/navigation/paths';
import Header from 'in-new-components/QueryBuilder/components/Header';
import { error as errorType } from 'in-new-components/Message/types';
import { indeterminateProgress } from 'in-services/fixedObjects';
import IconButton from 'in-new-components/IconButton/IconButton';
import useCursorPagination from 'in-hooks/useCursorPagination';
import KeyValue from 'in-new-components/lists/KeyValue';
import { emptyObject } from 'in-services/fixedObjects';
import SvgIcon from 'in-components/SvgIcon/SvgIcon';
import Tooltip from 'in-components/Tooltip/Tooltip';
import useTimeConfig from 'in-hooks/useTimeConfig';
import SparkChart from 'in-components/SparkChart';
import Message from 'in-new-components/Message';

import locals from './GroupedInfrastructure.mless';

export default function GroupedInfrastructure(props) {
  const { backendQueryModel, metrics, group, order, type } = props;
  const timeConfig = useTimeConfig();
  const retrievalSize = 20;

  const granularity = getGranularity(timeConfig);

  const cursorPaginatedProps = useCursorPagination(
    ({ cursor }) =>
      getGroups({ timeConfig, backendQueryModel, group, order, type, metrics, granularity, cursor, retrievalSize }),
    [timeConfig, backendQueryModel, group, order, type, metrics]
  );

  return (
    <Presenter
      backendQueryModel={backendQueryModel}
      granularity={granularity}
      timeConfig={timeConfig}
      retrievalSize={retrievalSize}
      {...cursorPaginatedProps}
      {...props}
    />
  );
}

function Presenter({
  totalRepresentedItemCount,
  tagFilterExpression,
  backendQueryModel,
  availableMetrics,
  canLoadMore,
  granularity,
  timeConfig,
  setMetrics,
  totalHits,
  setOrder,
  cursor,
  progress,
  metrics,
  errors,
  group,
  order,
  items,
  type,
  loadMore: defaultCursorPaginationLoadMore,
  retrievalSize,
  tracking
}) {
  const hasErrors = errors?.length > 0;
  const isLoading = progress?.loading;
  const getParamsForGroup = useCallback(
    item => ({
      group: emptyObject,
      tagFilterExpression: joinExpressions({ expressions: [tagFilterExpression, toTagFilters(item.tags)] })
    }),
    [tagFilterExpression]
  );
  const columnDefinitions = columns({
    groupBy: [group.groupbyTag],
    getParamsForGroup,
    granularity,
    timeConfig,
    metrics,
    type,
    onFocusOnGroup: tracking?.onFocusOnGroup
  });
  const groupSortOptions = group.groupbyTag
    ? [
        {
          label: group.groupbyTag,
          value: defaultOrder.by
        }
      ]
    : [];
  const sortOptions = groupSortOptions.concat(
    metrics.map(({ fullyQualifiedLabel, metric, aggregation }) => ({
      label: fullyQualifiedLabel,
      value: getMetricKey(metric, aggregation)
    }))
  );

  return (
    <>
      <Header
        totalRepresentedItemCount={totalRepresentedItemCount}
        availableMetrics={availableMetrics}
        sortOptions={sortOptions}
        setMetrics={setMetrics}
        totalHits={totalHits}
        setOrder={setOrder}
        metrics={metrics}
        itemName="Result"
        hitName="Group"
        order={order}
        tracking={tracking}
      />
      <Ul space="xsmall">
        {items.map((item, rowIndex) => (
          <Li
            key={rowIndex}
            noAlternatingBg
            borderRadius="medium"
            toggleContentOnRowClick
            highlightOpenState={false}
            tracking={{
              onToggleContentRow: isOpen =>
                isOpen ? tracking?.onGroupExpanded?.(item) : tracking?.onGroupCollapsed?.(item)
            }}
            renderNestedContent={() => (
              <ExpandedGroup
                backendQueryModel={backendQueryModel}
                availableMetrics={availableMetrics}
                timeConfig={timeConfig}
                metrics={metrics}
                order={order}
                group={item}
                type={type}
                tracking={tracking}
              />
            )}
          >
            <ColumnizedContent columnDefinitions={columnDefinitions} group={item} />
          </Li>
        ))}
        {isLoading && <HorizontalIndicatorLi progress={indeterminateProgress} />}
        {isLoading && <LoadingSkeletonLi />}
        {hasErrors &&
          getUniqueErrors(errors).map(error => (
            <Li key={error}>
              <Message className={locals.message} type={errorType} small>
                {error}
              </Message>
            </Li>
          ))}
        {canLoadMore && (
          <LoadMoreLi
            loadMore={() => {
              defaultCursorPaginationLoadMore();
              tracking?.onLoadMore?.(pagesLoaded(cursor?.offset, retrievalSize), LOAD_MORE_CONTEXT.GROUPS);
            }}
          />
        )}
      </Ul>
      {!isLoading && items.length === 0 && <NoDataAvailable height={240} />}
    </>
  );
}

function columns({ groupBy, type, getParamsForGroup, metrics, timeConfig, granularity, onFocusOnGroup }) {
  const snapshotDefinition = getOptionalSnapshotDefinition(type);
  const countLabel = snapshotDefinition ? snapshotDefinition.pluginName.plural : 'Count';
  return [
    {
      width: '3rem',
      getContent({ group }) {
        const icon = getGroupIcon(group);
        return <SvgIcon type={icon} />;
      }
    }
  ]
    .concat(
      groupBy.map((groupKey, i) => ({
        width: getColumnWidth(groupBy, i),
        getContent({ group }) {
          const value = getGroupTagValue(group, groupKey);
          return <KeyValue label={groupKey} value={value} accentuated />;
        }
      }))
    )
    .concat([
      {
        width: '8rem',
        getContent({ group }) {
          return <KeyValue label={countLabel} value={group.count} theme="blue" accentuated />;
        }
      }
    ])
    .concat(
      metrics.map(({ label, metric, formatter = defaultFormatter, aggregation, percentageMetric }) => ({
        width: '12rem',
        getContent({ group }) {
          const kpi = average(group.metrics[getMetricKey(metric, aggregation)]);
          const renderedLabel = <MetricLabel label={label} />;
          return (
            <SparkChart
              horizontalMetricValue={kpi !== undefined ? formatter(kpi) : '--'}
              percentageMetric={percentageMetric}
              metrics={group.metrics[getMetricKey(metric, aggregation)]}
              tooltipFormatter={formatter}
              aggregation={aggregation}
              timeConfig={timeConfig}
              rollup={granularity}
              label={renderedLabel}
            />
          );
        }
      }))
    )
    .concat([
      {
        width: '3rem',
        getContent({ group }) {
          return (
            <Tooltip content="Focus on this group">
              <IconButton
                type="lib_actions_filter"
                href$={getLinkToExplore(getParamsForGroup(group))}
                onClick={() => onFocusOnGroup?.(group)}
              />
            </Tooltip>
          );
        }
      }
    ]);
}

function getColumnWidth(groupBy, index) {
  if (index !== groupBy.length - 1) {
    return 50 / groupBy.length + 'rem';
  }
}

function getGroups({ timeConfig, backendQueryModel, group, cursor, type, order, metrics, granularity, retrievalSize }) {
  return createGetGroupsSubscription({
    filter: {
      timeConfig,
      tagFilterExpression: backendQueryModel
    },
    pagination: {
      cursor,
      retrievalSize
    },
    groupBy: [group.groupbyTag],
    type,
    metrics: Object.fromEntries(
      metrics.flatMap(({ metric, aggregation }) => [
        [
          getMetricKey(metric, aggregation),
          {
            metric,
            granularity,
            aggregation
          }
        ]
      ])
    ),
    order
  });
}

function ExpandedGroup({ group, backendQueryModel, timeConfig, type, metrics, availableMetrics, order, tracking }) {
  const numberOfEntitiesPerGroup = 20;
  return (
    <InfrastructureList
      backendQueryModel={addTagsToBackendModel(backendQueryModel, group.tags)}
      numSkeletonRows={Math.min(group.count, numberOfEntitiesPerGroup)}
      retrievalSize={numberOfEntitiesPerGroup}
      availableMetrics={availableMetrics}
      timeConfig={timeConfig}
      metrics={metrics}
      order={order}
      type={type}
      tracking={{
        onNavigateToEntity: tracking?.onNavigateToEntity,
        onLoadMore: page => tracking?.onLoadMore?.(page, LOAD_MORE_CONTEXT.ENTITIES_IN_GROUP)
      }}
    />
  );
}

function addTagsToBackendModel(backendQueryModel, tags) {
  return addTagFilters(backendQueryModel, toTagFilters(tags));
}

function toTagFilters(tags) {
  return Object.entries(tags).map(([key, value]) => ({
    type: TAG_FILTER_TYPE,
    operator: EQUALS,
    name: key,
    value
  }));
}

const defaultGroupIcon = 'lib_views_tag';

function getGroupPlugin(group) {
  const plugin = group.tags[pluginTag];
  return plugin ? getOptionalSnapshotDefinition(plugin) : null;
}

function getGroupIcon(group) {
  const plugin = getGroupPlugin(group);
  return plugin ? `plugin:${plugin.plugin}` : defaultGroupIcon;
}

function getGroupTagValue(group, key) {
  if (key === pluginTag) {
    const plugin = getGroupPlugin(group);
    return plugin && plugin.pluginName ? plugin.pluginName.singular : group.tags[key];
  } else {
    return group.tags[key];
  }
}
