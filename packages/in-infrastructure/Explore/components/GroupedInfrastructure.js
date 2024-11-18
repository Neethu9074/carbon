/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useEffect, useCallback, useMemo } from 'react';
import { isEqual } from 'lodash';

import {
  ColumnizedContent,
  KeyValue,
  Li,
  LiHorizontalIndicator,
  LiLoadingSkeleton,
  LiLoadMore,
  SvgIcon,
  Ul,
  IconButton
} from '@instana/components';
import { just } from '@instana/observables';

import {
  firstValue,
  getConvertedSeries,
  getGranularity,
  getMetricFormatterFromUnitOrDefault,
  getMetricKey,
  getMetricValue,
  getSeriesKey,
  lastValueForMetric
} from 'in-infrastructure/Explore/services/metrics';
import MetricCatalogAndSortingConfigurator from 'in-infrastructure/components/MetricCatalogAndSortingConfigurator/MetricCatalogAndSortingConfigurator';
import { formatCsvColumnName, formatCsvColumnValue } from 'in-infrastructure/Explore/services/MetricCsvColumnFormatter';
import InfrastructureList, { pagesLoaded } from 'in-infrastructure/Explore/components/InfrastructureList';
import { useLinkToExplore as useLinkToInfraEntityExplore } from 'in-infrastructure/navigation/paths';
import { getLastValueTooltipLabel } from 'in-custom-dashboards/widgets/_shared/lastTimeConfig';
import { type as TAG_FILTER_TYPE } from 'in-components/QueryBuilder/transformation/tagFilter';
import { extremeValueInSeries, getThresholdColors } from 'in-components/Threshold/threshold';
import { addTagFilters } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { emptyArray, indeterminateProgress, pendingResult } from 'in-services/fixedObjects';
import { EQUALS, IS_BLANK, IS_EMPTY } from 'in-components/QueryBuilder/tagFilter/operators';
import { default as MetricLabel } from 'in-infrastructure/Explore/components/MetricLabel';
import CursorPaginatedTable from 'in-components/tables/ServerTable/CursorPaginatedTable';
import { fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
import { joinExpressions } from 'in-components/QueryBuilder/transformation/formModel';
import { typeTag, tag_not_present_group } from 'in-infrastructure/Explore/constants';
import ThresholdTooltip from 'in-infrastructure/Explore/components/ThresholdTooltip';
import createGetGroupsSubscription from 'in-infrastructure/subscriptions/getGroups';
import { LOAD_MORE_CONTEXT } from 'in-infrastructure/Explore/services/tracking';
import LiErrorList from 'in-infrastructure/Explore/components/LiErrorList';
import { getOptionalSnapshotDefinition } from 'in-sdk/snapshot/registry';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable';
import Header from 'in-components/QueryBuilder/components/Header';
import useCursorPagination from 'in-hooks/useCursorPagination';
import { carbonTableEnabled } from 'in-services/featureFlags';
import { getBaseUnit, getUnit } from 'in-stores/metric/units';
import { fixOrderForBackwardsCompatibility } from '../utils';
import { getFormatter } from 'in-stores/metric/formatters';
import Tooltip from 'in-components/Tooltip/Tooltip';
import CsvExporter from 'in-components/CsvExporter';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { getPluginName } from 'in-sdk/pluginName';
import { mapData } from 'in-services/util/result';
import SparkChart from 'in-components/SparkChart';
import usePrevious from 'in-hooks/usePrevious';
import { t } from 'in-i18n';

import locals from './GroupedInfrastructure.mless';

export default function GroupedInfrastructure(props) {
  const {
    backendQueryModel,
    metrics,
    groupBy,
    backendGroupBy,
    order: incomingOrder,
    type,
    isPreview = false,
    isHeaderVisible = true,
    isTableMode = false,
    isLoadMoreEnabled = true,
    isCounterVisible = true,
    fixedLayout = true,
    retrievalSize = 20,
    getTotalItems,
    onItemClicked,
    showGroupsWithMissingTags
  } = props;

  const previousMetrics = usePrevious(metrics);
  const timeConfig = useTimeConfig();
  const granularity = getGranularity(timeConfig);
  const dependencies = getDependencies({
    isPreview,
    isCounterVisible,
    isTableMode,
    retrievalSize,
    hasMetricsChanged: !isEqual(previousMetrics, metrics),
    metrics
  });
  const order = useMemo(() => fixOrderForBackwardsCompatibility(incomingOrder, metrics), [incomingOrder, metrics]);

  const { totalHits, ...cursorPaginatedProps } = useCursorPagination(
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
        retrievalSize,
        missingPlaceholder: showGroupsWithMissingTags ? tag_not_present_group : undefined
      }),
    [timeConfig, backendQueryModel, backendGroupBy, order, type, showGroupsWithMissingTags, ...dependencies]
  );

  const hasTagNotPresent = cursorPaginatedProps?.items?.some(({ tags }) =>
    Object.values(tags).some(value => value === tag_not_present_group)
  );

  // Send totalHits
  useEffect(() => {
    if (totalHits) {
      const isShowingGroupsWithMissingTags = showGroupsWithMissingTags && hasTagNotPresent;
      getTotalItems?.(isShowingGroupsWithMissingTags ? totalHits + 1 : totalHits);
    }
  }, [getTotalItems, hasTagNotPresent, showGroupsWithMissingTags, totalHits]);

  return (
    <Presenter
      backendQueryModel
      groupBy={groupBy}
      backendGroupBy={backendGroupBy}
      retrievalSize={retrievalSize}
      granularity={granularity}
      timeConfig={timeConfig}
      isHeaderVisible={isHeaderVisible}
      isTableMode={isTableMode}
      onItemClicked={onItemClicked}
      isLoadMoreEnabled={isLoadMoreEnabled}
      isCounterVisible={isCounterVisible}
      totalHits={totalHits}
      fixedLayout={fixedLayout}
      {...cursorPaginatedProps}
      {...props}
      order={order}
    />
  );
}

function Presenter({
  totalRepresentedItemCount,
  totalRetainedItemCount,
  backendQueryModel,
  backendGroupBy,
  canLoadMore,
  granularity,
  timeConfig,
  setMetrics,
  totalHits,
  setOrder,
  cursor,
  isHeaderVisible,
  isTableMode,
  isLoadMoreEnabled,
  isCounterVisible,
  fixedLayout,
  onItemClicked,
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
    item => {
      return {
        groupBy: emptyArray,
        tagFilterExpression: joinExpressions({
          expressions: [fromBackendModel(backendQueryModel), joinExpressions({ expressions: toTagFilters(item.tags) })]
        })
      };
    },
    [backendQueryModel]
  );

  const columnDefinitions = columns({
    groupBy: backendGroupBy,
    getParamsForGroup,
    isTableMode,
    isCounterVisible,
    onItemClicked,
    granularity,
    timeConfig,
    metrics,
    type,
    onFocusOnGroup: tracking?.onFocusOnGroup,
    metricMetadatas,
    getLinkToInfraEntityExplore
  });

  const groupSortOptions = backendGroupBy.map(groupBy => ({
    label: groupBy,
    value: groupBy
  }));

  const sortOptions = groupSortOptions.concat(
    mapData(metricMetadatas, metadatas => {
      return metrics.map(({ metric, aggregation, crossSeriesAggregation }) => {
        return {
          label: `${metadatas[metric]?.label ?? metric} (${aggregation})`,
          value: getMetricKey(metric, aggregation, crossSeriesAggregation)
        };
      });
    }).data || []
  );

  return (
    <>
      {isHeaderVisible && (
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
      )}

      {isTableMode && !hasErrors && items.length > 0 ? (
        <CursorPaginatedTable
          columnDefinitions={columnDefinitions}
          numSkeletonRows={retrievalSize}
          totalHits={totalHits}
          onChange={({ orderBy, orderDirection }) => setOrder({ by: orderBy, direction: orderDirection })}
          progress={progress}
          canLoadMore={canLoadMore}
          items={items}
          orderBy={order.by}
          orderDirection={order.direction}
          isSearchable={false}
          defaultPageSize={retrievalSize}
          defaultOrderDirection={order.direction}
          onRowClick={item => {
            const href = getLinkToInfraEntityExplore({ type, group: {}, metrics, ...getParamsForGroup(item) }).slice(2);
            onItemClicked(href);
          }}
          fixedLayout={fixedLayout}
          size="compact"
        />
      ) : (
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
          {hasErrors && <LiErrorList errors={errors} />}
          {canLoadMore && isLoadMoreEnabled && (
            <LiLoadMore
              loadMore={() => {
                defaultCursorPaginationLoadMore();
                tracking?.onLoadMore?.(pagesLoaded(cursor?.offset, retrievalSize), LOAD_MORE_CONTEXT.GROUPS);
              }}
            />
          )}
        </Ul>
      )}
      {!isLoading && items.length === 0 && <NoDataAvailable height={240} />}
    </>
  );
}

function columns({
  groupBy,
  type,
  getParamsForGroup,
  isTableMode,
  isCounterVisible,
  metrics,
  timeConfig,
  granularity,
  onFocusOnGroup,
  metricMetadatas,
  getLinkToInfraEntityExplore
}) {
  const snapshotDefinition = getOptionalSnapshotDefinition(type);
  const countLabel = snapshotDefinition ? getPluginName(type, 2) : 'Count';

  const iconColumn = {
    width: carbonTableEnabled ? '2.5rem' : '3rem',
    id: 'icon',
    getId: () => 'icon',
    widthInAbsoluteUnit: true,
    sortable: false,
    verticallyCenter: true,
    ...(isTableMode
      ? {
          getContent(item) {
            const icon = getGroupIcon(item);
            return <SvgIcon type={icon} className={locals.icon} />;
          }
        }
      : {
          getContent({ group }) {
            const icon = getGroupIcon(group);
            return <SvgIcon type={icon} />;
          }
        })
  };

  const groupKeyLabel = groupKey => {
    if (carbonTableEnabled) {
      return (
        <Tooltip content={groupKey} align="auto">
          <bdi className={locals.bdi}>
            <div className={locals.carbonHeaderEllipsis}>{groupKey}</div>
          </bdi>
        </Tooltip>
      );
    }
    return groupKey;
  };

  const groupsColumn = groupBy.map(groupKey => {
    return {
      width: getColumnWidth(groupBy, metrics, isTableMode),
      getId: () => groupKey,
      id: groupKey,
      cellClassName: locals.wordBreak,
      headCellProps: {
        className: locals.wordBreak
      },
      ...(isTableMode
        ? {
            sortable: true,
            // need to add some css style changes for carbon table
            label: groupKeyLabel(groupKey),
            getContent(item) {
              // need to modify the styles for carbon table to render the content in the right format
              if (carbonTableEnabled) {
                return <div className={locals.carbonRowWordBreak}>{getGroupTagValue(item, groupKey)}</div>;
              }
              return getGroupTagValue(item, groupKey);
            }
          }
        : {
            getContent({ group }) {
              const value = getGroupTagValue(group, groupKey);

              return <KeyValue label={groupKey} value={value} accentuated />;
            }
          })
    };
  });

  const spacerColumn = {
    width: '3rem',
    id: 'space',
    getId: () => 'space',
    getContent() {
      return <div />;
    }
  };

  const countLabelForTable = carbonTableEnabled ? (
    <Tooltip content={countLabel} align="auto">
      <bdi className={locals.bdi}>
        <div className={locals.carbonHeaderEllipsis}>{countLabel}</div>
      </bdi>
    </Tooltip>
  ) : (
    countLabel
  );

  const countLabelColumnTable = {
    width: carbonTableEnabled ? '3rem' : '6rem',
    id: countLabel,
    getId: () => countLabel,
    label: countLabelForTable,
    sortable: false,
    getContent(item) {
      return item.count;
    }
  };

  const countLabelColumn = {
    width: '8rem',
    id: countLabel,
    getId: () => countLabel,
    getContent({ group }) {
      return <KeyValue label={countLabel} value={group.count} theme="blue" accentuated />;
    },
    getType() {
      return 'count';
    }
  };

  const metricsColumn = getMetricsColumn({ metrics, metricMetadatas, timeConfig, granularity, isTableMode });

  const focusGroupColumn = {
    width: '3rem',
    id: 'focusOnGroup',
    getContent({ group }) {
      return (
        <Tooltip content={t('in-infrastructure:explore.focusOnThisGroup')}>
          <IconButton
            type="lib_actions_filter"
            href={getLinkToInfraEntityExplore(getParamsForGroup(group))}
            onClick={() => onFocusOnGroup?.(group)}
          />
        </Tooltip>
      );
    },
    getId: () => 'focusOnGroup'
  };

  if (isTableMode) {
    const tableColumns = isCounterVisible ? [countLabelColumnTable] : [];

    return [iconColumn, ...groupsColumn, ...tableColumns, ...metricsColumn];
  }

  return [iconColumn, ...groupsColumn, spacerColumn, countLabelColumn, ...metricsColumn, focusGroupColumn];
}

function getColumnWidth(groupBy, metrics, isTableMode) {
  const totalMetrics = isTableMode ? 4 : 5;
  return Math.max(1, (totalMetrics - metrics.length) / groupBy.length) * 12 + 'rem';
}

export function getGroups({
  timeConfig,
  backendQueryModel,
  groupBy,
  cursor,
  type,
  order,
  metrics,
  retrievalSize,
  granularity,
  fullData = false,
  missingPlaceholder
}) {
  if (!backendQueryModel) {
    return just(pendingResult);
  }

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
        .flatMap(({ metric, aggregation, crossSeriesAggregation, regex, required }) => {
          const id = getMetricKey(metric, aggregation, crossSeriesAggregation);
          const kpiGranularity = timeConfig.windowSize;
          return [
            [
              id,
              {
                metric,
                granularity: kpiGranularity,
                aggregation,
                crossSeriesAggregation,
                regex,
                required
              }
            ],
            [
              getSeriesKey(id),
              {
                metric,
                granularity,
                aggregation,
                crossSeriesAggregation,
                regex,
                required
              }
            ]
          ];
        })
    ),
    order,
    missingPlaceholder
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

export function toTagFilters(tags) {
  return Object.entries(tags).map(([tag, value]) => toTagFilter(tag, value));
}

function toTagFilter(tag, value) {
  if (value === '') {
    return {
      type: TAG_FILTER_TYPE,
      operator: IS_BLANK,
      name: tag
    };
  }
  if (value === tag_not_present_group) {
    return {
      type: TAG_FILTER_TYPE,
      operator: IS_EMPTY,
      name: tag
    };
  }
  return {
    type: TAG_FILTER_TYPE,
    operator: EQUALS,
    name: tag,
    value
  };
}

const defaultGroupIcon = 'lib_views_tag';

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
    return plugin ? getPluginName(group.tags[typeTag]) : replaceTagNotPresentPlaceholder(group.tags[key]);
  } else {
    return replaceTagNotPresentPlaceholder(group.tags[key]);
  }
}

function replaceTagNotPresentPlaceholder(value) {
  return value === tag_not_present_group ? (
    <div className={locals.italic}>{t('in-infrastructure:explore.tagNotPresent')}</div>
  ) : value === '' ? (
    <div className={locals.italic}>{t('in-components:chart.chartLegendBlankLabel')}</div>
  ) : (
    value
  );
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
      <MetricCatalogAndSortingConfigurator {...props} showTagCatalog={false} />
    </>
  );
}

export function getMetricsColumn({ metrics, metricMetadatas, timeConfig, granularity, isTableMode }) {
  return metrics.map(
    ({
      metric,
      aggregation,
      crossSeriesAggregation,
      formatterId,
      isFormatterSelected,
      label: metricLabel,
      lastValue,
      unit,
      threshold
    }) => {
      const metadata = mapData(metricMetadatas, data => data[metric]);
      const label = { data: metricLabel } ?? mapData(metadata, data => data?.label);
      const id = getMetricKey(metric, aggregation, crossSeriesAggregation);
      const sharedProps = {
        id,
        timeConfig,
        granularity,
        metadata,
        label,
        aggregation,
        formatterId,
        isFormatterSelected,
        lastValue,
        unit,
        threshold
      };
      const metricsColumns = getMetricsColumns(isTableMode, sharedProps);

      return {
        width: '12rem',
        id,
        label,
        headCellProps: { className: locals.metricLabel },
        aggregation,
        renderLabel: MetricLabel,
        ...metricsColumns,
        getId() {
          return getMetricKey(metric, aggregation, crossSeriesAggregation);
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
      };
    }
  );
}

function generateMetric({
  item,
  id,
  metadata,
  label,
  aggregation,
  timeConfig,
  granularity,
  formatterId,
  isFormatterSelected,
  lastValue,
  unit,
  threshold
}) {
  const { metrics } = item;

  const renderedLabel = <MetricLabel label={label} aggregation={aggregation} />;

  const formatterType = formatterId?.split('.')[1];
  const formatter = isFormatterSelected
    ? getFormatter(formatterId)
    : getMetricFormatterFromUnitOrDefault(
        getBaseUnit(unit),
        mapData(metadata, data => data?.formatter).data,
        formatterType
      );
  const unitConverter = getUnit(unit)?.converter;
  const seriesKey = getSeriesKey(id);
  const kpi = lastValue ? lastValueForMetric(metrics[seriesKey]) : firstValue(metrics[id]);
  const series = getConvertedSeries(metrics[seriesKey], unitConverter);
  const percentageMetric = mapData(metadata, data => data?.percentageMetric).data;
  const customValueTooltip = lastValue && getLastValueTooltipLabel(timeConfig);
  const extremeValue = extremeValueInSeries(threshold, series);
  const { strokeColor, fillColor } = getThresholdColors(threshold, extremeValue, formatterId);

  return (
    <SparkChart
      horizontalMetricValue={getMetricValue(kpi, formatter, unitConverter)}
      percentageMetric={percentageMetric}
      tooltipFormatter={formatter}
      aggregation={aggregation}
      timeConfig={timeConfig}
      label={renderedLabel}
      rollup={granularity}
      metrics={series}
      customValueTooltip={customValueTooltip}
      strokeColor={strokeColor}
      fillColor={fillColor}
      customChartTooltip={threshold && <ThresholdTooltip threshold={threshold} formatter={formatter} />}
    />
  );
}

function getMetricsColumns(isTableMode, sharedProps) {
  if (isTableMode) {
    return {
      getContent(item) {
        return generateMetric({
          item,
          ...sharedProps
        });
      }
    };
  }

  return {
    getContent({ group }) {
      return generateMetric({
        item: group,
        ...sharedProps
      });
    }
  };
}

function getDependencies({ isPreview, isCounterVisible, isTableMode, hasMetricsChanged, retrievalSize, metrics }) {
  if (isPreview) {
    return [retrievalSize, isCounterVisible, hasMetricsChanged && metrics];
  }

  if (isTableMode) {
    return [isCounterVisible];
  }

  return [metrics];
}
