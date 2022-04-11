/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useCallback } from 'react';

import {
  ColumnizedContent,
  KeyValue,
  Li,
  LiHorizontalIndicator,
  LiLoadingSkeleton,
  LiLoadMore,
  Message,
  SvgIcon,
  Ul
} from '@instana/components';

import { average, defaultFormatter, getGranularity, getMetricKey } from 'in-infrastructure/Explore/services/metrics';
import InfrastructureList, { pagesLoaded } from 'in-infrastructure/Explore/components/InfrastructureList';
import { type as TAG_FILTER_TYPE } from 'in-components/QueryBuilder/transformation/tagFilter';
import { addTagFilters } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { joinExpressions } from 'in-components/QueryBuilder/transformation/formModel';
import createGetGroupsSubscription from 'in-infrastructure/subscriptions/getGroups';
import { getUniqueErrors } from 'in-components/Errors/ErroneousResultPresenter';
import { LOAD_MORE_CONTEXT } from 'in-infrastructure/Explore/services/tracking';
import { defaultOrder, pluginTag } from 'in-infrastructure/Explore/constants';
import { emptyObject, indeterminateProgress } from 'in-services/fixedObjects';
import MetricLabel from 'in-infrastructure/Explore/components/MetricLabel';
import { getOptionalSnapshotDefinition } from 'in-sdk/snapshot/registry';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import { getLinkToExplore } from 'in-infrastructure/navigation/paths';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable';
import Header from 'in-components/QueryBuilder/components/Header';
import useCursorPagination from 'in-hooks/useCursorPagination';
import IconLink from 'in-components/IconButton/IconLink';
import Tooltip from 'in-components/Tooltip/Tooltip';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { getPluginName } from 'in-sdk/pluginName';
import SparkChart from 'in-components/SparkChart';
import { t } from 'in-i18n';

import locals from './GroupedInfrastructure.mless';

export default function GroupedInfrastructure(props) {
  const { backendQueryModel, metrics, group, order, type } = props;
  const timeConfig = useTimeConfig();
  const retrievalSize = 20;

  const granularity = getGranularity(timeConfig);
  const tagType = group?.tagType;
  const fullQualifiedGroup = group.groupbyTagSecondLevelKey
    ? group.groupbyTag + '.' + group.groupbyTagSecondLevelKey
    : group.groupbyTag;

  const cursorPaginatedProps = useCursorPagination(
    ({ cursor }) =>
      getGroups({
        timeConfig,
        backendQueryModel,
        group: fullQualifiedGroup,
        order,
        type,
        metrics,
        granularity,
        cursor,
        retrievalSize
      }),
    [timeConfig, backendQueryModel, fullQualifiedGroup, order, type, metrics]
  );

  return (
    <Presenter
      backendQueryModel={backendQueryModel}
      fullQualifiedGroup={fullQualifiedGroup}
      retrievalSize={retrievalSize}
      granularity={granularity}
      timeConfig={timeConfig}
      tagType={tagType}
      {...cursorPaginatedProps}
      {...props}
    />
  );
}

function Presenter({
  totalRepresentedItemCount,
  totalRetainedItemCount,
  tagFilterExpression,
  fullQualifiedGroup,
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
  order,
  items,
  type,
  loadMore: defaultCursorPaginationLoadMore,
  retrievalSize,
  tracking,
  tagType,
  group
}) {
  const hasErrors = errors?.length > 0;
  const isLoading = progress?.loading;
  const getParamsForGroup = useCallback(
    item => ({
      group: emptyObject,
      tagFilterExpression: joinExpressions({
        expressions: [tagFilterExpression, toTagFilters(item.tags, tagType, group)]
      })
    }),
    [tagFilterExpression]
  );
  const columnDefinitions = columns({
    groupBy: [fullQualifiedGroup],
    getParamsForGroup,
    granularity,
    timeConfig,
    metrics,
    type,
    onFocusOnGroup: tracking?.onFocusOnGroup
  });
  const groupSortOptions = fullQualifiedGroup
    ? [
        {
          label: fullQualifiedGroup,
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
        totalRetainedItemCount={totalRetainedItemCount}
        hasErrors={hasErrors}
        isLoading={isLoading}
        availableMetrics={availableMetrics}
        sortOptions={sortOptions}
        setMetrics={setMetrics}
        totalHits={totalHits}
        withGrouping
        withResultsInGroups
        setOrder={setOrder}
        metrics={metrics}
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
        {isLoading && <LiHorizontalIndicator progress={indeterminateProgress} />}
        {isLoading && <LiLoadingSkeleton />}
        {hasErrors &&
          getUniqueErrors(errors).map(error => (
            <Li key={error}>
              <Message className={locals.message} type="error" small>
                {error}
              </Message>
            </Li>
          ))}
        {canLoadMore && (
          <LiLoadMore
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
  const countLabel = snapshotDefinition ? getPluginName(type, 2) : 'Count';
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
            <Tooltip content={t('in-infrastructure:explore.focusOnThisGroup')}>
              <IconLink
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
    groupBy: [group],
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

function toTagFilters(tags, tagType, group) {
  return Object.entries(tags).map(([name, value]) => ({
    type: TAG_FILTER_TYPE,
    operator: EQUALS,
    name: getName(name, group),
    value: getValue(tagType, value),
    key: getKey(tagType, value, name, group)
  }));
}

const defaultGroupIcon = 'lib_views_tag';

function isTagAndKeyConcat(name, group) {
  return group.groupbyTag.concat('.', group.groupbyTagSecondLevelKey) === name;
}

function isKeyValue(tagType) {
  return tagType !== undefined && 'KEY_VALUE_PAIR' === tagType;
}

function getName(name, group) {
  return isTagAndKeyConcat(name, group) ? group.groupbyTag : name;
}

function getValue(tagType, value) {
  return isKeyValue(tagType) ? extractValue(value) : value;
}

function getKey(tagType, value, name, group) {
  if (isTagAndKeyConcat(name, group)) {
    return group.groupbyTagSecondLevelKey;
  }
  if (isKeyValue(tagType)) {
    return extractKey(value, name, group);
  }
  return undefined;
}

function extractKey(value) {
  let index = value.indexOf('=');
  if (index > 0) {
    return value.substring(0, index);
  }
  return undefined;
}

function extractValue(str) {
  let index = str.indexOf('=');
  if (index > 0) {
    return str.substring(index + 1);
  }
  return str;
}

function getGroupPlugin(group) {
  const plugin = group.tags[pluginTag];
  return plugin ? getOptionalSnapshotDefinition(plugin) : null;
}

function getGroupIcon(group) {
  const plugin = getGroupPlugin(group);
  return plugin ? `lib_infra_${plugin.plugin}` : defaultGroupIcon;
}

function getGroupTagValue(group, key) {
  if (key === pluginTag) {
    const plugin = getGroupPlugin(group);
    return plugin ? getPluginName(group.tags[pluginTag]) : group.tags[key];
  } else {
    return group.tags[key];
  }
}
