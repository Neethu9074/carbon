/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { empty } from '@instana/observables';
import React, { useEffect, useMemo } from 'react';
import { range } from 'lodash';
import theme from 'in-themes';
import rpt from 'prop-types';
import { t } from 'in-i18n';

import {
  getAvailableMetrics,
  getSingleNumberMetricId,
  getSparkChartTimeSeriesMetricId,
  groupName
} from 'in-new-components/AnalyzeView/metrics';
import { joinExpressions, removeTopLevelFilters, TAG } from 'in-new-components/QueryBuilder/transformation/formModel';
import { toBackendQueryModel } from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import { custom as customType, metric as metricType } from 'in-new-components/AnalyzeView/fieldTypes';
import { addGroupingCriteriaToFormModel } from 'in-new-components/AnalyzeView/StateManagement';
import { ua2MetricAddedTracker, ua2MetricRemovedTracker } from 'in-new-components/tracker';
import QueryProgressIndicator from 'in-new-components/AnalyzeView/QueryProgressIndicator';
import { childrenArgsAsPropTypes } from 'in-new-components/AnalyzeView/StateManagement';
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
import { KEY_VALUE_PAIR } from 'in-new-components/QueryBuilder/tagFilter/types';
import LoadMoreLi from 'in-new-components/lists/List/LoadMoreLi/LoadMoreLi';
import { ColumnizedContent, Ul, Li } from 'in-new-components/lists/List';
import FacetedSearch from 'in-new-components/AnalyzeView/FacetedSearch';
import { getFormatter } from 'in-services/formatters/backendFormatter';
import useStableObjectInstance from 'in-hooks/useStableObjectInstance';
import Header from 'in-new-components/QueryBuilder/components/Header';
import { getSparkChartGranularity } from 'in-applications/metrics';
import { emptyObject, emptyArray } from 'in-services/fixedObjects';
import IconButton from 'in-new-components/IconButton/IconButton';
import { NOT_EMPTY } from '../QueryBuilder/tagFilter/operators';
import useCursorPagination from 'in-hooks/useCursorPagination';
import KeyValue from 'in-new-components/lists/KeyValue';
import { aggregationLabels } from 'in-stores/metric';
import Tooltip from 'in-components/Tooltip/Tooltip';
import useTimeConfig from 'in-hooks/useTimeConfig';
import SvgIcon from 'in-components/SvgIcon';

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
    getLabel,
    isValid,
    selectableFields,
    fixedFields,
    onSelectableFieldsChange,
    metricCatalog,
    metricCatalogFilter,
    dataSource,
    facetedSearchItems,
    getFacetedSearchSuggestions,
    onFormModelChange,
    getHrefWithTagFilterExpression,
    groupedViewConfiguration,
    getItemLabel,
    itemlabelColumnId,
    onChartableDataSeriesChange,
    withSamplingTooltip,
    withResultsInGroups,
    withoutSorting = false,
    withoutChartGroupMarkers = false,
    chartedMetrics,
    groupingTagCatalog
  } = props;
  const timeConfig = useTimeConfig();
  const fields = [...fixedFields, ...selectableFields];

  const maxGroupsOnChart = Math.min(5, theme.lib.colors.chart.strokeColors100.length);
  const groupColors = range(maxGroupsOnChart).map(i => theme.lib.colors.chart.strokeColors100[i]);
  const showChartGroupMarkers =
    !withoutChartGroupMarkers && chartedMetrics?.[0] && chartedMetrics[0].aggregationId !== 'DISTRIBUTION';

  const labelColumnDefinitions = labelColumns({
    itemlabelColumnId,
    getItemLabel,
    showChartGroupMarkers,
    groupColors
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
    totalRepresentedItemCount
  } = useCursorPagination(
    ({ cursor }) =>
      isValid
        ? getData({ timeConfig, orderByGroups, backendQueryModel, groupBy, cursor, metrics: backendMetrics })
        : empty,
    [isValid, timeConfig, groupBy, backendQueryModel, orderByGroups, backendMetrics]
  );

  const isLoading = props.isLoading || progress?.loading;
  const hasErrors = !isLoading && errors?.length > 0;
  const hasItems = !isLoading && items.length > 0;

  const getNewTagFilterExpression = ({ add = emptyArray, remove = emptyArray }) =>
    joinExpressions({
      expressions: [removeTopLevelFilters(formModel, ...remove), ...add]
    });

  useEffect(() => {
    if (isLoading || hasErrors) {
      return;
    }

    onChartableDataSeriesChange(
      items.slice(0, 5).map(item => ({
        label: getItemLabel(item),
        formModel: addGroupingCriteriaToFormModel(groupBy, getItemLabel(item), formModel, groupingTagCatalog)
      }))
    );
  }, [
    items,
    isLoading,
    hasErrors,
    onChartableDataSeriesChange,
    formModel,
    getItemLabel,
    groupBy,
    dataSource,
    groupingTagCatalog
  ]);

  const sortOptions = fields
    .map(field => {
      const value = groupedViewConfiguration.getOrderById && groupedViewConfiguration.getOrderById({ field: field });
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
  sortOptions.unshift({ value: groupName, label: t('in-new-components:analyze.groupName') });

  const availableMetrics = getAvailableMetrics({ metricCatalog, metricCatalogFilter, fixedFields });

  const formModelExcludingMissingGroupingTag = useMemo(() => {
    const excludeMissingGroupTagFilter = {
      type: TAG,
      operator: NOT_EMPTY,
      name: groupBy.groupbyTag
    };
    const groupByTagType = groupingTagCatalog?.tags.find(t => t.name === groupBy.groupbyTag)?.type;
    if (groupByTagType === KEY_VALUE_PAIR) {
      excludeMissingGroupTagFilter.key = groupBy.groupbyTagSecondLevelKey;
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
            getSuggestions={tag =>
              getFacetedSearchSuggestions({
                timeConfig,
                backendQueryModel,
                backendQueryModelExcludingMissingGroupingTag,
                metricKey: 'facetedSearchMetric',
                group: {
                  groupbyTag: tag
                },
                dataSource
              })
            }
            groupbyTag={groupBy.groupbyTag}
          />
        )}
        <div className={locals.resultContainer}>
          {hasItems && (
            <Ul space="xsmall">
              {items.map(item => {
                const label = getLabel(item);
                return (
                  <Li
                    key={label}
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
              {canLoadMore && <LoadMoreLi loadMore={loadMore} />}
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

function labelColumns({ itemlabelColumnId, getItemLabel, showChartGroupMarkers, groupColors }) {
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
      id: itemlabelColumnId,
      getContent({ item, groupBy: { groupbyTag }, groupingTagCatalog }) {
        let label = groupbyTag;
        const tagDefinition = groupingTagCatalog.tagsByName[groupbyTag];
        if (tagDefinition) {
          label = tagDefinition.label;

          label = (
            <span className={locals.groupLabel}>
              {tagDefinition.path
                .slice(0, tagDefinition.path.length - 1)
                .map(node => node.label)
                .join(' ')}
              <SvgIcon className={locals.arrowRight} type="lib_arrow_drop_right" />
              {tagDefinition.path[tagDefinition.path.length - 1].label}
            </span>
          );
        }
        return <KeyValue label={label} customValue={getItemLabel(item)} />;
      }
    }
  ];
}

function metricColumns({ columnDefinitions, fields, groupedViewConfiguration, metricCatalog }) {
  return [
    ...(columnDefinitions || emptyArray),

    ...fields
      .map(field => {
        if (field.type === customType) {
          return groupedViewConfiguration.customFieldRenderingInstructions[field.customFieldId];
        }

        return {
          shrink: false,
          width: '16rem',
          minWidth: '9rem',
          getContent({ item: { metrics }, timeConfig, progress, sparkChartGranularity }) {
            const metricDefinition = metricCatalog.find(({ metricId }) => metricId === field.metricId);
            return (
              <div className={locals.sparkChartWrapper}>
                <SparkChart
                  loading={progress?.loading}
                  rollup={sparkChartGranularity}
                  timeConfig={timeConfig}
                  aggregation={field.aggregationId}
                  metrics={metrics[getSparkChartTimeSeriesMetricId(field)]}
                  metric={metrics[getSingleNumberMetricId(field)]}
                  tooltipFormatter={getFormatter(metricDefinition?.formatter)}
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
            <IconButton type="lib_actions_filter" href={href} />
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
