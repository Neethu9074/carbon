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

import MetricCatalogAndSortingConfigurator from 'in-infrastructure/components/MetricCatalogAndSortingConfigurator/MetricCatalogAndSortingConfigurator';
import { formatCsvColumnName, formatCsvColumnValue } from 'in-infrastructure/Explore/services/MetricCsvColumnFormatter';
import { firstValue, getGranularity, getMetricKey, getMetricValue, getSeriesKey } from 'in-infrastructure/Explore/services/metrics';
import InfrastructureList, { pagesLoaded } from 'in-infrastructure/Explore/components/InfrastructureList';
import { useLinkToExplore as useLinkToInfraEntityExplore } from 'in-infrastructure/navigation/paths';
import { type as TAG_FILTER_TYPE } from 'in-components/QueryBuilder/transformation/tagFilter';
import { addTagFilters } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { default as MetricLabel } from 'in-infrastructure/Explore/components/MetricLabel';
import { joinExpressions } from 'in-components/QueryBuilder/transformation/formModel';
import createGetGroupsSubscription from 'in-infrastructure/subscriptions/getGroups';
import { LOAD_MORE_CONTEXT } from 'in-infrastructure/Explore/services/tracking';
import { emptyArray, indeterminateProgress } from 'in-services/fixedObjects';
import { defaultOrder, typeTag } from 'in-infrastructure/Explore/constants';
import { getOptionalSnapshotDefinition } from 'in-sdk/snapshot/registry';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable';
import Header from 'in-components/QueryBuilder/components/Header';
import useCursorPagination from 'in-hooks/useCursorPagination';
import IconLink from 'in-components/IconButton/IconLink';
import Tooltip from 'in-components/Tooltip/Tooltip';
import CsvExporter from 'in-components/CsvExporter';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { getPluginName } from 'in-sdk/pluginName';
import { mapData } from 'in-services/util/result';
import SparkChart from 'in-components/SparkChart';
import { t } from 'in-i18n';

import locals from './GroupedInfrastructure.mless';

export default function GroupedInfrastructure(props) {
  const { backendQueryModel, metrics, groupBy, backendGroupBy, order, type } = props;
  const timeConfig = useTimeConfig();
  const retrievalSize = 20;

  const granularity = getGranularity(timeConfig);

  const cursorPaginatedProps = useCursorPagination(
    ({ cursor }) =>
      getGroups({
        timeConfig,
        backendQueryModel,
        groupBy: backendGroupBy,
        order,
        type,
        metrics,
        granularity,
        cursor,
        retrievalSize
      }),
    [timeConfig, backendQueryModel, backendGroupBy, order, type, metrics]
  );

  return (
    <Presenter
      backendQueryModel={backendQueryModel}
      groupBy={groupBy}
      backendGroupBy={backendGroupBy}
      retrievalSize={retrievalSize}
      granularity={granularity}
      timeConfig={timeConfig}
      {...cursorPaginatedProps}
      {...props}
    />
  );
}

function Presenter({
  totalRepresentedItemCount,
  totalRetainedItemCount,
  tagFilterExpression,
  backendQueryModel,
  backendGroupBy,
  canLoadMore,
  granularity,
  timeConfig,
  setMetrics,
  totalHits,
  setOrder,
  groupBy,
  cursor,
  progress,
  metrics,
  metricMetadatas,
  errors,
  order,
  items,
  type,
  loadMore: defaultCursorPaginationLoadMore,
  retrievalSize,
  tracking,
  metricCatalog,
  query,
  onQueryChange
}) {
  const getLinkToInfraEntityExplore = useLinkToInfraEntityExplore();
  const hasErrors = errors?.length > 0;
  const isLoading = progress?.loading;
  const getParamsForGroup = useCallback(
    item => ({
      groupBy: emptyArray,
      tagFilterExpression: joinExpressions({
        expressions: [tagFilterExpression, joinExpressions({ expressions: toTagFilters(item.tags, groupBy) })]
      })
    }),
    [tagFilterExpression, groupBy]
  );
  const columnDefinitions = columns({
    groupBy: backendGroupBy,
    getParamsForGroup,
    granularity,
    timeConfig,
    metrics,
    type,
    onFocusOnGroup: tracking?.onFocusOnGroup,
    metricMetadatas,
    getLinkToInfraEntityExplore
  });
  const groupSortOptions = [
    {
      label: backendGroupBy[0],
      value: defaultOrder.by
    }
  ];
  const sortOptions = groupSortOptions.concat(
    mapData(metricMetadatas, metadatas => {
      return metrics.map(({ metric, aggregation, crossSeriesAggregation }) => {
        return {
          label: `${metadatas[metric].label} (${aggregation})`,
          value: getMetricKey(metric, aggregation, crossSeriesAggregation)
        };
      });
    }).data || []
  );

  return (
    <>
      <Header
        totalRepresentedItemCount={totalRepresentedItemCount}
        totalRetainedItemCount={totalRetainedItemCount}
        hasErrors={hasErrors}
        isLoading={isLoading}
        sortOptions={sortOptions}
        setMetrics={setMetrics}
        totalHits={totalHits}
        withGrouping
        withResultsInGroups
        setOrder={setOrder}
        metrics={metrics}
        metricMetadatas={metricMetadatas}
        order={order}
        tracking={tracking}
        type={type}
        CustomHeaderActions={getHeaderActions}
        backendQueryModel={backendQueryModel}
        metricCatalog={metricCatalog}
        query={query}
        onQueryChange={onQueryChange}
        items={items}
        timeConfig={timeConfig}
        cursor={cursor}
        columns={columnDefinitions}
        granularity={granularity}
        groupBy={backendGroupBy}
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
                timeConfig={timeConfig}
                metrics={metrics}
                order={order}
                group={item}
                type={type}
                metricMetadatas={metricMetadatas}
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
          getErrorMessage(errors).map(error => (
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

function columns({
  groupBy,
  type,
  getParamsForGroup,
  metrics,
  timeConfig,
  granularity,
  onFocusOnGroup,
  metricMetadatas,
  getLinkToInfraEntityExplore
}) {
  const snapshotDefinition = getOptionalSnapshotDefinition(type);
  const countLabel = snapshotDefinition ? getPluginName(type, 2) : 'Count';
  const cols = [
    {
      width: '3rem',
      getContent({ group }) {
        const icon = getGroupIcon(group);
        return <SvgIcon type={icon} />;
      },
      getId() {
        return 'icon';
      }
    }
  ]
    .concat(
      groupBy.map((groupKey, i) => ({
        width: getColumnWidth(groupBy, i),
        getContent({ group }) {
          const value = getGroupTagValue(group, groupKey);
          return <KeyValue label={groupKey} value={value} accentuated />;
        },
        getId() {
          return groupKey;
        }
      }))
    )
    .concat([
      {
        width: '8rem',
        getContent({ group }) {
          return <KeyValue label={countLabel} value={group.count} theme="blue" accentuated />;
        },
        getId() {
          return countLabel;
        },
        getType() {
          return 'count';
        }
      }
    ])
    .concat(
      metrics.map(({ metric, aggregation, crossSeriesAggregation }) => ({
        width: '12rem',
        getContent({ group }) {
          const id = getMetricKey(metric, aggregation, crossSeriesAggregation);
          const metadata = mapData(metricMetadatas, data => data[metric]);
          const label = mapData(metadata, data => data?.label);
          const renderedLabel = <MetricLabel label={label} aggregation={aggregation} />;
          const formatter = mapData(metadata, data => data?.formatter).data;
          const kpi = firstValue(group.metrics[id]);
          const series = group.metrics[getSeriesKey(id)];
          const percentageMetric = mapData(metadata, data => data?.percentageMetric).data;
          return (
            <SparkChart
              horizontalMetricValue={getMetricValue(kpi, formatter)}
              percentageMetric={percentageMetric}
              tooltipFormatter={formatter}
              aggregation={aggregation}
              timeConfig={timeConfig}
              label={renderedLabel}
              rollup={granularity}
              metrics={series}
            />
          );
        },
        getId() {
          return getMetricKey(metric, aggregation);
        },
        getColumnLabel() {
          const metadata = mapData(metricMetadatas, data => data[metric]);
          const label = mapData(metadata, data => data?.label);
          const formatter = mapData(metadata, data => data?.formatter).data;
          return formatCsvColumnName(label['data'], aggregation, formatter);
        },
        getFormatter() {
          const metadata = mapData(metricMetadatas, data => data[metric]);
          const formatter = mapData(metadata, data => data?.formatter).data;
          return formatter;
        },
        exported: true
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
                href={getLinkToInfraEntityExplore(getParamsForGroup(group))}
                onClick={() => onFocusOnGroup?.(group)}
              />
            </Tooltip>
          );
        },
        getId() {
          return 'focusOnGroup';
        }
      }
    ]);

  return cols;
}

function getErrorMessage(errors) {
  if (errors[0].message?.includes('more than the maximum number of groups')) {
    return [t('in-infrastructure:explore.errors.maximumNumberOfGroups')];
  }

  return [t('in-infrastructure:explore.errors.generalError')];
}

function getColumnWidth(groupBy, i) {
  return 30 / groupBy.length + (i === groupBy.length - 1 ? 3 : 0) + 'rem';
}

function getGroups({
  timeConfig,
  backendQueryModel,
  groupBy,
  cursor,
  type,
  order,
  metrics,
  retrievalSize,
  granularity,
  fullData = false
}) {
  return createGetGroupsSubscription({
    filter: {
      timeConfig,
      tagFilterExpression: backendQueryModel
    },
    pagination: {
      cursor,
      retrievalSize,
      fullData
    },
    groupBy,
    type,
    metrics: Object.fromEntries(
      metrics
        .filter(({ metric }) => metric !== undefined && metric !== null)
        .flatMap(({ metric, aggregation, crossSeriesAggregation }) => {
          const id = getMetricKey(metric, aggregation, crossSeriesAggregation);
          const kpiGranularity = timeConfig.windowSize;
          return [
            [
              id,
              {
                metric,
                granularity: kpiGranularity,
                aggregation,
                crossSeriesAggregation
              }
            ],
            [
              getSeriesKey(id),
              {
                metric,
                granularity,
                aggregation,
                crossSeriesAggregation
              }
            ]
          ];
        })
    ),
    order
  });
}

function ExpandedGroup({ group, backendQueryModel, timeConfig, type, metrics, order, tracking, metricMetadatas }) {
  const numberOfEntitiesPerGroup = 20;
  return (
    <InfrastructureList
      backendQueryModel={addTagsToBackendModel(backendQueryModel, group.tags)}
      numSkeletonRows={Math.min(group.count, numberOfEntitiesPerGroup)}
      retrievalSize={numberOfEntitiesPerGroup}
      timeConfig={timeConfig}
      metrics={metrics}
      order={order}
      type={type}
      metricMetadatas={metricMetadatas}
      tracking={{
        onNavigateToEntity: tracking?.onNavigateToEntity,
        onLoadMore: page => tracking?.onLoadMore?.(page, LOAD_MORE_CONTEXT.ENTITIES_IN_GROUP)
      }}
      displayChart={false}
    />
  );
}

function addTagsToBackendModel(backendQueryModel, tags) {
  return addTagFilters(backendQueryModel, toTagFilters(tags));
}

export function toTagFilters(tags, tagType, groupBy) {
  return Object.entries(tags).map(([tag, value]) => ({
    type: TAG_FILTER_TYPE,
    operator: EQUALS,
    name: getName(tag, groupBy),
    key: getKey(tag, groupBy),
    value
  }));
}

export function toBackendGroupBy(groupBy) {
  return groupBy?.filter(g => g?.groupbyTag).map(g => toGroupTag(g));
}

function toGroupTag(group) {
  return group?.groupbyTagSecondLevelKey ? group.groupbyTag + '.' + group.groupbyTagSecondLevelKey : group.groupbyTag;
}

const defaultGroupIcon = 'lib_views_tag';

function getGroupByTag(tag, groupBy) {
  return groupBy?.find(group => toGroupTag(group) === tag);
}

function getName(tag, groupBy) {
  const group = getGroupByTag(tag, groupBy);
  return group ? group.groupbyTag : tag;
}

function getKey(tag, groupBy) {
  return getGroupByTag(tag, groupBy)?.groupbyTagSecondLevelKey;
}

function getGroupPlugin(group) {
  const plugin = group.tags[typeTag];
  return plugin ? getOptionalSnapshotDefinition(plugin) : null;
}

export function getGroupIcon(group) {
  const plugin = getGroupPlugin(group);
  return plugin ? `lib_infra_${plugin.plugin}` : defaultGroupIcon;
}

export function getGroupTagValue(group, key) {
  if (key === typeTag) {
    const plugin = getGroupPlugin(group);
    return plugin ? getPluginName(group.tags[typeTag]) : group.tags[key];
  } else {
    return group.tags[key];
  }
}

function processData(items, columns) {
  let csvRows = [];
  items?.forEach(item => {
    let row = {};
    Object.keys(item.tags).forEach(tagKey => (row[tagKey] = item.tags[tagKey]));

    columns.forEach(col => {
      if (col.getType !== undefined && col.getType() === 'count') {
        row[col.getId()] = item.count;
      }
    });

    columns.forEach(col => {
      let found = false;
      Object.keys(item.metrics ?? {}).forEach(metric => {
        if (metric === col.getId()) {
          row[col.getColumnLabel()] = formatCsvColumnValue(col.getFormatter(), firstValue(item.metrics[metric]));
          found = true;
        }
      });
      if (!found && col.exported) {
        row[col.getColumnLabel()] = '-';
      }
    });
    csvRows.push(row);
  });

  return csvRows;
}

function getHeaderActions(props) {
  if (props.type === null) {
    // no sorting and grouping for All Infrastructure
    return <></>;
  }

  const timeConfig = props.timeConfig;
  const backendQueryModel = props.backendQueryModel;
  const order = props.order;
  const type = props.type;
  const metrics = props.metrics;
  const cursor = props.cursor;
  const columns = props.columns;
  const granularity = props.granularity;
  const groupBy = props.groupBy;
  const csvFileName = 'group_entites_' + type + '.csv';

  const getAllData = ({ cursor }) =>
    getGroups({
      timeConfig,
      backendQueryModel,
      groupBy,
      order,
      type,
      metrics,
      granularity,
      cursor,
      retrievalSize: 10000,
      fullData: true
    });

  return (
    <>
      <CsvExporter
        processData={processData}
        fetchData={getAllData}
        fileName={csvFileName}
        columns={columns}
        cursor={cursor}
      />
      <MetricCatalogAndSortingConfigurator {...props} />
    </>
  );
}
