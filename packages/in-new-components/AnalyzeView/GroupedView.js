/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useEffect, useMemo } from 'react';
import classNames from 'classnames';
import { range } from 'lodash';
import rpt from 'prop-types';

import { KeyValue } from '@instana/components';
import { SvgIcon } from '@instana/components';
import { empty } from '@instana/observables';

import {
  getAvailableMetrics,
  getSingleNumberMetricId,
  getSparkChartTimeSeriesMetricId,
  groupName
} from 'in-new-components/AnalyzeView/metrics';
import { joinExpressions, removeTopLevelFilters, TAG } from 'in-new-components/QueryBuilder/transformation/formModel';
import { UNSPECIFIED, NO_VALUE, UNSPECIFIED_LABEL, NO_VALUE_LABEL } from 'in-analyze/components/GroupedTraces/Group';
import { toBackendQueryModel } from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import { custom as customType, metric as metricType } from 'in-new-components/AnalyzeView/fieldTypes';
import { or } from 'in-new-components/QueryBuilder/ConjunctionSelectorOverlay/supportedSelections';
import { addGroupingCriteriaToFormModel } from 'in-new-components/AnalyzeView/StateManagement';
import { ua2MetricAddedTracker, ua2MetricRemovedTracker } from 'in-new-components/tracker';
import QueryProgressIndicator from 'in-new-components/AnalyzeView/QueryProgressIndicator';
import { BOOLEAN, KEY_VALUE_PAIR } from 'in-new-components/QueryBuilder/tagFilter/types';
import { childrenArgsAsPropTypes } from 'in-new-components/AnalyzeView/StateManagement';
import { EQUALS, NOT_EMPTY } from 'in-new-components/QueryBuilder/tagFilter/operators';
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
import { withSiPrefixOneDecimalPlace } from 'in-services/formatters/number';
import LoadMoreLi from 'in-new-components/lists/List/LoadMoreLi/LoadMoreLi';
import { ColumnizedContent, Ul, Li } from 'in-new-components/lists/List';
import FacetedSearch from 'in-new-components/AnalyzeView/FacetedSearch';
import { getFormatter } from 'in-services/formatters/backendFormatter';
import useStableObjectInstance from 'in-hooks/useStableObjectInstance';
import Header from 'in-new-components/QueryBuilder/components/Header';
import { tagFilter } from '../QueryBuilder/transformation/tagFilter';
import { getSparkChartGranularity } from 'in-applications/metrics';
import { emptyObject, emptyArray } from 'in-services/fixedObjects';
import IconButton from 'in-new-components/IconButton/IconButton';
import { enrichTagCatalog } from 'in-services/tags/tagCatalog';
import useCursorPagination from 'in-hooks/useCursorPagination';
import { aggregationLabels } from 'in-stores/metric';
import Tooltip from 'in-components/Tooltip/Tooltip';
import useTimeConfig from 'in-hooks/useTimeConfig';
import theme from 'in-themes';
import { t } from 'in-i18n';

import locals from './GroupedView.mless';

export default function GroupedAnalyzeView(props) {
  const {
    getData,
    groupBy,
    orderByGroups,
    onOrderByGroupsChange,
    backendQueryModel,
    formModel,
    getHrefToUngroupedView,
    getHrefToGroupedView,
    UngroupedView,
    getLabel = ({ name }) => JSON.parse(name),
    isValid,
    selectableFields,
    fixedFields,
    onSelectableFieldsChange,
    metricCatalog,
    dataSource,
    facetedSearchItems,
    getFacetedSearchSuggestions,
    onFormModelChange,
    getHrefWithTagFilterExpression,
    groupedViewConfiguration,
    getOrderByGroupId,
    itemlabelColumnId,
    onChartableDataSeriesChange,
    withSamplingTooltip,
    withResultsInGroups,
    withoutSorting = false,
    withoutChartGroupMarkers = false,
    chartedMetrics,
    filteringTagCatalog,
    tracker,
    groupingTagCatalog,
    additionalGetDataDependencies = []
  } = props;
  const timeConfig = useTimeConfig();
  const fields = [...fixedFields, ...selectableFields];

  const maxGroupsOnChart = Math.min(5, theme.lib.colors.chart.strokeColors100.length);
  const groupColors = range(maxGroupsOnChart).map(i => theme.lib.colors.chart.strokeColors100[i]);
  const showChartGroupMarkers =
    !withoutChartGroupMarkers && chartedMetrics?.[0] && chartedMetrics[0].aggregationId !== 'DISTRIBUTION';

  const groupIcon =
    useMemo(() => {
      if (groupingTagCatalog != null) {
        const tagDefinition = enrichTagCatalog(groupingTagCatalog).tagsByName[groupBy.groupbyTag];
        if (tagDefinition?.path?.length > 0) {
          return tagDefinition.path[tagDefinition.path.length - 1].icon;
        }
      }
      return null;
    }, [groupingTagCatalog, groupBy]) ?? 'lib_views_tag';

  const labelColumnDefinitions = labelColumns({
    itemlabelColumnId,
    getLabel,
    showChartGroupMarkers,
    groupColors,
    groupIcon
  });
  const metricColumnDefinitions = metricColumns({
    columnDefinitions: props.columnDefinitions,
    fields,
    groupedViewConfiguration,
    metricCatalog
  });
  const actionColumnDefinitions = actionColumns();

  const sparkChartGranularity = getSparkChartGranularity(timeConfig);

  const backendMetrics = useStableObjectInstance(
    fields
      .filter(({ type }) => type === metricType)
      .reduce((accumulator, metric) => {
        const backendMetric = {
          metric: metric.metricId,
          aggregation: metric.aggregationId
        };
        accumulator[getSingleNumberMetricId(metric)] = backendMetric;
        accumulator[getSparkChartTimeSeriesMetricId(metric)] = {
          ...backendMetric,
          granularity: sparkChartGranularity
        };
        return accumulator;
      }, {})
  );

  const {
    items,
    errors,
    progress,
    canLoadMore,
    loadMore,
    totalHits,
    totalRepresentedItemCount,
    adjustedWindowSize
  } = useCursorPagination(
    ({ cursor }) =>
      isValid
        ? getData({ timeConfig, orderByGroups, backendQueryModel, groupBy, cursor, metrics: backendMetrics })
        : empty,
    [isValid, timeConfig, groupBy, backendQueryModel, orderByGroups, backendMetrics, ...additionalGetDataDependencies]
  );

  const isLoading = props.isLoading || progress?.loading;
  const hasErrors = !isLoading && errors?.length > 0;
  const hasItems = !isLoading && items.length > 0;

  const getNewTagFilterExpression = ({ add = emptyArray, remove = emptyArray }) =>
    joinExpressions({
      expressions: [removeTopLevelFilters(formModel, ...remove), ...add]
    });

  useEffect(() => {
    if (isLoading) {
      onChartableDataSeriesChange(null);
    } else if (hasErrors) {
      onChartableDataSeriesChange([]);
    } else {
      onChartableDataSeriesChange(
        items.slice(0, 5).map(item => ({
          label: getLabel(item),
          formModel: addGroupingCriteriaToFormModel(groupBy, getLabel(item), formModel, groupingTagCatalog)
        }))
      );
    }
  }, [
    items,
    isLoading,
    hasErrors,
    onChartableDataSeriesChange,
    formModel,
    getLabel,
    groupBy,
    dataSource,
    groupingTagCatalog
  ]);

  const sortOptions = fields
    .map(field => {
      const value = getOrderByGroupId({ field: field });
      if (value == null) {
        return;
      }
      if (field.type === customType) {
        const fieldLabel = groupedViewConfiguration.customFieldRenderingInstructions[field.customFieldId]?.label;
        return { value, label: fieldLabel ?? field.customFieldId };
      }
      const metricDefinition = metricCatalog?.find(({ metricId }) => metricId === field.metricId);
      const metricLabel = metricDefinition?.label ?? field.metricId;
      const aggregationLabel = aggregationLabels[field.aggregationId] ?? field.aggregationId;
      return { value, label: `${metricLabel} (${aggregationLabel})` };
    })
    .filter(Boolean);
  // Allow to sort by group name
  sortOptions.unshift({
    value: groupedViewConfiguration?.orderByGroupName ?? groupName,
    label: t('in-new-components:analyze.groupName')
  });

  const availableMetrics = getAvailableMetrics({ metricCatalog, fixedFields });

  const formModelExcludingMissingGroupingTag = useMemo(() => {
    const groupByTagType = groupingTagCatalog?.tags.find(t => t.name === groupBy.groupbyTag)?.type;
    let excludeMissingGroupTagFilter;
    if (groupByTagType === BOOLEAN) {
      // Boolean tags do not support the NOT_EMPTY operator
      excludeMissingGroupTagFilter = joinExpressions({
        logicalOperator: or,
        expressions: [tagFilter(groupBy.groupbyTag, EQUALS, true), tagFilter(groupBy.groupbyTag, EQUALS, false)]
      });
    } else {
      excludeMissingGroupTagFilter = {
        type: TAG,
        operator: NOT_EMPTY,
        name: groupBy.groupbyTag
      };
      if (groupByTagType === KEY_VALUE_PAIR) {
        excludeMissingGroupTagFilter.key = groupBy.groupbyTagSecondLevelKey;
      }
    }
    return joinExpressions({ expressions: [formModel, excludeMissingGroupTagFilter] });
  }, [formModel, groupBy, groupingTagCatalog]);

  const backendQueryModelExcludingMissingGroupingTag = useMemo(() => {
    return isValid ? toBackendQueryModel(formModelExcludingMissingGroupingTag) : null;
  }, [isValid, formModelExcludingMissingGroupingTag]);

  return (
    <>
      <Header
        {...props}
        sortOptions={withoutSorting ? undefined : sortOptions}
        availableMetrics={availableMetrics}
        metrics={selectableFields.map(m => ({ metric: m.metricId, aggregation: m.aggregationId }))}
        totalHits={totalHits}
        totalRepresentedItemCount={totalRepresentedItemCount}
        order={orderByGroups}
        setOrder={onOrderByGroupsChange}
        setMetrics={metrics =>
          onSelectableFieldsChange(
            metrics.map(metric => ({
              // Converting metrics to fields by adding the type
              metricId: metric.metric,
              aggregationId: metric.aggregation,
              type: metricType
            }))
          )
        }
        withGrouping
        withResultsInGroups={withResultsInGroups}
        withSamplingTooltip={withSamplingTooltip}
        withAdjustedWindowSizeTooltip={Boolean(adjustedWindowSize)}
        tracking={{
          onMetricAdded: ({ metric, aggregation }) => ua2MetricAddedTracker({ dataSource, metric, aggregation }),
          onMetricAggregationChanged: ({ metric, aggregation }) =>
            ua2MetricAddedTracker({ dataSource, metric, aggregation }),
          onMetricRemoved: ({ metric, aggregation }) => ua2MetricRemovedTracker({ dataSource, metric, aggregation })
        }}
      />
      <div className={locals.facetedSearchResultContainer}>
        {facetedSearchItems && facetedSearchItems.length > 0 && (
          <FacetedSearch
            facetedSearchItems={facetedSearchItems}
            formModel={formModel}
            formModelExcludingMissingGroupingTag={formModelExcludingMissingGroupingTag}
            onFacetedSearchChange={updateAddAndRemove =>
              onFormModelChange(getNewTagFilterExpression(updateAddAndRemove))
            }
            getUpdatedTagExpressionHref={updateAddAndRemove =>
              getHrefWithTagFilterExpression(getNewTagFilterExpression(updateAddAndRemove))
            }
            getHrefToGroupedView={getHrefToGroupedView}
            dataSource={dataSource}
            isValid={isValid}
            getSuggestions={({ tag, entity }) =>
              getFacetedSearchSuggestions({
                timeConfig,
                backendQueryModel,
                backendQueryModelExcludingMissingGroupingTag,
                metricKey: 'facetedSearchMetric',
                group: {
                  groupbyTag: tag
                },
                dataSource,
                entity
              })
            }
            groupbyTag={groupBy.groupbyTag}
            tagCatalog={filteringTagCatalog}
          />
        )}
        <div className={locals.resultContainer}>
          {hasItems && (
            <Ul>
              {items.map((item, index) => {
                const label = getLabel(item);
                return (
                  <Li
                    key={`${label}-${index}`}
                    toggleContentOnRowClick
                    renderNestedContent={() => {
                      const formModelForUnGroupedView = addGroupingCriteriaToFormModel(
                        groupBy,
                        label,
                        formModel,
                        groupingTagCatalog
                      );
                      return (
                        // tagFilterExpression / backendQueryModel must be separately memoized based on hash
                        // within the ungrouped view.
                        <UngroupedView
                          {...props}
                          withoutHeader
                          groupLabel={label}
                          groupBy={emptyObject}
                          backendQueryModel={toBackendQueryModel(formModelForUnGroupedView)}
                          formModel={formModelForUnGroupedView}
                          facetedSearchItems={[]}
                          withEmbeddedLoadingIndicator
                          withEmbeddedNoDataIndicator
                        />
                      );
                    }}
                    roundShadow
                  >
                    <div className={locals.list}>
                      <div className={locals.label}>
                        <ColumnizedContent {...props} columnDefinitions={labelColumnDefinitions} item={item} />
                      </div>
                      <div className={locals.metrics}>
                        <ColumnizedContent
                          {...props}
                          columnDefinitions={metricColumnDefinitions}
                          item={item}
                          progress={progress}
                          timeConfig={timeConfig}
                          sparkChartGranularity={sparkChartGranularity}
                        />
                      </div>
                    </div>
                    <ColumnizedContent
                      columnDefinitions={actionColumnDefinitions}
                      href={getHrefToUngroupedView(label)}
                    />
                  </Li>
                );
              })}
              {canLoadMore && (
                <LoadMoreLi
                  loadMore={() => {
                    loadMore();
                    tracker?.loadMoreClicked();
                  }}
                />
              )}
            </Ul>
          )}
          {isValid && (
            <QueryProgressIndicator progress={{ ...progress, loading: isLoading }} errors={errors} items={items} />
          )}
        </div>
      </div>
    </>
  );
}

function labelColumns({ itemlabelColumnId, getLabel, showChartGroupMarkers, groupColors, groupIcon }) {
  let i = 0;
  return [
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
      width: '2.5rem',
      getContent() {
        return (
          <div className={locals.center}>
            <SvgIcon type={groupIcon} />
          </div>
        );
      }
    },
    {
      id: itemlabelColumnId,
      getContent({ item, groupBy: { groupbyTag, groupbyTagSecondLevelKey }, groupingTagCatalog }) {
        let label = groupbyTag;
        const tagDefinition = groupingTagCatalog.tagsByName[groupbyTag];
        if (tagDefinition) {
          const tagCategory = tagDefinition.path
            .slice(0, tagDefinition.path.length - 1)
            .map(node => node.label)
            .join(' ');
          const tagName = tagDefinition.path[tagDefinition.path.length - 1].label;
          label = groupbyTagSecondLevelKey
            ? `${tagCategory}.${tagName} > ${groupbyTagSecondLevelKey}`
            : `${tagCategory}.${tagName}`;
        }
        return (
          <KeyValue
            label={<span className={locals.groupLabel}>{label}</span>}
            customValue={<GroupLabelTooltip groupName={getLabel(item)} />}
            accentuated
          />
        );
      }
    }
  ];
}

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

function metricColumns({ columnDefinitions, fields, groupedViewConfiguration, metricCatalog }) {
  return [
    ...(columnDefinitions || emptyArray),

    ...fields
      .map(field => {
        if (field.type === customType) {
          return groupedViewConfiguration.customFieldRenderingInstructions[field.customFieldId];
        }

        const metricDefinition = metricCatalog?.find(({ metricId }) => metricId === field.metricId);
        // The width of metric values rendered using NUMBER formatter can vary significantly which may
        // break column alignment, use more dense SI prefix based formatter instead.
        const formatter =
          metricDefinition?.formatter === 'NUMBER'
            ? withSiPrefixOneDecimalPlace
            : getFormatter(metricDefinition?.formatter);
        return {
          shrink: false,
          width: '16rem',
          minWidth: '9rem',
          getContent({ item: { metrics }, timeConfig, progress, sparkChartGranularity }) {
            return (
              <div className={locals.sparkChartWrapper}>
                <SparkChart
                  loading={progress?.loading}
                  rollup={sparkChartGranularity}
                  timeConfig={timeConfig}
                  aggregation={field.aggregationId}
                  metrics={metrics[getSparkChartTimeSeriesMetricId(field)]}
                  metric={metrics[getSingleNumberMetricId(field)]}
                  tooltipFormatter={formatter}
                  label={metricDefinition?.label ?? field.metricId}
                  valueTheme="blue"
                />
              </div>
            );
          }
        };
      })
      // We may not have a representation for all fields in the grouped view
      .filter(Boolean)
  ];
}

function actionColumns() {
  return [
    {
      id: 'focus',
      width: '3rem',
      shrink: false,
      getContent({ href }) {
        return (
          <Tooltip content={t('in-new-components:analyze.focusOnGroup')}>
            <IconButton type="lib_actions_filter" href={href} className={locals.focusButton} />
          </Tooltip>
        );
      }
    }
  ];
}

GroupedAnalyzeView.propTypes = {
  ...childrenArgsAsPropTypes,

  getData: rpt.func.isRequired,
  getLabel: rpt.func.isRequired,
  getItemName: rpt.func,
  CustomHeaderActions: rpt.elementType,
  columnDefinitions: rpt.array,
  UngroupedView: rpt.elementType.isRequired
};
