/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useEffect } from 'react';
import classNames from 'classnames';
import Toggle from 'react-toggle';

import { useObservable } from '@instana/hooks';
import { SvgIcon } from '@instana/components';
import { empty } from '@instana/observables';

import { getGroupingTagCatalog as getTraceGroupingTagCatalog } from 'in-applications/analyze/components/workspace/TraceGroupingConfigurator';
import { getGroupingTagCatalog as getCallGroupingTagCatalog } from 'in-applications/analyze/components/workspace/CallGroupingConfigurator';
import { getTagCatalog as getTraceFilteringTagCatalog } from 'in-applications/analyze/components/workspace/TraceQueryBuilder';
import { getTagCatalog as getCallFilteringTagCatalog } from 'in-applications/analyze/components/workspace/CallQueryBuilder';
import MetricAndSortingConfigurator from 'in-new-components/MetricAndSortingConfigurator/MetricAndSortingConfigurator';
import { isInternalVisible$ } from 'in-new-components/MainNavigation/components/ViewSwitcher/isInternalVisibleStore';
import { UNSPECIFIED, NO_VALUE, UNSPECIFIED_LABEL, NO_VALUE_LABEL } from 'in-analyze/components/GroupedTraces/Group';
import { sanitizeTagFilter, type as TAG_FILTER_TYPE } from 'in-new-components/QueryBuilder/transformation/tagFilter';
import { EQUALS, IS_EMPTY, NOT_EMPTY, IS_BLANK } from 'in-new-components/QueryBuilder/tagFilter/operators';
import { aggregateMetricKey, sparkChartMetricKey, chartMetricKey } from 'in-applications/analyze/metrics';
import { NUMBER, KEY_VALUE_PAIR, BOOLEAN } from 'in-new-components/QueryBuilder/tagFilter/types';
import { addTagFilters } from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import FacetedSearch from 'in-applications/analyze/components/FacetedSearch/FacetedSearch';
import { joinExpressions } from 'in-new-components/QueryBuilder/transformation/formModel';
import QueryProgressIndicator from 'in-new-components/AnalyzeView/QueryProgressIndicator';
import { ua2MetricAddedTracker, ua2MetricRemovedTracker } from 'in-applications/tracker';
import CountHeader from 'in-new-components/QueryBuilder/components/Header/CountHeader';
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
import LoadMoreLi from 'in-new-components/lists/List/LoadMoreLi/LoadMoreLi';
import { ColumnizedContent, Ul, Li } from 'in-new-components/lists/List';
import { dataSourceConstants } from 'in-applications/analyze/metrics';
import { getSparkChartGranularity } from 'in-applications/metrics';
import IconButton from 'in-new-components/IconButton/IconButton';
import useTagCatalog from 'in-applications/hooks/useTagCatalog';
import useCursorPagination from 'in-hooks/useCursorPagination';
import { getChartGranularity } from 'in-stores/metric/metric';
import { formatDateTime } from 'in-services/formatters/date';
import List from 'in-applications/analyze/components/List';
import KeyValue from 'in-new-components/lists/KeyValue';
import { emptyArray } from 'in-services/fixedObjects';
import Tooltip from 'in-components/Tooltip/Tooltip';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t } from 'in-i18n';

import locals from './List.mless';

export default function GroupedList({
  tagFilterExpression,
  formModel,
  groupBy,
  orderBy,
  subOrderBy,
  metrics,
  onFocusOnGroup,
  onChangeOrderBy,
  onChangeSubOrderBy,
  onChangeMetrics,
  onChangePreviewEnabled,
  previewEnabled,
  isValid,
  updateFilter,
  updateGroup,
  hiddenCalls,
  onChangeHiddenCalls,
  dataSource,
  onResult,
  showChartGroupMarkers,
  groupColors,
  getNestedUngroupedData,
  linkFormModel
}) {
  const internalVisible = useObservable(isInternalVisible$, []) || false;
  const defaultOrder = dataSourceConstants[dataSource].metricKey;
  const defaultDirection = 'DESC';
  const timeConfig = useTimeConfig();
  const chartGranularity = getChartGranularity(timeConfig);
  const sparkChartGranularity = getSparkChartGranularity(timeConfig);
  const order = { by: orderBy.by || defaultOrder, direction: orderBy.direction || defaultDirection };
  const fixedMetrics = dataSourceConstants[dataSource].fixedMetrics;
  const queryPrecision = internalVisible && previewEnabled ? 'APPROXIMATE' : 'FULL';

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
            dataSource,
            queryPrecision
          })
        : empty,
    [timeConfig, tagFilterExpression, groupBy, orderBy, metrics, isValid, hiddenCalls, dataSource, queryPrecision]
  );

  useEffect(() => {
    if (isValid && onResult) {
      onResult(result);
    }
  }, [result?.progress.loading, isValid, onResult, tagFilterExpression, dataSource]);

  const filteringTagCatalog = useTagCatalog(
    dataSource === 'traces' ? getTraceFilteringTagCatalog : getCallFilteringTagCatalog
  );

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
      onChangePreviewEnabled={onChangePreviewEnabled}
      previewEnabled={previewEnabled}
      tagFilterExpression={tagFilterExpression}
      formModel={formModel}
      updateFilter={updateFilter}
      updateGroup={updateGroup}
      showChartGroupMarkers={showChartGroupMarkers}
      groupColors={groupColors}
      isValid={isValid}
      groupByTagType={groupByTagType}
      dataSource={dataSource}
      getNestedUngroupedData={getNestedUngroupedData}
      linkFormModel={linkFormModel}
      tagCatalog={filteringTagCatalog}
      {...result}
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
  adjustedWindowSize,
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
  onChangePreviewEnabled,
  previewEnabled,
  tagFilterExpression,
  formModel,
  updateFilter,
  updateGroup,
  hiddenCalls,
  onChangeHiddenCalls,
  showChartGroupMarkers,
  groupColors,
  isValid,
  groupByTagType,
  dataSource,
  getNestedUngroupedData,
  linkFormModel,
  tagCatalog
}) {
  const isLoading = progress.loading || !groupByTagType;
  const labelColumnDefinitions = labelColumns({ groupBy, showChartGroupMarkers, groupColors });
  const metricColumnDefinitions = metricColumns({ metrics: [...fixedMetrics, ...selectableMetrics], dataSource });
  const actionColumnDefinitions = actionColumns({ groupBy, onFocusOnGroup, groupByTagType });
  return (
    <div className={locals.wrapper}>
      <div className={locals.hitsAndFacetedSearch}>
        <div className={locals.hits}>
          <CountHeader
            totalHits={totalHits}
            withGrouping
            withAdjustedWindowSizeTooltip={Boolean(adjustedWindowSize)}
            withSamplingTooltip
          />
        </div>
        <FacetedSearch
          tagFilterExpression={tagFilterExpression}
          formModel={formModel}
          updateFilter={updateFilter}
          updateGroup={updateGroup}
          hiddenCalls={hiddenCalls}
          onChangeHiddenCalls={onChangeHiddenCalls}
          isValid={isValid}
          dataSource={dataSource}
          groupbyTag={groupBy.groupbyTag}
          tagCatalog={tagCatalog}
        />
      </div>
      <div className={locals.table}>
        <HeaderRow
          order={order}
          fixedMetrics={fixedMetrics}
          selectableMetrics={selectableMetrics}
          onChangeOrderBy={onChangeOrderBy}
          onChangeMetrics={onChangeMetrics}
          onChangePreviewEnabled={onChangePreviewEnabled}
          previewEnabled={previewEnabled}
          dataSource={dataSource}
        />
        <Ul framed={!isLoading && totalHits > 0}>
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
                  highlightOpenState={false}
                  toggleContentOnRowClick
                  className={classNames({ [locals.unspecified]: item.name === UNSPECIFIED })}
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
                      previewEnabled={previewEnabled}
                      groupByTagType={groupByTagType}
                      dataSource={dataSource}
                      getNestedUngroupedData={getNestedUngroupedData}
                      linkFormModel={linkFormModel}
                    />
                  )}
                  roundShadow
                >
                  <div className={locals.list}>
                    <div className={locals.labelColumn}>
                      <ColumnizedContent columnDefinitions={labelColumnDefinitions} group={item} />
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
          {canLoadMore && <LoadMoreLi loadMore={loadMore} />}
          {isValid && (
            <QueryProgressIndicator progress={{ ...progress, loading: isLoading }} errors={errors} items={items} />
          )}
        </Ul>
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
      const groupNameWithTooltip = <GroupLabelTooltip groupName={group.name} />;
      return <KeyValue label={label} customValue={groupNameWithTooltip} accentuated />;
    }
  });
}

function metricColumns({ metrics, dataSource }) {
  return [
    {
      width: '10rem',
      shrink: false,
      getContent({ group }) {
        const earliestTimestamp = formatDateTime(group.timestamp);
        return (
          <KeyValue
            label={t('in-applications:analyze.groupedList.earliestTimestamp')}
            customValue={earliestTimestamp}
            accentuated
          />
        );
      }
    }
  ].concat(metrics.map(metric => metricToColumn(metric, dataSource)));
}

function actionColumns({ groupBy, onFocusOnGroup, groupByTagType }) {
  return [
    {
      width: '3rem',
      shrink: false,
      getContent({ group }) {
        return (
          <Tooltip content={t('in-applications:analyze.groupedList.focusGroupTooltip')}>
            <IconButton
              type="lib_actions_filter"
              onClick={() => onFocusOnGroup(groupingFilter({ groupBy, group: group.name, groupByTagType }))}
              className={locals.focusButton}
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
    width: '16rem',
    minWidth: '9rem',
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

function getGroups({
  timeConfig,
  tagFilterExpression,
  groupBy,
  order,
  metrics,
  cursor,
  hiddenCalls,
  dataSource,
  queryPrecision
}) {
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
    includeInternal,
    queryPrecision
  });
}

function getSortingMetricLabel(sortingMetricLabel, aggregation, type) {
  if (aggregation.startsWith('P')) {
    return t('in-applications:analyze.groupedList.sortingMetricLabelTh', {
      sortingMetricLabel: sortingMetricLabel,
      num: aggregation.substring(1)
    });
  } else if (type === 'rate') {
    return t('in-applications:analyze.groupedList.sortingMetricLabelRate', {
      sortingMetricLabel: sortingMetricLabel
    });
  } else if (type === 'count') {
    return t('in-applications:analyze.groupedList.sortingMetricLabelCount', {
      sortingMetricLabel: sortingMetricLabel
    });
  } else if (type === 'time') {
    return t('in-applications:analyze.groupedList.sortingMetricLabelTime', {
      sortingMetricLabel: sortingMetricLabel,
      time: aggregation.toLowerCase()
    });
  } else {
    return sortingMetricLabel;
  }
}

function HeaderRow({
  order,
  onChangeOrderBy,
  fixedMetrics,
  selectableMetrics,
  onChangeMetrics,
  onChangePreviewEnabled,
  previewEnabled,
  dataSource
}) {
  const internalVisible = useObservable(isInternalVisible$, []) || false;
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
  const sortingOptions = [
    { label: t('in-applications:analyze.groupedList.groupName'), value: 'group' },
    { label: t('in-applications:analyze.groupedList.earliestTimestamp'), value: 'firstTimestamp' },
    ...[...fixedMetrics, ...selectableMetrics].map(metric => {
      return {
        value: aggregateMetricKey(metric.metric, metric.aggregation),
        label: getSortingMetricLabel(
          sortingMetricConfiguration[metric.metric].label,
          metric.aggregation,
          sortingMetricConfiguration[metric.metric].type
        )
      };
    })
  ];
  return (
    <div className={locals.header}>
      <MetricAndSortingConfigurator
        sortOptions={sortingOptions}
        order={order}
        setOrder={order => onChangeOrderBy(order)}
        metrics={selectableMetrics}
        setMetrics={onChangeMetrics}
        metricOptions={metricOptions}
        tracking={{
          onMetricAdded: ({ metric, aggregation }) => ua2MetricAddedTracker({ dataSource, metric, aggregation }),
          onMetricAggregationChanged: ({ metric, aggregation }) =>
            ua2MetricAddedTracker({ dataSource, metric, aggregation }),
          onMetricRemoved: ({ metric, aggregation }) => ua2MetricRemovedTracker({ dataSource, metric, aggregation })
        }}
      />
      {internalVisible && (
        <div className={locals.preview}>
          <span>{t('in-applications:analyze.preview')}</span>
          <Toggle checked={previewEnabled} onChange={e => onChangePreviewEnabled(e.target.checked)} />
        </div>
      )}
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
  previewEnabled,
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
      filterBy={() => onFocusOnGroup(groupingFilter({ groupBy, group: group.name, groupByTagType }))}
      orderBy={subOrderBy}
      onChangeOrderBy={onChangeSubOrderBy}
      tableOnly
      isValid
      withoutPadding
      hiddenCalls={hiddenCalls}
      previewEnabled={previewEnabled}
      dataSource={dataSource}
      getNestedUngroupedData={getNestedUngroupedData}
      linkFormModel={joinExpressions({
        expressions: [linkFormModel, groupingFilter({ groupBy, group: group.name, groupByTagType })]
      })}
    />
  );
}

export function groupingFilter({ groupBy, group, operator = EQUALS, groupByTagType }, tagFilterExpression = null) {
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
    let value;
    if (groupByTagType === NUMBER) {
      value = Number(group);
    } else if (groupByTagType === BOOLEAN) {
      value = group === 'true';
    } else {
      value = group;
    }
    groupFilter = {
      type: TAG_FILTER_TYPE,
      operator: operator,
      name: groupBy.groupbyTag,
      key: groupBy.groupbyTagSecondLevelKey,
      value: operator === EQUALS ? value : undefined,
      entity: groupBy.groupbyTagEntity
    };
  }
  return addTagFilters(tagFilterExpression, [sanitizeTagFilter(groupFilter)]);
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

function GroupLabelTooltip({ groupName }) {
  const label = groupLabel(groupName);
  return (
    <Tooltip content={label} align="bottomLeft" delay={1000}>
      <div
        className={classNames({
          [locals.italic]: groupName === UNSPECIFIED || groupName === NO_VALUE
        })}
      >
        {label}
      </div>
    </Tooltip>
  );
}

export function groupLabel(groupName) {
  if (groupName === UNSPECIFIED) {
    return UNSPECIFIED_LABEL;
  }
  if (groupName === NO_VALUE) {
    return NO_VALUE_LABEL;
  }
  return groupName;
}
